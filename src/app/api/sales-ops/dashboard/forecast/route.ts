import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { getRevenueForecast } from '@/lib/attribution-models';

export async function GET() {
  const supabaseAdmin = getSupabaseAdminClient();

  try {
    const forecast = await getRevenueForecast(supabaseAdmin);

    return NextResponse.json({
      ok: true,
      forecast,
    });
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
