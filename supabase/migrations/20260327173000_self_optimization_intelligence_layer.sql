-- Self-optimization + intelligence layer (explainable, rule-based)

-- 31) Continuous feedback loop controls
CREATE TABLE IF NOT EXISTS public.scoring_weights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL,
  event_name text NOT NULL,
  weight numeric(10,4) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  reason text,
  UNIQUE (version, event_name)
);

CREATE TABLE IF NOT EXISTS public.routing_rules_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL,
  rule_key text NOT NULL,
  condition jsonb NOT NULL DEFAULT '{}'::jsonb,
  target_owner text,
  target_team text,
  priority integer NOT NULL DEFAULT 100,
  active boolean NOT NULL DEFAULT true,
  reason text,
  UNIQUE (version, rule_key)
);

CREATE TABLE IF NOT EXISTS public.model_feedback_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  predicted_conversion_score numeric(10,4) NOT NULL,
  predicted_value numeric(12,2),
  actual_outcome text NOT NULL,
  actual_value numeric(12,2),
  error_magnitude numeric(10,4) NOT NULL,
  route_expected_owner text,
  route_actual_owner text
);

CREATE TABLE IF NOT EXISTS public.autopilot_adjustment_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  adjustment_type text NOT NULL,
  target_key text NOT NULL,
  previous_value jsonb,
  next_value jsonb,
  reason text NOT NULL,
  confidence numeric(6,2) NOT NULL DEFAULT 0,
  applied_by text NOT NULL DEFAULT 'autopilot'
);

CREATE TABLE IF NOT EXISTS public.founder_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  override_key text NOT NULL UNIQUE,
  override_value jsonb NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  reason text,
  updated_by text
);

