import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/api-auth';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { getRevenueForecast } from '@/lib/attribution-models';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'view_reports');
  if (auth instanceof NextResponse) return auth;

  const supabaseAdmin = getSupabaseAdminClient();

  try {
    const forecast = await getRevenueForecast(supabaseAdmin);
    return NextResponse.json({ ok: true, forecast });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to read revenue forecast',
      },
      { status: 500 }
    );
  }
}
