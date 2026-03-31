import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { assignLeadOwner, createFollowUpTask } from '@/lib/lead-commands';
import { enqueueWhatsAppJob } from '@/lib/whatsapp-automation';

type SupabaseAdmin = any;

async function snapshotPredictionAudit(supabaseAdmin: SupabaseAdmin, limit = 200) {
  const { data: rows, error } = await supabaseAdmin
    .from('v_cc_predicted_vs_actual')
    .select('*')
    .in('actual_outcome', ['won', 'lost'])
    .order('lead_id', { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);

  let inserted = 0;
  for (const row of rows || []) {
    const { data: exists } = await supabaseAdmin
      .from('model_feedback_audit')
      .select('id')
      .eq('lead_id', row.lead_id)
      .limit(1)
      .maybeSingle();

    if (exists) continue;

    const { error: insertError } = await supabaseAdmin.from('model_feedback_audit').insert({
      lead_id: row.lead_id,
      predicted_conversion_score: Number(row.predicted_conversion_score || 0),
      predicted_value: Number(row.predicted_value || 0),
      actual_outcome: row.actual_outcome,
      actual_value: Number(row.actual_value || 0),
      error_magnitude: Number(row.prediction_error || 0),
      route_expected_owner: row.owner_id || null,
      route_actual_owner: row.owner_id || null,
    });

    if (!insertError) inserted += 1;
  }

  return inserted;
}

async function applyScoringWeightAdjustments(supabaseAdmin: SupabaseAdmin) {
  const { data: recommendations, error } = await supabaseAdmin
    .from('v_cc_scoring_weight_adjustments')
    .select('*')
    .in('adjustment_rule', ['increase_weight', 'decrease_weight']);

  if (error) throw new Error(error.message);

  const { data: latestVersionRow } = await supabaseAdmin
    .from('scoring_weights')
    .select('version')
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = Number(latestVersionRow?.version || 1) + 1;

  const { data: currentRows, error: currentError } = await supabaseAdmin
    .from('scoring_weights')
    .select('*')
    .eq('active', true)
    .eq('version', Number(latestVersionRow?.version || 1));

  if (currentError) throw new Error(currentError.message);

  const recommendationByEvent = new Map<string, any>();
  for (const rec of recommendations || []) {
    recommendationByEvent.set(String(rec.event_name), rec);
  }

  let changed = 0;
  for (const row of currentRows || []) {
    const rec = recommendationByEvent.get(String(row.event_name));
    const boundedWeight = rec
      ? Math.max(0, Math.min(100, Number(row.weight) + Math.max(-5, Math.min(5, Number(rec.suggested_weight) - Number(row.weight)))))
      : Number(row.weight);

    const { error: insertError } = await supabaseAdmin.from('scoring_weights').insert({
      version: nextVersion,
      event_name: row.event_name,
      weight: boundedWeight,
      active: true,
      reason: rec ? `autopilot:${rec.adjustment_rule}` : 'autopilot:carry_forward',
    });

    if (!insertError && rec) {
      changed += 1;
      await supabaseAdmin.from('autopilot_adjustment_log').insert({
        adjustment_type: 'scoring_weight',
        target_key: row.event_name,
        previous_value: { weight: Number(row.weight), version: row.version },
        next_value: { weight: boundedWeight, version: nextVersion },
        reason: rec.adjustment_rule,
        confidence: Math.min(95, Math.max(50, Number(rec.win_lift_pct || 50))),
        applied_by: 'autopilot',
      });
    }
  }

  await supabaseAdmin
    .from('scoring_weights')
    .update({ active: false })
    .lt('version', nextVersion)
    .eq('active', true);

  return { nextVersion, changed };
}

async function applyRoutingAdjustments(supabaseAdmin: SupabaseAdmin) {
  const { data: rows, error } = await supabaseAdmin
    .from('v_cc_routing_adjustments')
    .select('*')
    .in('routing_adjustment_rule', ['deprioritize_team', 'increase_share']);

  if (error) throw new Error(error.message);

  let changed = 0;
  for (const row of rows || []) {
    const key = `routing_bias:${row.owner_team_id}`;
    const bias = row.routing_adjustment_rule === 'increase_share' ? 1.15 : 0.85;

    const { error: upsertError } = await supabaseAdmin.from('founder_overrides').upsert(
      {
        override_key: key,
        override_value: {
          owner_team_id: row.owner_team_id,
          bias_multiplier: bias,
          win_rate_pct: Number(row.win_rate_pct || 0),
          auto_generated: true,
        },
        enabled: true,
        reason: `autopilot:${row.routing_adjustment_rule}`,
        updated_by: 'autopilot',
      },
      { onConflict: 'override_key' }
    );

    if (!upsertError) {
      changed += 1;
      await supabaseAdmin.from('autopilot_adjustment_log').insert({
        adjustment_type: 'routing_rule',
        target_key: key,
        previous_value: null,
        next_value: { bias_multiplier: bias },
        reason: row.routing_adjustment_rule,
        confidence: 70,
        applied_by: 'autopilot',
      });
    }
  }

  return changed;
}

async function runInstantResponse(supabaseAdmin: SupabaseAdmin, limit = 30) {
  const { data: rows, error } = await supabaseAdmin
    .from('v_cc_instant_response_targets')
    .select('*')
    .eq('requires_instant_response', true)
    .limit(limit);

  if (error) throw new Error(error.message);

  let actions = 0;
  for (const row of rows || []) {
    if (row.owner_id) {
      await enqueueWhatsAppJob({
        supabaseAdmin,
        leadId: row.lead_id,
        triggerType: 'hot_lead_created',
        templateKey: 'hot_lead_created',
        recipientPhone: row.phone || undefined,
        payload: { source: 'autopilot.instant_response' },
        dedupeContext: `${row.lead_id}:instant:${Date.now()}`,
      });

      await createFollowUpTask(
        {
          supabaseAdmin,
          actorId: 'autopilot',
          reason: 'autopilot.instant_response',
          idempotencyKey: `instant-task:${row.lead_id}`,
        },
        {
          leadId: row.lead_id,
          ownerId: row.owner_id,
          taskType: 'first_call',
          title: 'Immediate first contact for new hot lead',
          dueAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          priority: 'urgent',
          createdBy: 'autopilot',
          idempotencyKey: `instant-task:${row.lead_id}`,
        }
      );
      actions += 1;
    }
  }

  return actions;
}

async function runCapacityBalancer(supabaseAdmin: SupabaseAdmin, limit = 30) {
  const { data: states, error } = await supabaseAdmin
    .from('v_cc_capacity_balancer')
    .select('*');
  if (error) throw new Error(error.message);

  const underloaded = (states || []).filter((s: any) => s.balancing_state === 'underloaded' && s.owner_id !== 'unassigned');
  if (underloaded.length === 0) return 0;

  const targetOwner = underloaded.sort((a: any, b: any) => Number(a.active_load_pct) - Number(b.active_load_pct))[0].owner_id;

  const { data: candidates, error: candidateError } = await supabaseAdmin
    .from('leads')
    .select('id, owner_id, lead_status')
    .is('owner_id', null)
    .not('lead_status', 'in', '(won,lost)')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (candidateError) throw new Error(candidateError.message);

  let assigned = 0;
  for (const lead of candidates || []) {
    await assignLeadOwner(
      {
        supabaseAdmin,
        actorId: 'autopilot',
        reason: 'autopilot.capacity_balancer',
        idempotencyKey: `balance:${lead.id}:${targetOwner}`,
      },
      { leadId: lead.id, ownerId: targetOwner }
    );
    assigned += 1;
  }

  return assigned;
}

export async function runSelfOptimizationCycle() {
  const supabaseAdmin = getSupabaseAdminClient();

  const audited = await snapshotPredictionAudit(supabaseAdmin);
  const scoring = await applyScoringWeightAdjustments(supabaseAdmin);
  const routing = await applyRoutingAdjustments(supabaseAdmin);
  const instantResponseActions = await runInstantResponse(supabaseAdmin);
  const balancedAssignments = await runCapacityBalancer(supabaseAdmin);

  return {
    audited_predictions: audited,
    scoring_version: scoring.nextVersion,
    scoring_changes: scoring.changed,
    routing_changes: routing,
    instant_response_actions: instantResponseActions,
    balanced_assignments: balancedAssignments,
  };
}