CREATE INDEX IF NOT EXISTS idx_feedback_audit_created ON public.model_feedback_audit(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_adjustment_log_created ON public.autopilot_adjustment_log(created_at DESC);

-- Seed explainable default scoring map (version 1)
INSERT INTO public.scoring_weights (version, event_name, weight, active, reason)
VALUES
  (1, 'move_to_dubai_landing_start_move_click', 8, true, 'baseline'),
  (1, 'move_to_dubai_service_start_move_click', 8, true, 'baseline'),
  (1, 'move_to_dubai_landing_whatsapp_hero_click', 18, true, 'baseline'),
  (1, 'move_to_dubai_landing_whatsapp_contact_click', 16, true, 'baseline'),
  (1, 'move_to_dubai_landing_whatsapp_floating_click', 14, true, 'baseline'),
  (1, 'move_to_dubai_service_whatsapp_hero_click', 18, true, 'baseline'),
  (1, 'move_to_dubai_service_whatsapp_contact_click', 16, true, 'baseline'),
  (1, 'move_to_dubai_service_whatsapp_floating_click', 14, true, 'baseline'),
  (1, 'move_to_dubai_landing_lead_form_submit_success', 45, true, 'baseline'),
  (1, 'move_to_dubai_service_lead_form_submit_success', 45, true, 'baseline')
ON CONFLICT (version, event_name) DO NOTHING;

-- Seed routing defaults (version 1)
INSERT INTO public.routing_rules_config (version, rule_key, condition, target_team, priority, active, reason)
VALUES
  (1, 'team-a-relocation', '{"service_slug":["relocation-support","visa-services"],"source_page_prefix":"/move-to-dubai"}'::jsonb, 'team_a', 10, true, 'baseline'),
  (1, 'team-b-business', '{"service_slug":["company-formation"]}'::jsonb, 'team_b', 20, true, 'baseline'),
  (1, 'team-c-transport', '{"source_page_contains":["/transport","/travel/transport"]}'::jsonb, 'team_c', 30, true, 'baseline')
ON CONFLICT (version, rule_key) DO NOTHING;

-- 31.1 predicted vs actual
CREATE OR REPLACE VIEW public.v_cc_predicted_vs_actual AS
SELECT
  l.id AS lead_id,
  l.owner_id,
  l.source_page,
  l.service_slug,
  p.value_score AS predicted_conversion_score,
  p.expected_deal_value AS predicted_value,
  CASE
    WHEN l.lead_status = 'won' THEN 'won'
    WHEN l.lead_status = 'lost' THEN 'lost'
    ELSE 'open'
  END AS actual_outcome,
  COALESCE(l.won_value, 0) AS actual_value,
  ROUND(
    ABS(COALESCE(p.value_score, 0) - CASE WHEN l.lead_status = 'won' THEN 100 WHEN l.lead_status = 'lost' THEN 0 ELSE COALESCE(p.value_score, 0) END)::numeric,
    2
  ) AS prediction_error
FROM public.leads l
LEFT JOIN public.v_cc_lead_value_prediction p ON p.lead_id = l.id;

-- 31.2 scoring adjustment recommendation
CREATE OR REPLACE VIEW public.v_cc_scoring_weight_adjustments AS
WITH event_to_outcome AS (
  SELECT
    e.event_name,
    COUNT(*) FILTER (WHERE l.lead_status = 'won') AS won_count,
    COUNT(*) FILTER (WHERE l.lead_status = 'lost') AS lost_count,
    COUNT(*) AS total_count,
    CASE
      WHEN COUNT(*) = 0 THEN 0
      ELSE (COUNT(*) FILTER (WHERE l.lead_status = 'won')::numeric / COUNT(*)::numeric)
    END AS win_lift
  FROM public.events e
  JOIN public.leads l ON l.session_id = e.session_id
  WHERE l.lead_status IN ('won', 'lost')
  GROUP BY e.event_name
), active_weights AS (
  SELECT event_name, weight
  FROM public.scoring_weights
  WHERE active = true
    AND version = (SELECT COALESCE(MAX(version), 1) FROM public.scoring_weights)
)
SELECT
  eto.event_name,
  COALESCE(aw.weight, 0) AS current_weight,
  ROUND(
    GREATEST(0, LEAST(100, COALESCE(aw.weight, 0) + ((eto.win_lift - 0.5) * 10)))::numeric,
    2
  ) AS suggested_weight,
  ROUND((eto.win_lift * 100)::numeric, 2) AS win_lift_pct,
  eto.total_count,
  CASE
    WHEN eto.total_count < 30 THEN 'insufficient_data'
    WHEN eto.win_lift >= 0.62 THEN 'increase_weight'
    WHEN eto.win_lift <= 0.38 THEN 'decrease_weight'
    ELSE 'keep'
  END AS adjustment_rule
FROM event_to_outcome eto
LEFT JOIN active_weights aw ON aw.event_name = eto.event_name;

-- 31.3 routing adjustment recommendation
CREATE OR REPLACE VIEW public.v_cc_routing_adjustments AS
SELECT
  COALESCE(l.owner_team_id, 'unassigned') AS owner_team_id,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE l.lead_status = 'won') AS won,
  ROUND(
    CASE WHEN COUNT(*) = 0 THEN 0
      ELSE (COUNT(*) FILTER (WHERE l.lead_status = 'won')::numeric / COUNT(*)::numeric) * 100
    END,
    2
  ) AS win_rate_pct,
  ROUND(AVG(EXTRACT(EPOCH FROM (l.last_contacted_at - l.created_at)) / 60.0) FILTER (WHERE l.last_contacted_at IS NOT NULL), 2) AS avg_first_contact_minutes,
  CASE
    WHEN COUNT(*) < 20 THEN 'insufficient_data'
    WHEN (COUNT(*) FILTER (WHERE l.lead_status = 'won')::numeric / NULLIF(COUNT(*),0)) < 0.12 THEN 'deprioritize_team'
    WHEN (COUNT(*) FILTER (WHERE l.lead_status = 'won')::numeric / NULLIF(COUNT(*),0)) > 0.30 THEN 'increase_share'
    ELSE 'keep'
  END AS routing_adjustment_rule
FROM public.leads l
GROUP BY COALESCE(l.owner_team_id, 'unassigned');

