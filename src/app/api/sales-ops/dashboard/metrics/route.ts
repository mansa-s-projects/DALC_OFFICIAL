import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/api-auth';
import { fetchViewRows } from '@/lib/sales-ops-dashboard-api';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'view_reports');
  if (auth instanceof NextResponse) return auth;

  try {
    const rows = await fetchViewRows('v_dashboard_metrics', { limit: 1 });
    return NextResponse.json({ ok: true, data: rows[0] || null });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to load metrics' },
      { status: 500 }
    );
  }
}
