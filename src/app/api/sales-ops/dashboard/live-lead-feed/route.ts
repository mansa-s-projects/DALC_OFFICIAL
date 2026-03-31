import { NextRequest, NextResponse } from 'next/server';
import { fetchViewRows, getLimitFromRequest } from '@/lib/sales-ops-dashboard-api';

export async function GET(request: NextRequest) {
  try {
    const limit = getLimitFromRequest(request, 60, 250);
    const rows = await fetchViewRows('v_dashboard_live_lead_feed', {
      limit,
      orderBy: 'last_activity_at',
      ascending: false,
    });

    return NextResponse.json({ ok: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to load live lead feed' },
      { status: 500 }
    );
  }
}