-- 32) Deal intelligence engine
CREATE OR REPLACE VIEW public.v_cc_deal_health AS
SELECT
  l.id AS lead_id,
  l.owner_id,
  l.lead_status,
  l.lead_score,
  l.lead_temperature,
  l.created_at,
  l.last_contacted_at,
  l.status_updated_at,
  EXTRACT(EPOCH FROM (COALESCE(l.last_contacted_at, now()) - l.created_at)) / 3600.0 AS hours_to_first_touch,
  EXTRACT(EPOCH FROM (now() - COALESCE(l.last_contacted_at, l.created_at))) / 3600.0 AS hours_since_last_touch,
  CASE
    WHEN l.lead_status IN ('won', 'lost') THEN false
    WHEN now() - COALESCE(l.last_contacted_at, l.created_at) > interval '48 hours' THEN true
    WHEN l.lead_status IN ('qualified', 'proposal_sent', 'negotiation') AND now() - l.status_updated_at > interval '72 hours' THEN true
    ELSE false
  END AS is_stalled,
  ROUND(
    LEAST(100, GREATEST(0,
      (COALESCE(l.lead_score, 0) * 0.55) +
      (CASE l.lead_status WHEN 'negotiation' THEN 22 WHEN 'proposal_sent' THEN 16 WHEN 'qualified' THEN 12 WHEN 'contacted' THEN 8 ELSE 3 END) -
      (CASE WHEN now() - COALESCE(l.last_contacted_at, l.created_at) > interval '48 hours' THEN 18 ELSE 0 END)
    ))::numeric,
    2
  ) AS close_likelihood,
  ROUND(
    LEAST(100, GREATEST(0,
      100 - ((COALESCE(l.lead_score, 0) * 0.45) +
      (CASE WHEN now() - COALESCE(l.last_contacted_at, l.created_at) > interval '48 hours' THEN 20 ELSE 0 END) +
      (CASE l.lead_status WHEN 'unresponsive' THEN 28 WHEN 'lost' THEN 100 ELSE 10 END))
    ))::numeric,
    2
  ) AS fail_likelihood
FROM public.leads l;

-- 33) Sales pressure system
CREATE OR REPLACE VIEW public.v_cc_sales_pressure AS
SELECT
  l.id AS lead_id,
  l.owner_id,
  l.owner_team_id,
  l.lead_score,
  l.won_value,
  l.lead_temperature,
  l.created_at,
  l.last_contacted_at,
  EXTRACT(EPOCH FROM (now() - COALESCE(l.last_contacted_at, l.created_at))) / 60.0 AS idle_minutes,
  CASE
    WHEN l.lead_temperature = 'hot' AND now() - COALESCE(l.last_contacted_at, l.created_at) > interval '15 minutes' THEN 'page_owner'
    WHEN COALESCE(l.won_value, 0) >= 10000 AND now() - COALESCE(l.last_contacted_at, l.created_at) > interval '30 minutes' THEN 'escalate_team'
    WHEN l.lead_score >= 80 AND now() - COALESCE(l.last_contacted_at, l.created_at) > interval '45 minutes' THEN 'escalate_manager'
    ELSE 'none'
  END AS escalation_rule,
  CASE
    WHEN l.lead_temperature = 'hot' THEN 95
    WHEN COALESCE(l.won_value, 0) >= 10000 THEN 90
    WHEN l.lead_score >= 80 THEN 82
    ELSE 50
  END AS pressure_priority
FROM public.leads l
WHERE l.lead_status NOT IN ('won', 'lost');

-- 34) Instant response engine
CREATE OR REPLACE VIEW public.v_cc_instant_response_targets AS
SELECT
  l.id AS lead_id,
  l.owner_id,
  l.owner_team_id,
  l.phone,
  l.source_page,
  l.service_slug,
  l.lead_score,
  l.lead_temperature,
  l.created_at,
  l.last_contacted_at,
  CASE
    WHEN l.lead_temperature = 'hot' AND l.last_contacted_at IS NULL AND now() - l.created_at <= interval '10 minutes' THEN true
    ELSE false
  END AS requires_instant_response,
  CASE
    WHEN l.owner_id IS NULL THEN 'assign_owner_and_send_whatsapp'
    ELSE 'send_whatsapp_and_create_task'
  END AS response_logic
