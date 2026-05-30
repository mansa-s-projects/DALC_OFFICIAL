-- Command Center read/action orchestration layer
-- Read-only intelligence views + lightweight operator playbook schema.

-- 1) Source quality baseline
CREATE OR REPLACE VIEW public.v_cc_source_quality_score AS
SELECT
  l.source_page,
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE l.lead_status = 'won') AS won_leads,
  COALESCE(SUM(l.won_value) FILTER (WHERE l.lead_status = 'won'), 0) AS total_revenue,
  COALESCE(AVG(l.lead_score), 0) AS avg_score,
  CASE
    WHEN COUNT(*) = 0 THEN 0
    ELSE ROUND((COUNT(*) FILTER (WHERE l.lead_status = 'won')::numeric / COUNT(*)::numeric) * 100, 2)
  END AS win_rate_pct,
  ROUND(
    (
      COALESCE(AVG(l.lead_score), 0) * 0.35 +
      (CASE WHEN COUNT(*) = 0 THEN 0 ELSE (COUNT(*) FILTER (WHERE l.lead_status = 'won')::numeric / COUNT(*)::numeric) * 100 END) * 0.45 +
      LEAST(100, COALESCE(SUM(l.won_value) FILTER (WHERE l.lead_status = 'won'), 0) / NULLIF(COUNT(*), 0) / 1000) * 0.20
    )::numeric,
    2
  ) AS source_quality_score
FROM public.leads l
GROUP BY l.source_page;
-- 2) Decision signals for operators
CREATE OR REPLACE VIEW public.v_cc_decision_signals AS
WITH activity AS (
  SELECT
    e.session_id,
    COUNT(*) FILTER (WHERE e.created_at >= now() - interval '30 minutes') AS events_30m,
    COUNT(*) FILTER (WHERE e.created_at >= now() - interval '15 minutes') AS events_15m,
    MAX(e.created_at) AS last_event_at
  FROM public.events e
  GROUP BY e.session_id
)
SELECT
  l.id AS lead_id,
  l.created_at,
  l.source_page,
  l.service_slug,
  l.lead_status,
  l.owner_id,
  l.lead_score AS score,
  l.lead_temperature AS intent_level,
  GREATEST(
    COALESCE(l.last_contacted_at, 'epoch'::timestamptz),
    COALESCE(l.last_scored_at, 'epoch'::timestamptz),
    COALESCE(l.last_automation_at, 'epoch'::timestamptz),
    COALESCE(l.status_updated_at, 'epoch'::timestamptz),
    COALESCE(activity.last_event_at, 'epoch'::timestamptz),
    l.created_at
  ) AS last_activity,
  COALESCE(sq.source_quality_score, 0) AS source_quality,
  CASE
    WHEN l.owner_id IS NULL THEN 'assign_owner'
    WHEN l.lead_status IN ('new', 'assigned') AND l.last_contacted_at IS NULL THEN 'mark_contacted'
    WHEN l.lead_status NOT IN ('won', 'lost') AND (l.next_follow_up_at IS NULL OR l.next_follow_up_at < now()) THEN 'create_follow_up'
    WHEN l.lead_temperature = 'hot' THEN 'send_whatsapp'
    ELSE 'schedule_next_step'
  END AS recommended_action,
  COALESCE(activity.events_30m, 0) AS events_last_30m,
  COALESCE(activity.events_15m, 0) AS events_last_15m
FROM public.leads l
LEFT JOIN activity ON activity.session_id = l.session_id
LEFT JOIN public.v_cc_source_quality_score sq ON sq.source_page = l.source_page;
-- 3) Priority queues (Step 1)
CREATE OR REPLACE VIEW public.v_cc_hot_leads_immediate_action AS
SELECT *
FROM public.v_cc_decision_signals
WHERE intent_level = 'hot'
  AND lead_status NOT IN ('won', 'lost')
  AND (
    owner_id IS NULL
    OR recommended_action IN ('mark_contacted', 'create_follow_up', 'send_whatsapp')
  );
CREATE OR REPLACE VIEW public.v_cc_leads_no_contact_yet AS
SELECT *
FROM public.v_cc_decision_signals
WHERE lead_status IN ('new', 'assigned')
  AND recommended_action = 'mark_contacted';
