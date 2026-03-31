import { NextRequest, NextResponse } from 'next/server';
import { fetchViewRows, getLimitFromRequest } from '@/lib/sales-ops-dashboard-api';

export async function GET(request: NextRequest) {
  try {
    const limit = getLimitFromRequest(request, 50, 200);
    const rows = await fetchViewRows('v_dashboard_hot_leads', {
      limit,
      orderBy: 'lead_score',
      ascending: false,
    });

    return NextResponse.json({ ok: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to load hot leads' },
      { status: 500 }
    );
  }
}
