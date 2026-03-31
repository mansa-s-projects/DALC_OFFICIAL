import { NextRequest, NextResponse } from 'next/server';
import { fetchViewRows, getLimitFromRequest } from '@/lib/sales-ops-dashboard-api';

export async function GET(request: NextRequest) {
  try {
    const limit = getLimitFromRequest(request, 100, 300);
    const rows = await fetchViewRows('v_dashboard_alerts', {
      limit,
      orderBy: 'occurred_at',
      ascending: false,
    });

    return NextResponse.json({ ok: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to load alerts' },
      { status: 500 }
    );
  }
}
