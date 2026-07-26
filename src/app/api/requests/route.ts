import { NextResponse } from 'next/server';
import { z } from 'zod';
import { enforceRateLimit, readJsonBody } from '@/lib/api-security';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const createRequestSchema = z.object({
  venue_id: z.string().trim().max(120).optional(),
  venue_name: z.string().trim().max(200).optional(),
  category: z.string().trim().min(1).max(100),
  request_type: z.string().trim().max(100).optional(),
  date_time: z.string().datetime().optional(),
  party_size: z.number().int().min(1).max(100).optional(),
  contact_name: z.string().trim().max(200).optional(),
  contact_info: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(4_000).optional(),
});

export async function POST(request: Request) {
  const rateLimited = enforceRateLimit(request, 'concierge-request', 10, 60_000);
  if (rateLimited) return rateLimited;

  try {
    const parsed = createRequestSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request details.' },
        { status: 400 },
      );
    }

    const authClient = await createSupabaseServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();
    const body = parsed.data;

    if (!user && (!body.contact_name || !body.contact_info)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact name and contact information are required.',
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const insertPayload = {
      user_id: user?.id ?? null,
      venue_id: body.venue_id ?? null,
      venue_name: body.venue_name ?? null,
      category: body.category,
      request_type: body.request_type ?? 'booking',
      date_time: body.date_time ?? new Date().toISOString(),
      party_size: body.party_size ?? 1,
      status: 'submitted',
      priority_score: 0,
      contact_name: body.contact_name ?? null,
      contact_info: body.contact_info ?? null,
      notes: body.notes ?? null,
    };

    const { data: created, error: createError } = await supabase
      .from('requests')
      .insert(insertPayload)
      .select(
        'id, user_id, venue_id, venue_name, category, request_type, date_time, party_size, status, priority_score, assigned_to, contact_name, contact_info, notes, internal_notes, supplier_response, confirmed_at, completed_at, created_at, updated_at, service_id, category_id, subcategory_id, booking_id, intent_id, priority',
      )
      .single();

    if (createError) {
      console.error('Failed to create request:', createError);
      return NextResponse.json(
        { success: false, error: 'Request could not be saved.' },
        { status: 500 },
      );
    }

    const { error: statusLogError } = await supabase
      .from('request_status_log')
      .insert({
        request_id: created.id,
        old_status: null,
        new_status: 'submitted',
        changed_by: user?.id ?? null,
        notes: null,
      });

    if (statusLogError) {
      console.error('Failed to write request status log:', statusLogError);
    }

    return NextResponse.json(
      {
        success: true,
        request_id: created.id,
        request: created,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE') {
      return NextResponse.json(
        { success: false, error: 'Request payload is too large.' },
        { status: 413 },
      );
    }

    if (error instanceof Error && error.message === 'INVALID_JSON') {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload.' },
        { status: 400 },
      );
    }

    console.error('Failed to create request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create request.' },
      { status: 500 },
    );
  }
}
