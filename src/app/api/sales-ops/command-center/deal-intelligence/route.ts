import { NextRequest, NextResponse } from 'next/server';
import { fetchViewRows, getLimitFromRequest } from '@/lib/sales-ops-dashboard-api';
import { requireAdminAuth } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'view_reports');
  if (auth instanceof NextResponse) return auth;

  try {
    const limit = getLimitFromRequest(request, 200, 500);

    const [dealHealth, salesPressure, instantResponseTargets, revenuePriorityQueue, capacityBalancer, interception, killswitch, competitive] =
      await Promise.all([
        fetchViewRows('v_cc_deal_health', { limit, orderBy: 'close_likelihood', ascending: false }),
        fetchViewRows('v_cc_sales_pressure', { limit, orderBy: 'pressure_priority', ascending: false }),
        fetchViewRows('v_cc_instant_response_targets', { limit, orderBy: 'created_at', ascending: false }),
        fetchViewRows('v_cc_revenue_priority_queue', { limit, orderBy: 'queue_rank', ascending: true }),
        fetchViewRows('v_cc_capacity_balancer', { limit, orderBy: 'active_load_pct', ascending: false }),
        fetchViewRows('v_cc_high_intent_interception', { limit, orderBy: 'last_event_at', ascending: false }),
        fetchViewRows('v_cc_killswitch_detection', { limit: 1 }),
        fetchViewRows('v_cc_competitive_intelligence', { limit, orderBy: 'lead_shift_z', ascending: false }),
      ]);

    return NextResponse.json({
      ok: true,
      data: {
        deal_health: dealHealth,
        sales_pressure: salesPressure,
        instant_response_targets: instantResponseTargets,
        revenue_priority_queue: revenuePriorityQueue,
        capacity_balancer: capacityBalancer,
        high_intent_interception: interception,
        killswitch_detection: killswitch[0] || null,
        competitive_intelligence: competitive,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to load deal intelligence',
      },
      { status: 500 }
    );
  }
}