CREATE OR REPLACE VIEW public.v_cc_overdue_followups AS
SELECT
  t.id AS task_id,
  t.lead_id,
  t.owner_id,
  t.task_type,
  t.title,
  t.priority,
  t.due_at,
  EXTRACT(EPOCH FROM (now() - t.due_at)) / 60.0 AS minutes_overdue,
  l.lead_score AS score,
  l.lead_temperature AS intent_level,
  COALESCE(sq.source_quality_score, 0) AS source_quality,
  'create_follow_up'::text AS recommended_action
FROM public.lead_tasks t
JOIN public.leads l ON l.id = t.lead_id
LEFT JOIN public.v_cc_source_quality_score sq ON sq.source_page = l.source_page
WHERE t.status <> 'completed'
  AND t.due_at IS NOT NULL
  AND t.due_at < now();
CREATE OR REPLACE VIEW public.v_cc_recent_high_activity AS
SELECT *
FROM public.v_cc_decision_signals
WHERE events_last_15m >= 3
  AND lead_status NOT IN ('won', 'lost');
CREATE OR REPLACE VIEW public.v_cc_likely_to_convert AS
SELECT
  ds.*,
  ROUND(
    LEAST(
      100,
      (COALESCE(ds.score, 0) * 0.55) +
      (COALESCE(ds.source_quality, 0) * 0.25) +
      (LEAST(20, COALESCE(ds.events_last_30m, 0) * 4)) +
      (CASE ds.lead_status
        WHEN 'qualified' THEN 12
        WHEN 'proposal_sent' THEN 16
        WHEN 'negotiation' THEN 18
        WHEN 'contacted' THEN 8
        ELSE 0
      END)
    )::numeric,
    2
  ) AS conversion_likelihood_score
FROM public.v_cc_decision_signals ds
WHERE ds.lead_status NOT IN ('won', 'lost');
-- 4) Real-time sales alerts (Step 22)
CREATE OR REPLACE VIEW public.v_cc_critical_alerts AS
WITH high_value_sources AS (
  SELECT source_page
  FROM public.v_cc_source_quality_score
  WHERE source_quality_score >= 75
)
SELECT
  'new_hot_lead'::text AS alert_type,
  l.id AS lead_id,
  COALESCE(l.owner_id, 'unassigned') AS routing_owner,
  COALESCE(l.owner_team_id, 'sales_ops') AS routing_team,
  100 AS alert_priority,
  jsonb_build_object('score', l.lead_score, 'source_page', l.source_page) AS payload,
  now() AS occurred_at
FROM public.leads l
WHERE l.lead_temperature = 'hot'
  AND l.created_at >= now() - interval '15 minutes'

UNION ALL

SELECT
  'activity_spike'::text AS alert_type,
  ds.lead_id,
  COALESCE(ds.owner_id, 'unassigned') AS routing_owner,
  COALESCE(l.owner_team_id, 'sales_ops') AS routing_team,
  LEAST(95, 70 + ds.events_last_15m * 5) AS alert_priority,
  jsonb_build_object('events_last_15m', ds.events_last_15m, 'score', ds.score) AS payload,
  now() AS occurred_at
FROM public.v_cc_decision_signals ds
JOIN public.leads l ON l.id = ds.lead_id
WHERE ds.events_last_15m >= 4
  AND ds.lead_status NOT IN ('won', 'lost')

UNION ALL

SELECT
  'sla_breach'::text AS alert_type,
  l.id AS lead_id,
  COALESCE(l.owner_id, 'unassigned') AS routing_owner,
  COALESCE(l.owner_team_id, 'sales_ops') AS routing_team,
  92 AS alert_priority,
  jsonb_build_object(
    'sla_first_contact_breached', l.sla_first_contact_breached,
    'sla_follow_up_breached', l.sla_follow_up_breached
  ) AS payload,
  COALESCE(l.sla_first_contact_breached_at, l.sla_follow_up_breached_at, l.status_updated_at) AS occurred_at
FROM public.leads l
WHERE l.sla_first_contact_breached = true
   OR l.sla_follow_up_breached = true

UNION ALL

SELECT
  'high_value_source_lead'::text AS alert_type,
  l.id AS lead_id,
  COALESCE(l.owner_id, 'unassigned') AS routing_owner,
  COALESCE(l.owner_team_id, 'sales_ops') AS routing_team,
  88 AS alert_priority,
  jsonb_build_object('source_page', l.source_page, 'score', l.lead_score) AS payload,
  l.created_at AS occurred_at
FROM public.leads l
JOIN high_value_sources hvs ON hvs.source_page = l.source_page
WHERE l.created_at >= now() - interval '30 minutes'
  AND l.lead_status IN ('new', 'assigned', 'contacted');
