import { NextRequest, NextResponse } from 'next/server';
import { fetchViewRows, getLimitFromRequest } from '@/lib/sales-ops-dashboard-api';

export async function GET(request: NextRequest) {
  try {
    const limit = getLimitFromRequest(request, 50, 250);

    const [hotImmediate, noContact, overdueFollowUps, recentHighActivity, likelyToConvert, signals] =
      await Promise.all([
        fetchViewRows('v_cc_hot_leads_immediate_action', {
          limit,
          orderBy: 'score',
          ascending: false,
        }),
        fetchViewRows('v_cc_leads_no_contact_yet', {
          limit,
          orderBy: 'created_at',
          ascending: false,
        }),
        fetchViewRows('v_cc_overdue_followups', {
          limit,
          orderBy: 'minutes_overdue',
          ascending: false,
        }),
        fetchViewRows('v_cc_recent_high_activity', {
          limit,
          orderBy: 'events_last_15m',
          ascending: false,
        }),
        fetchViewRows('v_cc_likely_to_convert', {
          limit,
          orderBy: 'conversion_likelihood_score',
          ascending: false,
        }),
        fetchViewRows('v_cc_decision_signals', {
          limit,
          orderBy: 'last_activity',
          ascending: false,
        }),
      ]);

    return NextResponse.json({
      ok: true,
      data: {
        hot_leads_immediate_action: hotImmediate,
        leads_no_contact_yet: noContact,
        overdue_follow_ups: overdueFollowUps,
        recent_high_activity: recentHighActivity,
        likely_to_convert: likelyToConvert,
        decision_signals: signals,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to load command center priorities',
      },
      { status: 500 }
    );
  }
}
