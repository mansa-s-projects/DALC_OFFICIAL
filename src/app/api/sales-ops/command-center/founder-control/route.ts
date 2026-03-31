import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

function isAuthorized(request: NextRequest) {
  const expected = process.env.FOUNDER_API_TOKEN;
  if (!expected) return false;
  const provided = request.headers.get('x-api-token') || '';
  return expected === provided;
}

const upsertOverrideSchema = z.object({
  override_key: z.string().min(1),
  override_value: z.record(z.any()),
  enabled: z.boolean().optional().default(true),
  expires_at: z.string().optional().nullable(),
  reason: z.string().optional().default('manual override'),
  updated_by: z.string().optional().default('founder'),
});

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const supabaseAdmin = getSupabaseAdminClient();

  try {
    const [metrics, overrides] = await Promise.all([
      supabaseAdmin.from('v_cc_founder_control_metrics').select('*').limit(1).maybeSingle(),
      supabaseAdmin.from('v_cc_active_overrides').select('*').order('created_at', { ascending: false }),
    ]);

    if (metrics.error) throw new Error(metrics.error.message);
    if (overrides.error) throw new Error(overrides.error.message);

    return NextResponse.json({
      ok: true,
      data: {
        metrics: metrics.data || null,
        active_overrides: overrides.data || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to load founder control data',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const supabaseAdmin = getSupabaseAdminClient();

  try {
    const body = await request.json();
    const parsed = upsertOverrideSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid override payload', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    const { data, error } = await supabaseAdmin
      .from('founder_overrides')
      .upsert(
        {
          override_key: payload.override_key,
          override_value: payload.override_value,
          enabled: payload.enabled,
          expires_at: payload.expires_at || null,
          reason: payload.reason,
          updated_by: payload.updated_by,
        },
        { onConflict: 'override_key' }
      )
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to upsert founder override',
      },
      { status: 500 }
    );
  }
}