-- 5) Revenue leak detection (Step 23)
CREATE OR REPLACE VIEW public.v_cc_revenue_leak_detection AS
WITH base AS (
  SELECT
    ds.*, 
    l.created_at,
    l.last_contacted_at,
    l.next_follow_up_at,
    l.won_value,
    CASE WHEN ds.intent_level = 'hot' THEN 1.3 WHEN ds.intent_level = 'warm' THEN 1.0 ELSE 0.6 END AS intent_multiplier
  FROM public.v_cc_decision_signals ds
  JOIN public.leads l ON l.id = ds.lead_id
), leaks AS (
  SELECT
    lead_id,
    'high_intent_not_contacted'::text AS leak_type,
    LEAST(100, score * 1.2) AS leak_priority,
    ROUND((COALESCE(score, 0) * intent_multiplier * 35)::numeric, 2) AS estimated_loss
  FROM base
  WHERE intent_level = 'hot' AND last_contacted_at IS NULL

  UNION ALL

  SELECT
    lead_id,
    'stuck_in_stage'::text AS leak_type,
    LEAST(100, score * 1.1) AS leak_priority,
    ROUND((COALESCE(score, 0) * intent_multiplier * 25)::numeric, 2) AS estimated_loss
  FROM base
  WHERE lead_status IN ('qualified', 'proposal_sent', 'negotiation')
    AND last_activity < now() - interval '48 hours'

  UNION ALL

  SELECT
    lead_id,
    'missed_follow_up'::text AS leak_type,
    LEAST(100, score * 1.15) AS leak_priority,
    ROUND((COALESCE(score, 0) * intent_multiplier * 30)::numeric, 2) AS estimated_loss
  FROM base
  WHERE next_follow_up_at IS NOT NULL AND next_follow_up_at < now()
)
SELECT * FROM leaks;
CREATE OR REPLACE VIEW public.v_cc_high_dropoff_pages AS
SELECT
  l.source_page,
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE l.lead_status = 'won') AS won_count,
  ROUND(
    CASE WHEN COUNT(*) = 0 THEN 0
      ELSE (1 - (COUNT(*) FILTER (WHERE l.lead_status = 'won')::numeric / COUNT(*)::numeric)) * 100
    END,
    2
  ) AS dropoff_pct
FROM public.leads l
GROUP BY l.source_page
HAVING COUNT(*) >= 5;
-- 6) Sales playbook engine (Step 24)
CREATE TABLE IF NOT EXISTS public.lead_playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  playbook_key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  trigger_rule jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS public.lead_playbook_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  playbook_key text NOT NULL,
  step_order integer NOT NULL,
  step_name text NOT NULL,
  action_type text NOT NULL,
  schedule_offset_minutes integer NOT NULL DEFAULT 0,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(playbook_key, step_order)
);
INSERT INTO public.lead_playbooks (playbook_key, display_name, trigger_rule, enabled)
VALUES
  ('relocation_lead', 'Relocation Lead Playbook', '{"service_slug": ["relocation-support", "visa-services"]}'::jsonb, true),
  ('business_setup_lead', 'Business Setup Playbook', '{"service_slug": ["company-formation", "banking"]}'::jsonb, true),
  ('luxury_transport_lead', 'Luxury Transport Playbook', '{"source_page_contains": ["/transport", "/travel/transport"]}'::jsonb, true)
ON CONFLICT (playbook_key) DO UPDATE
SET display_name = EXCLUDED.display_name,
    trigger_rule = EXCLUDED.trigger_rule,
    enabled = EXCLUDED.enabled;
INSERT INTO public.lead_playbook_steps (playbook_key, step_order, step_name, action_type, schedule_offset_minutes, config)
VALUES
  ('relocation_lead', 1, 'First Contact', 'mark_contacted', 0, '{"channel":"call_or_whatsapp"}'::jsonb),
  ('relocation_lead', 2, 'Follow Up', 'create_follow_up', 120, '{"task_type":"whatsapp_follow_up"}'::jsonb),
  ('relocation_lead', 3, 'Conversion Push', 'schedule_next_step', 1440, '{"next_status":"qualified"}'::jsonb),

  ('business_setup_lead', 1, 'First Contact', 'mark_contacted', 0, '{"channel":"call"}'::jsonb),
  ('business_setup_lead', 2, 'Needs Discovery Follow Up', 'create_follow_up', 180, '{"task_type":"email_follow_up"}'::jsonb),
  ('business_setup_lead', 3, 'Proposal Step', 'schedule_next_step', 1440, '{"next_status":"proposal_sent"}'::jsonb),

  ('luxury_transport_lead', 1, 'Instant WhatsApp', 'send_whatsapp', 0, '{"template_key":"hot_lead_created"}'::jsonb),
  ('luxury_transport_lead', 2, 'Assign Priority Owner', 'assign_owner', 5, '{"priority":"urgent"}'::jsonb),
  ('luxury_transport_lead', 3, 'Close Follow Up', 'create_follow_up', 60, '{"task_type":"first_call"}'::jsonb)