FROM public.leads l
WHERE l.lead_status IN ('new', 'assigned', 'contacted');

-- 35) Revenue priority queue
CREATE OR REPLACE VIEW public.v_cc_revenue_priority_queue AS
SELECT
  l.id AS lead_id,
  l.owner_id,
  l.owner_team_id,
  l.lead_status,
  l.lead_score,
  l.lead_temperature,
  COALESCE(v.expected_deal_value, 0) AS expected_deal_value,
  EXTRACT(EPOCH FROM (now() - COALESCE(l.last_contacted_at, l.created_at))) / 60.0 AS idle_minutes,
  ROUND(
    (
      (COALESCE(l.lead_score, 0) * 0.45) +
      (LEAST(40, EXTRACT(EPOCH FROM (now() - COALESCE(l.last_contacted_at, l.created_at))) / 60.0 / 3) * 0.25) +
      (LEAST(100, COALESCE(v.expected_deal_value, 0) / 200) * 0.30)
    )::numeric,
    2
  ) AS priority_score,
  ROW_NUMBER() OVER (
    ORDER BY
      (
        (COALESCE(l.lead_score, 0) * 0.45) +
        (LEAST(40, EXTRACT(EPOCH FROM (now() - COALESCE(l.last_contacted_at, l.created_at))) / 60.0 / 3) * 0.25) +
        (LEAST(100, COALESCE(v.expected_deal_value, 0) / 200) * 0.30)
      ) DESC,
      l.created_at ASC
  ) AS queue_rank
FROM public.leads l
LEFT JOIN public.v_cc_lead_value_prediction v ON v.lead_id = l.id
WHERE l.lead_status NOT IN ('won', 'lost');

-- 36) Sales capacity balancer
CREATE TABLE IF NOT EXISTS public.agent_capacity_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  owner_id text NOT NULL UNIQUE,
  max_active_leads integer NOT NULL DEFAULT 35,
  max_open_tasks integer NOT NULL DEFAULT 25,
  enabled boolean NOT NULL DEFAULT true
);

CREATE OR REPLACE VIEW public.v_cc_capacity_balancer AS
WITH workload AS (
  SELECT
    COALESCE(l.owner_id, 'unassigned') AS owner_id,
    COUNT(*) FILTER (WHERE l.lead_status NOT IN ('won', 'lost')) AS active_leads,
    COUNT(t.id) FILTER (WHERE t.status <> 'completed') AS open_tasks
  FROM public.leads l
  LEFT JOIN public.lead_tasks t ON t.lead_id = l.id
  GROUP BY COALESCE(l.owner_id, 'unassigned')
)
SELECT
  w.owner_id,
  w.active_leads,
  w.open_tasks,
  COALESCE(c.max_active_leads, 35) AS max_active_leads,
  COALESCE(c.max_open_tasks, 25) AS max_open_tasks,
  ROUND((w.active_leads::numeric / NULLIF(COALESCE(c.max_active_leads, 35), 0)) * 100, 2) AS active_load_pct,
  ROUND((w.open_tasks::numeric / NULLIF(COALESCE(c.max_open_tasks, 25), 0)) * 100, 2) AS task_load_pct,
  CASE
    WHEN w.owner_id = 'unassigned' THEN 'assign_out'
    WHEN w.active_leads > COALESCE(c.max_active_leads, 35)
      OR w.open_tasks > COALESCE(c.max_open_tasks, 25) THEN 'overloaded'
    WHEN w.active_leads < (COALESCE(c.max_active_leads, 35) * 0.6)
      AND w.open_tasks < (COALESCE(c.max_open_tasks, 25) * 0.6) THEN 'underloaded'
    ELSE 'balanced'
  END AS balancing_state
FROM workload w
LEFT JOIN public.agent_capacity_config c ON c.owner_id = w.owner_id AND c.enabled = true;

