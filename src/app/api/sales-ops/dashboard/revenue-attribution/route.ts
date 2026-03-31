import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import {
  getFirstTouchAttribution,
  getLastTouchAttribution,
  getMultiTouchAttribution,
} from '@/lib/attribution-models';

export async function GET() {
  const supabaseAdmin = getSupabaseAdminClient();

  try {
    const [firstTouch, lastTouch, multiTouch] = await Promise.all([
      getFirstTouchAttribution(supabaseAdmin),
      getLastTouchAttribution(supabaseAdmin),
      getMultiTouchAttribution(supabaseAdmin),
    ]);

    return NextResponse.json({
      ok: true,
      first_touch: firstTouch,
      last_touch: lastTouch,
      multi_touch: multiTouch,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to read attribution models',
      },
      { status: 500 }
    );
  }
}
