import { NextRequest, NextResponse } from 'next/server';
import { fetchViewRows, getLimitFromRequest } from '@/lib/sales-ops-dashboard-api';
import { requireAdminAuth } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'view_reports');
  if (auth instanceof NextResponse) return auth;

  try {
    const limit = getLimitFromRequest(request, 120, 400);
    const rows = await fetchViewRows('v_cc_critical_alerts', {
      limit,
      orderBy: 'alert_priority',
      ascending: false,
    });

    return NextResponse.json({ ok: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to load critical alerts',
      },
      { status: 500 }
    );
  }
}