ON CONFLICT (playbook_key, step_order) DO UPDATE
SET step_name = EXCLUDED.step_name,
    action_type = EXCLUDED.action_type,
    schedule_offset_minutes = EXCLUDED.schedule_offset_minutes,
    config = EXCLUDED.config;
CREATE OR REPLACE VIEW public.v_cc_playbook_execution_mapping AS
SELECT
  p.playbook_key,
  p.display_name,
  p.trigger_rule,
  s.step_order,
  s.step_name,
  s.action_type,
  s.schedule_offset_minutes,
  s.config
FROM public.lead_playbooks p
JOIN public.lead_playbook_steps s ON s.playbook_key = p.playbook_key
WHERE p.enabled = true
ORDER BY p.playbook_key, s.step_order;
-- 7) Conversion acceleration (Step 25)
CREATE OR REPLACE VIEW public.v_cc_conversion_acceleration AS
SELECT
  ds.lead_id,
  ds.score,
  ds.intent_level,
  ds.last_activity,
  ds.source_quality,
  CASE
    WHEN ds.intent_level = 'hot' AND ds.owner_id IS NULL THEN 'priority_assignment'
    WHEN ds.intent_level = 'hot' AND ds.recommended_action <> 'send_whatsapp' THEN 'instant_whatsapp'
    WHEN ds.intent_level = 'hot' THEN 'instant_whatsapp_and_follow_up'
    WHEN ds.events_last_15m >= 4 THEN 'rapid_follow_up'
    ELSE 'standard_flow'
  END AS acceleration_action,
  CASE
    WHEN ds.intent_level = 'hot' THEN 95
    WHEN ds.events_last_15m >= 4 THEN 85
    WHEN ds.score >= 70 THEN 78
    ELSE 50
  END AS urgency_score
FROM public.v_cc_decision_signals ds
WHERE ds.lead_status NOT IN ('won', 'lost');
-- 8) Product feedback insight layer (Step 26)
CREATE OR REPLACE VIEW public.v_cc_product_feedback_insights AS
WITH page_stats AS (
  SELECT
    l.source_page,
    COUNT(*) AS leads,
    COUNT(*) FILTER (WHERE l.lead_status = 'won') AS won,
    COUNT(*) FILTER (WHERE l.lead_temperature = 'hot') AS hot,
    COALESCE(AVG(l.lead_score), 0) AS avg_score
  FROM public.leads l
  GROUP BY l.source_page
)
SELECT
  ps.source_page,
  ps.leads,
  ps.won,
  ps.hot,
  ps.avg_score,
  ROUND(CASE WHEN ps.leads = 0 THEN 0 ELSE (ps.won::numeric / ps.leads::numeric) * 100 END, 2) AS conversion_pct,
  ROUND((ps.hot - ps.won)::numeric, 2) AS hot_unconverted_gap,
  CASE
    WHEN ps.leads >= 10 AND ps.hot > ps.won * 2 THEN 'high'
    WHEN ps.leads >= 5 AND ps.hot > ps.won THEN 'medium'
    ELSE 'low'
  END AS improvement_priority