-- 37) High-intent interception engine
CREATE OR REPLACE VIEW public.v_cc_high_intent_interception AS
WITH session_intent AS (
  SELECT
    e.session_id,
    COUNT(*) FILTER (WHERE e.event_name ILIKE '%whatsapp%' OR e.event_name ILIKE '%start_move%' OR e.event_name ILIKE '%lead_form%') AS intent_events,
    MAX(e.created_at) AS last_event_at,
    MAX(COALESCE(e.page, '')) AS last_page
  FROM public.events e
  GROUP BY e.session_id
)
SELECT
  si.session_id,
  si.intent_events,
  si.last_event_at,
  si.last_page,
  CASE
    WHEN si.intent_events >= 4 THEN 'high'
    WHEN si.intent_events >= 2 THEN 'medium'
    ELSE 'low'
  END AS intent_band,
  CASE
    WHEN si.intent_events >= 4 THEN 'trigger_whatsapp_prompt'
    WHEN si.intent_events >= 2 THEN 'trigger_assisted_contact_prompt'
    ELSE 'none'
  END AS interception_logic
FROM session_intent si
LEFT JOIN public.leads l ON l.session_id = si.session_id
WHERE l.id IS NULL
  AND si.last_event_at >= now() - interval '20 minutes';

-- 38) Revenue kill-switch detection
CREATE OR REPLACE VIEW public.v_cc_killswitch_detection AS
WITH recent AS (
  SELECT
    COUNT(*) FILTER (WHERE lead_status = 'won')::numeric AS recent_won,
    COUNT(*)::numeric AS recent_total
  FROM public.leads
  WHERE created_at >= now() - interval '6 hours'
), baseline AS (
  SELECT
    COUNT(*) FILTER (WHERE lead_status = 'won')::numeric AS base_won,
    COUNT(*)::numeric AS base_total
  FROM public.leads
  WHERE created_at >= now() - interval '7 days'
    AND created_at < now() - interval '6 hours'
), flow AS (
  SELECT
    COUNT(*) FILTER (WHERE event_name ILIKE '%start_move%' OR event_name ILIKE '%whatsapp%')::numeric AS high_intent_events,
    COUNT(*) FILTER (WHERE event_name ILIKE '%lead_form_submit_success%')::numeric AS submit_events
  FROM public.events
  WHERE created_at >= now() - interval '6 hours'
)
SELECT
  ROUND(CASE WHEN recent.recent_total = 0 THEN 0 ELSE (recent.recent_won / recent.recent_total) * 100 END, 2) AS recent_conversion_pct,
  ROUND(CASE WHEN baseline.base_total = 0 THEN 0 ELSE (baseline.base_won / baseline.base_total) * 100 END, 2) AS baseline_conversion_pct,
  ROUND(CASE WHEN flow.high_intent_events = 0 THEN 0 ELSE (flow.submit_events / flow.high_intent_events) * 100 END, 2) AS high_intent_to_submit_pct,
  CASE
    WHEN (CASE WHEN baseline.base_total = 0 THEN 0 ELSE (baseline.base_won / baseline.base_total) END) = 0 THEN false
    WHEN (CASE WHEN recent.recent_total = 0 THEN 0 ELSE (recent.recent_won / recent.recent_total) END) <
         ((baseline.base_won / NULLIF(baseline.base_total,0)) * 0.5)
      THEN true
    WHEN (CASE WHEN flow.high_intent_events = 0 THEN 0 ELSE (flow.submit_events / flow.high_intent_events) END) < 0.08
      THEN true
    ELSE false
  END AS killswitch_triggered,
  CASE
    WHEN (CASE WHEN flow.high_intent_events = 0 THEN 0 ELSE (flow.submit_events / flow.high_intent_events) END) < 0.08
      THEN 'broken_intent_to_submit_flow'
    WHEN (CASE WHEN recent.recent_total = 0 THEN 0 ELSE (recent.recent_won / recent.recent_total) END) <
         ((baseline.base_won / NULLIF(baseline.base_total,0)) * 0.5)
      THEN 'conversion_collapse'
    ELSE 'healthy'
  END AS killswitch_reason;

