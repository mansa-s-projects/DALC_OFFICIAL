import { NextRequest, NextResponse } from 'next/server';
import { fetchViewRows, getLimitFromRequest } from '@/lib/sales-ops-dashboard-api';

export async function GET(request: NextRequest) {
  try {
    const limit = getLimitFromRequest(request, 40, 200);

    const [hotLeads, overdueTasks, leadsWithoutOwner, leadsWithoutFollowUp, recentlyActive, topConvertingSources] =
      await Promise.all([
        fetchViewRows('v_dashboard_hot_leads', {
          limit,
          orderBy: 'lead_score',
          ascending: false,
        }),
        fetchViewRows('v_dashboard_overdue_tasks', {
          limit,
          orderBy: 'urgency_score',
          ascending: false,
        }),
        fetchViewRows('v_dashboard_leads_without_owner', {
          limit,
          orderBy: 'created_at',
          ascending: false,
        }),
        fetchViewRows('v_dashboard_leads_without_follow_up', {
          limit,
          orderBy: 'created_at',
          ascending: false,
        }),
        fetchViewRows('v_dashboard_recently_active_leads', {
          limit,
          orderBy: 'last_activity_at',
          ascending: false,
        }),
        fetchViewRows('v_dashboard_top_converting_sources', {
          limit,
          orderBy: 'conversion_rate_pct',
          ascending: false,
        }),
      ]);

    return NextResponse.json({
      ok: true,
      data: {
        hot_leads: hotLeads,
        overdue_tasks: overdueTasks,
        leads_without_owner: leadsWithoutOwner,
        leads_without_follow_up: leadsWithoutFollowUp,
        recently_active_leads: recentlyActive,
        top_converting_sources: topConvertingSources,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to load prioritization dataset',
      },
      { status: 500 }
    );
  }
}
