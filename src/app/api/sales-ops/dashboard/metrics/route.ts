import { NextResponse } from 'next/server';
import { fetchViewRows } from '@/lib/sales-ops-dashboard-api';

export async function GET() {
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