-- 39) Competitive intelligence layer (simple external-shift proxy)
CREATE OR REPLACE VIEW public.v_cc_competitive_intelligence AS
WITH daily AS (
  SELECT
    date_trunc('day', created_at)::date AS day,
    source_page,
    COUNT(*) AS leads,
    COUNT(*) FILTER (WHERE lead_status = 'won') AS won,
    COALESCE(SUM(won_value) FILTER (WHERE lead_status = 'won'), 0) AS revenue
  FROM public.leads
  WHERE created_at >= now() - interval '21 days'
  GROUP BY date_trunc('day', created_at)::date, source_page
), stats AS (
  SELECT
    source_page,
    AVG(leads) AS avg_daily_leads,
    STDDEV_POP(leads) AS std_daily_leads,
    AVG(CASE WHEN leads = 0 THEN 0 ELSE won::numeric / leads::numeric END) AS avg_win_rate
  FROM daily
  GROUP BY source_page
), latest AS (
  SELECT DISTINCT ON (source_page)
    source_page,
    day,
    leads,
    won,
    revenue,
    CASE WHEN leads = 0 THEN 0 ELSE won::numeric / leads::numeric END AS win_rate
  FROM daily
  ORDER BY source_page, day DESC
)
SELECT
  l.source_page,
  l.day,
  l.leads,
  l.win_rate,
  s.avg_daily_leads,
  COALESCE(s.std_daily_leads, 0) AS std_daily_leads,
  s.avg_win_rate,
  ROUND(CASE WHEN COALESCE(s.std_daily_leads,0) = 0 THEN 0 ELSE (l.leads - s.avg_daily_leads) / s.std_daily_leads END, 2) AS lead_shift_z,
  ROUND((l.win_rate - s.avg_win_rate)::numeric, 4) AS win_rate_shift,
  CASE
    WHEN ABS(CASE WHEN COALESCE(s.std_daily_leads,0) = 0 THEN 0 ELSE (l.leads - s.avg_daily_leads) / s.std_daily_leads END) >= 2.0
      OR ABS(l.win_rate - s.avg_win_rate) >= 0.15
      THEN 'sudden_shift_detected'
    ELSE 'stable'
  END AS shift_detection
FROM latest l
JOIN stats s ON s.source_page = l.source_page;

-- 40) Founder control layer
CREATE OR REPLACE VIEW public.v_cc_founder_control_metrics AS
SELECT
  (SELECT COUNT(*) FROM public.leads WHERE created_at >= now() - interval '24 hours') AS leads_24h,
  (SELECT COUNT(*) FROM public.leads WHERE lead_status = 'won' AND closed_at >= now() - interval '24 hours') AS won_24h,
  (SELECT COALESCE(SUM(won_value), 0) FROM public.leads WHERE lead_status = 'won' AND closed_at >= now() - interval '24 hours') AS revenue_24h,
  (SELECT COUNT(*) FROM public.v_cc_revenue_priority_queue WHERE queue_rank <= 20) AS top20_queue_size,
  (SELECT COUNT(*) FROM public.v_cc_sales_pressure WHERE escalation_rule <> 'none') AS active_pressure_cases,
  (SELECT COUNT(*) FROM public.v_cc_revenue_leak_detection WHERE leak_priority >= 70) AS critical_leaks,
  (SELECT killswitch_triggered FROM public.v_cc_killswitch_detection LIMIT 1) AS killswitch_triggered;

CREATE OR REPLACE VIEW public.v_cc_active_overrides AS
SELECT
  override_key,
  override_value,
  enabled,
  expires_at,
  reason,
  updated_by,
  created_at
FROM public.founder_overrides
WHERE enabled = true
  AND (expires_at IS NULL OR expires_at > now());

ALTER TABLE public.scoring_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routing_rules_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_feedback_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopilot_adjustment_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founder_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_capacity_config ENABLE ROW LEVEL SECURITY;