FROM page_stats ps;
-- 9) Lead value prediction (Step 27)
CREATE OR REPLACE VIEW public.v_cc_lead_value_prediction AS
SELECT
  ds.lead_id,
  ds.score,
  ds.intent_level,
  ds.source_quality,
  ds.events_last_30m,
  l.service_slug,
  ROUND(
    (
      COALESCE(ds.score, 0) * 0.45 +
      COALESCE(ds.source_quality, 0) * 0.20 +
      LEAST(20, COALESCE(ds.events_last_30m, 0) * 3) +
      CASE ds.intent_level
        WHEN 'hot' THEN 18
        WHEN 'warm' THEN 10
        ELSE 3
      END
    )::numeric,
    2
  ) AS value_score,
  ROUND(
    (
      (COALESCE(ds.score, 0) * 8) +
      (COALESCE(ds.source_quality, 0) * 5) +
      (CASE ds.intent_level WHEN 'hot' THEN 2500 WHEN 'warm' THEN 1200 ELSE 450 END)
    )::numeric,
    2
  ) AS expected_deal_value,
  jsonb_build_object(
    'score_weight', ROUND((COALESCE(ds.score, 0) * 0.45)::numeric, 2),
    'source_quality_weight', ROUND((COALESCE(ds.source_quality, 0) * 0.20)::numeric, 2),
    'activity_weight', ROUND((LEAST(20, COALESCE(ds.events_last_30m, 0) * 3))::numeric, 2),
    'intent_bonus', CASE ds.intent_level WHEN 'hot' THEN 18 WHEN 'warm' THEN 10 ELSE 3 END
  ) AS prediction_explainability
FROM public.v_cc_decision_signals ds
JOIN public.leads l ON l.id = ds.lead_id
WHERE ds.lead_status NOT IN ('won', 'lost');
-- 10) Automated re-engagement (Step 28)
CREATE OR REPLACE VIEW public.v_cc_reengagement_candidates AS
SELECT
  l.id AS lead_id,
  l.owner_id,
  l.lead_status,
  l.lead_temperature AS intent_level,
  l.lead_score AS score,
  l.last_contacted_at,
  l.next_follow_up_at,
  GREATEST(
    COALESCE(l.last_contacted_at, 'epoch'::timestamptz),
    COALESCE(l.next_follow_up_at, 'epoch'::timestamptz),
    l.created_at
  ) AS inactivity_anchor,
  CASE
    WHEN l.lead_temperature = 'hot' THEN 'whatsapp_reengagement'
    WHEN l.lead_temperature = 'warm' THEN 'email_or_whatsapp_reengagement'
    ELSE 'low_frequency_reengagement'
  END AS reengagement_action,
  CASE
    WHEN l.lead_temperature = 'hot' THEN 90
    WHEN l.lead_temperature = 'warm' THEN 70
    ELSE 45
  END AS reengagement_priority
FROM public.leads l
WHERE l.lead_status NOT IN ('won', 'lost')
  AND GREATEST(
    COALESCE(l.last_contacted_at, 'epoch'::timestamptz),
    COALESCE(l.next_follow_up_at, 'epoch'::timestamptz),
    l.created_at
  ) < now() - interval '72 hours';
-- 11) Execution discipline (Step 30)
CREATE OR REPLACE VIEW public.v_cc_execution_discipline_metrics AS
SELECT
  COALESCE(l.owner_id, 'unassigned') AS owner_id,
  COUNT(*) FILTER (
    WHERE l.lead_status IN ('new', 'assigned')
      AND l.last_contacted_at IS NULL
      AND l.created_at < now() - interval '30 minutes'
  ) AS missed_first_contact_count,
  COUNT(*) FILTER (
    WHERE t.status <> 'completed'
      AND t.due_at IS NOT NULL
      AND t.due_at < now()
  ) AS missed_follow_up_count,
  ROUND(
    AVG(EXTRACT(EPOCH FROM (l.last_contacted_at - l.created_at)) / 60.0)
    FILTER (WHERE l.last_contacted_at IS NOT NULL),
    2
  ) AS avg_response_minutes,
  ROUND(
    (
      COALESCE(
        AVG(EXTRACT(EPOCH FROM (l.last_contacted_at - l.created_at)) / 60.0)
        FILTER (WHERE l.last_contacted_at IS NOT NULL),
        120
      ) +
      (COUNT(*) FILTER (
        WHERE l.lead_status IN ('new', 'assigned')
          AND l.last_contacted_at IS NULL
          AND l.created_at < now() - interval '30 minutes'
      ) * 10) +
      (COUNT(*) FILTER (
        WHERE t.status <> 'completed'
          AND t.due_at IS NOT NULL
          AND t.due_at < now()
      ) * 8)
    )::numeric,
    2
  ) AS discipline_risk_score
FROM public.leads l
LEFT JOIN public.lead_tasks t ON t.lead_id = l.id
GROUP BY COALESCE(l.owner_id, 'unassigned');
ALTER TABLE public.lead_playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_playbook_steps ENABLE ROW LEVEL SECURITY;
