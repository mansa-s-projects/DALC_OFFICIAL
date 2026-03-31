import { NextRequest, NextResponse } from 'next/server';
import { fetchViewRows, getLimitFromRequest } from '@/lib/sales-ops-dashboard-api';

export async function GET(request: NextRequest) {
  try {
    const limit = getLimitFromRequest(request, 100, 300);

    const [leaks, dropoffPages, productInsights, valuePrediction, reengagement, sourceQuality, discipline, acceleration, playbooks] =
      await Promise.all([
        fetchViewRows('v_cc_revenue_leak_detection', { limit, orderBy: 'leak_priority', ascending: false }),
        fetchViewRows('v_cc_high_dropoff_pages', { limit, orderBy: 'dropoff_pct', ascending: false }),
        fetchViewRows('v_cc_product_feedback_insights', { limit, orderBy: 'hot_unconverted_gap', ascending: false }),
        fetchViewRows('v_cc_lead_value_prediction', { limit, orderBy: 'value_score', ascending: false }),
        fetchViewRows('v_cc_reengagement_candidates', { limit, orderBy: 'reengagement_priority', ascending: false }),
        fetchViewRows('v_cc_source_quality_score', { limit, orderBy: 'source_quality_score', ascending: false }),
        fetchViewRows('v_cc_execution_discipline_metrics', { limit, orderBy: 'discipline_risk_score', ascending: false }),
        fetchViewRows('v_cc_conversion_acceleration', { limit, orderBy: 'urgency_score', ascending: false }),
        fetchViewRows('v_cc_playbook_execution_mapping', { limit, orderBy: 'step_order', ascending: true }),
      ]);

    return NextResponse.json({
      ok: true,
      data: {
        revenue_leaks: leaks,
        high_dropoff_pages: dropoffPages,
        product_feedback_insights: productInsights,
        lead_value_prediction: valuePrediction,
        reengagement_candidates: reengagement,
        source_quality: sourceQuality,
        execution_discipline: discipline,
        conversion_acceleration: acceleration,
        playbook_execution_mapping: playbooks,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to load command center insights',
      },
      { status: 500 }
    );
  }
}
