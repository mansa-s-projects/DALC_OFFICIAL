import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { processLeadAutomation } from '@/lib/lead-automation';
import { enqueueCrmSyncJob, mapLeadToCrmFields } from '@/lib/crm-sync';
import { assignExperimentVariant, trackExperimentEvent } from '@/lib/experimentation';
import { recordApiFailure } from '@/lib/monitoring';

const trackEventSchema = z.object({
  event_name: z.string().min(1),
  page: z.string().optional().default(''),
  section: z.string().optional().default(''),
  cta_label: z.string().optional().default(''),
  client_event_id: z.string().optional(),
  metadata: z.record(z.any()).optional().default({}),
  session_id: z.string().optional(),
  attribution: z
    .object({
      session_id: z.string().optional(),
      source_page: z.string().optional(),
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_term: z.string().optional(),
      utm_content: z.string().optional(),
      referrer: z.string().optional(),
      user_agent: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = trackEventSchema.safeParse(json);

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
      body.attribution?.session_id ??
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
    const clientEventId =
      body.client_event_id ??
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

    const referrer = body.attribution?.referrer || request.headers.get('referer') || '';
    const userAgent = body.attribution?.user_agent || request.headers.get('user-agent') || '';

    const supabaseAdmin = getSupabaseAdminClient();
    const insertPayload = {
      created_at: now,
      client_event_id: clientEventId,
      event_name: body.event_name,
      page: body.page || body.attribution?.source_page || '',
      section: body.section,
      cta_label: body.cta_label,
      metadata: {
        ...(body.metadata || {}),
        attribution: {
          ...(body.attribution || {}),
          referrer,
          user_agent: userAgent,
        },
      },
      session_id: sessionId,
    };

    const { data: insertedEvent, error } = await supabaseAdmin
      .from('events')
      .upsert(insertPayload, { onConflict: 'client_event_id', ignoreDuplicates: true })
      .select('*')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const event = insertedEvent
      ? insertedEvent
      : (
          await supabaseAdmin
            .from('events')
            .select('*')
            .eq('client_event_id', clientEventId)
            .single()
        ).data;

    if (!event) {
      return NextResponse.json({ ok: false, error: 'Event persistence failed' }, { status: 500 });
    }

    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lead) {
      const { data: events } = await supabaseAdmin
        .from('events')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(200);

      await processLeadAutomation({
        supabaseAdmin,
        lead,
        events: events || [event],
        triggerSource: 'event_tracked',
      });

      const { data: latestLead } = await supabaseAdmin
        .from('leads')
        .select('*')
        .eq('id', lead.id)
        .single();

      const leadSnapshot = latestLead || lead;
      await enqueueCrmSyncJob({
        supabaseAdmin,
        leadId: leadSnapshot.id,
        jobType: 'update',
        payload: {
          ...mapLeadToCrmFields(leadSnapshot),
          last_event_name: event.event_name,
          last_event_at: event.created_at,
        },
        dedupeContext: clientEventId,
      });
    }

    const experimentKey = String(body.metadata?.experiment_key || '');
    if (experimentKey) {
      const assignment = await assignExperimentVariant({
        supabaseAdmin,
        experimentKey,
        sessionId,
      });

      await trackExperimentEvent({
        supabaseAdmin,
        experimentKey,
        sessionId,
        variant: assignment.variant,
        eventName: body.event_name,
        value:
          typeof body.metadata?.event_value === 'number'
            ? body.metadata.event_value
            : undefined,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    try {
      const supabaseAdmin = getSupabaseAdminClient();
      await recordApiFailure({
        supabaseAdmin,
        route: '/api/track-event',
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
