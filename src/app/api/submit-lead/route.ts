import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { processLeadAutomation } from '@/lib/lead-automation';
import { enqueueCrmSyncJob, mapLeadToCrmFields } from '@/lib/crm-sync';
import { enqueueLeadEnrichmentJob } from '@/lib/lead-enrichment';
import { enqueueWhatsAppJob } from '@/lib/whatsapp-automation';
import { recordApiFailure } from '@/lib/monitoring';

const submitLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(1),
  source_page: z.string().min(1),
  source_section: z.string().min(1),
  cta_label: z.string().min(1),
  service_slug: z.string().optional().or(z.literal('')),
  destination: z.string().min(1),
  utm_source: z.string().optional().default(''),
  utm_medium: z.string().optional().default(''),
  utm_campaign: z.string().optional().default(''),
  utm_term: z.string().optional().default(''),
  utm_content: z.string().optional().default(''),
  referrer: z.string().optional().default(''),
  user_agent: z.string().optional().default(''),
  session_id: z.string().optional(),
  client_submission_id: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = submitLeadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid payload', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const body = parsed.data;
    const now = new Date().toISOString();
    const sessionId =
      body.session_id ??
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
    const idempotencyKey =
      body.client_submission_id ??
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

    const supabaseAdmin = getSupabaseAdminClient();
    const insertPayload = {
      created_at: now,
      name: body.name,
      email: body.email || null,
      phone: body.phone,
      source_page: body.source_page,
      source_section: body.source_section,
      cta_label: body.cta_label,
      service_slug: body.service_slug || null,
      destination: body.destination,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_term: body.utm_term,
      utm_content: body.utm_content,
      referrer: body.referrer || request.headers.get('referer') || '',
      user_agent: body.user_agent || request.headers.get('user-agent') || '',
      session_id: sessionId,
      idempotency_key: idempotencyKey,
    };

    const { data: insertedLead, error } = await supabaseAdmin
      .from('leads')
      .upsert(insertPayload, { onConflict: 'idempotency_key', ignoreDuplicates: true })
      .select('*')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const lead = insertedLead
      ? insertedLead
      : (
          await supabaseAdmin
            .from('leads')
            .select('*')
            .eq('idempotency_key', idempotencyKey)
            .single()
        ).data;

    if (!lead) {
      return NextResponse.json({ ok: false, error: 'Lead persistence failed' }, { status: 500 });
    }

    const { data: events } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(200);

    await processLeadAutomation({
      supabaseAdmin,
      lead,
      events: events || [],
      triggerSource: 'lead_created',
    });

    const { data: latestLead } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', lead.id)
      .single();

    const leadSnapshot = latestLead || lead;

    await Promise.all([
      enqueueCrmSyncJob({
        supabaseAdmin,
        leadId: leadSnapshot.id,
        jobType: 'create',
        payload: mapLeadToCrmFields(leadSnapshot),
        dedupeContext: idempotencyKey,
      }),
      enqueueLeadEnrichmentJob({
        supabaseAdmin,
        leadId: leadSnapshot.id,
        dedupeContext: idempotencyKey,
      }),
    ]);

    if (String(leadSnapshot.lead_temperature || '') === 'hot') {
      await enqueueWhatsAppJob({
        supabaseAdmin,
        leadId: leadSnapshot.id,
        triggerType: 'hot_lead_created',
        templateKey: 'hot_lead_created',
        recipientPhone: leadSnapshot.phone || undefined,
        payload: {
          lead_id: leadSnapshot.id,
          source_page: leadSnapshot.source_page,
        },
        dedupeContext: idempotencyKey,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    try {
      const supabaseAdmin = getSupabaseAdminClient();
      await recordApiFailure({
        supabaseAdmin,
        route: '/api/submit-lead',
        method: 'POST',
        statusCode: 500,
        errorMessage: error instanceof Error ? error.message : 'Unexpected server error',
      });
    } catch {
      // Best effort monitoring only.
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unexpected server error',
      },
      { status: 500 }
    );
  }
}
