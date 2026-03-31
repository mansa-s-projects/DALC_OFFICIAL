CREATE INDEX IF NOT EXISTS idx_leads_dashboard_hot
  ON public.leads(lead_temperature, lead_score DESC, status_updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_dashboard_status_owner
  ON public.leads(lead_status, owner_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_dashboard_followup
  ON public.leads(next_follow_up_at, lead_status);

CREATE INDEX IF NOT EXISTS idx_leads_dashboard_closed
  ON public.leads(closed_at DESC, lead_status);

CREATE INDEX IF NOT EXISTS idx_tasks_dashboard_due
  ON public.lead_tasks(status, due_at, priority);

CREATE INDEX IF NOT EXISTS idx_history_dashboard_created
  ON public.lead_history(created_at DESC, action_type);

CREATE OR REPLACE VIEW public.v_dashboard_live_lead_feed AS
SELECT
  l.id,
  l.created_at,
  l.source_page,
  l.source_section,
  l.service_slug,
  l.lead_status,
  l.owner_id,
  l.lead_score,
  l.lead_temperature,
  l.priority AS priority_tier,
  GREATEST(
    COALESCE(l.last_contacted_at, 'epoch'::timestamptz),
    COALESCE(l.last_scored_at, 'epoch'::timestamptz),
    COALESCE(l.last_automation_at, 'epoch'::timestamptz),
    COALESCE(l.status_updated_at, 'epoch'::timestamptz),
    l.created_at
  ) AS last_activity_at,
  CASE
    WHEN l.owner_id IS NULL THEN 'assign_owner'
    WHEN l.lead_status IN ('new', 'assigned') AND l.last_contacted_at IS NULL THEN 'first_contact'
    WHEN l.lead_status NOT IN ('won', 'lost') AND l.next_follow_up_at IS NULL THEN 'schedule_follow_up'
    WHEN l.lead_status NOT IN ('won', 'lost') AND l.next_follow_up_at < now() THEN 'complete_overdue_follow_up'
    WHEN l.lead_status = 'unresponsive' THEN 're_engagement'
    ELSE 'review'
  END AS next_required_action
FROM public.leads l;

CREATE OR REPLACE VIEW public.v_dashboard_hot_leads AS
SELECT
  l.id,
  l.created_at,
  l.source_page,
  l.service_slug,
  l.owner_id,
  l.lead_score,
  l.lead_temperature,
  l.priority AS priority_tier,
  GREATEST(
    COALESCE(l.last_contacted_at, 'epoch'::timestamptz),
    COALESCE(l.last_scored_at, 'epoch'::timestamptz),
    COALESCE(l.last_automation_at, 'epoch'::timestamptz),
    COALESCE(l.status_updated_at, 'epoch'::timestamptz),
    l.created_at
  ) AS last_activity_at,
  CASE
    WHEN l.last_contacted_at IS NULL THEN 'first_contact'
    WHEN l.next_follow_up_at IS NULL THEN 'schedule_follow_up'
    WHEN l.next_follow_up_at < now() THEN 'complete_overdue_follow_up'
    ELSE 'review'
  END AS next_required_action
FROM public.leads l
WHERE l.lead_temperature = 'hot'
  AND l.lead_status NOT IN ('won', 'lost');

CREATE OR REPLACE VIEW public.v_dashboard_overdue_tasks AS
SELECT
  t.id,
  t.lead_id,
  t.owner_id,
  t.task_type,
  t.title,
  t.status,
  t.priority,
  t.due_at,
  l.lead_score,
  l.lead_temperature,
  l.lead_status,
  EXTRACT(EPOCH FROM (now() - t.due_at)) / 60.0 AS minutes_overdue,
  CASE t.priority
    WHEN 'urgent' THEN 4
    WHEN 'high' THEN 3
    WHEN 'medium' THEN 2
    ELSE 1
  END * 1000 + GREATEST(0, EXTRACT(EPOCH FROM (now() - t.due_at)) / 60.0)::int AS urgency_score,
  CASE
    WHEN l.lead_status IN ('won', 'lost') THEN 'none'
    WHEN l.lead_temperature = 'hot' THEN 'complete_task_now'
    ELSE 'complete_task'
  END AS next_required_action
FROM public.lead_tasks t
JOIN public.leads l ON l.id = t.lead_id
WHERE t.status <> 'completed'
  AND t.due_at IS NOT NULL
  AND t.due_at < now();

CREATE OR REPLACE VIEW public.v_dashboard_needs_first_contact AS
SELECT
  l.id,
  l.created_at,
  l.source_page,
  l.service_slug,
  l.owner_id,
  l.lead_score,
  l.lead_temperature,
  l.priority AS priority_tier,
  l.last_contacted_at,
  'first_contact'::text AS next_required_action
FROM public.leads l
WHERE l.lead_status IN ('new', 'assigned')
  AND l.last_contacted_at IS NULL;

CREATE OR REPLACE VIEW public.v_dashboard_recent_conversions AS
SELECT
  l.id,
  l.closed_at,
  l.source_page,
  l.service_slug,
  l.owner_id,
  l.won_value,
  l.lead_score,
  l.priority AS priority_tier,
  'won'::text AS conversion_status
FROM public.leads l
WHERE l.lead_status = 'won'
  AND l.closed_at IS NOT NULL;

CREATE OR REPLACE VIEW public.v_dashboard_activity_stream AS
SELECT
  h.created_at AS occurred_at,
  h.lead_id,
  h.action_type AS activity_type,
  h.actor_id,
  h.reason,
  h.metadata,
  l.lead_score,
  l.priority AS priority_tier,
  GREATEST(
    COALESCE(l.last_contacted_at, 'epoch'::timestamptz),
    COALESCE(l.last_scored_at, 'epoch'::timestamptz),
    COALESCE(l.last_automation_at, 'epoch'::timestamptz),
    COALESCE(l.status_updated_at, 'epoch'::timestamptz),
    l.created_at
  ) AS last_activity_at,
  CASE
    WHEN l.owner_id IS NULL THEN 'assign_owner'
    WHEN l.last_contacted_at IS NULL THEN 'first_contact'
    WHEN l.next_follow_up_at IS NULL THEN 'schedule_follow_up'
    ELSE 'review'
  END AS next_required_action
FROM public.lead_history h
JOIN public.leads l ON l.id = h.lead_id;

CREATE OR REPLACE VIEW public.v_dashboard_leads_without_owner AS
SELECT
  l.id,
  l.created_at,
  l.source_page,
  l.service_slug,
  l.lead_score,
  l.lead_temperature,
  l.priority AS priority_tier,
  'assign_owner'::text AS next_required_action
FROM public.leads l
WHERE l.owner_id IS NULL
  AND l.lead_status NOT IN ('won', 'lost');

CREATE OR REPLACE VIEW public.v_dashboard_leads_without_follow_up AS
SELECT
  l.id,
  l.created_at,
  l.owner_id,
  l.source_page,
  l.service_slug,
  l.lead_score,
  l.lead_temperature,
  l.priority AS priority_tier,
  'schedule_follow_up'::text AS next_required_action
FROM public.leads l
WHERE l.next_follow_up_at IS NULL
  AND l.lead_status NOT IN ('won', 'lost');

CREATE OR REPLACE VIEW public.v_dashboard_recently_active_leads AS
SELECT
  l.id,
  l.owner_id,
  l.source_page,
  l.service_slug,
  l.lead_score,
  l.lead_temperature,
  l.priority AS priority_tier,
  GREATEST(
    COALESCE(l.last_contacted_at, 'epoch'::timestamptz),
    COALESCE(l.last_scored_at, 'epoch'::timestamptz),
    COALESCE(l.last_automation_at, 'epoch'::timestamptz),
    COALESCE(l.status_updated_at, 'epoch'::timestamptz),
    l.created_at
  ) AS last_activity_at,
  CASE
    WHEN l.next_follow_up_at IS NULL THEN 'schedule_follow_up'
    WHEN l.next_follow_up_at < now() THEN 'complete_overdue_follow_up'
    ELSE 'review'
  END AS next_required_action
FROM public.leads l
WHERE GREATEST(
    COALESCE(l.last_contacted_at, 'epoch'::timestamptz),
    COALESCE(l.last_scored_at, 'epoch'::timestamptz),
    COALESCE(l.last_automation_at, 'epoch'::timestamptz),
    COALESCE(l.status_updated_at, 'epoch'::timestamptz),
    l.created_at
  ) >= now() - interval '30 minutes';

CREATE OR REPLACE VIEW public.v_dashboard_top_converting_sources AS
SELECT
  l.source_page,
  l.service_slug,
  COUNT(*) FILTER (WHERE l.lead_status = 'won') AS won_count,
  COUNT(*) AS total_count,
  CASE
    WHEN COUNT(*) = 0 THEN 0
    ELSE ROUND((COUNT(*) FILTER (WHERE l.lead_status = 'won')::numeric / COUNT(*)::numeric) * 100, 2)
  END AS conversion_rate_pct,
  COALESCE(SUM(l.won_value) FILTER (WHERE l.lead_status = 'won'), 0) AS won_value_total
FROM public.leads l
GROUP BY l.source_page, l.service_slug;

CREATE OR REPLACE VIEW public.v_dashboard_metrics AS
SELECT
  (SELECT COUNT(*) FROM public.leads WHERE created_at >= date_trunc('day', now())) AS new_leads_today,
  (SELECT COUNT(*) FROM public.leads WHERE lead_temperature = 'hot' AND lead_status NOT IN ('won', 'lost')) AS hot_leads,
  (SELECT COUNT(*) FROM public.lead_tasks WHERE status <> 'completed' AND due_at IS NOT NULL AND due_at < now()) AS overdue_follow_ups,
  (SELECT AVG(EXTRACT(EPOCH FROM (last_contacted_at - created_at)) / 60.0) FROM public.leads WHERE last_contacted_at IS NOT NULL) AS avg_minutes_to_first_contact,
  (
    SELECT CASE WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND((COUNT(*) FILTER (WHERE lead_status = 'won')::numeric / COUNT(*)::numeric) * 100, 2)
    END
    FROM public.leads
  ) AS conversion_rate_pct,
  (
    SELECT COALESCE(jsonb_agg(t ORDER BY t.count DESC), '[]'::jsonb)
    FROM (
      SELECT source_page, COUNT(*) AS count
      FROM public.leads
      GROUP BY source_page
    ) t
  ) AS leads_by_source,
  (
    SELECT COALESCE(jsonb_agg(t ORDER BY t.count DESC), '[]'::jsonb)
    FROM (
      SELECT service_slug, COUNT(*) AS count
      FROM public.leads
      GROUP BY service_slug
    ) t
  ) AS leads_by_service_interest;

CREATE OR REPLACE VIEW public.v_dashboard_alerts AS
SELECT
  'new_hot_lead'::text AS alert_type,
  l.id AS lead_id,
  l.owner_id,
  l.priority AS priority_tier,
  l.lead_score,
  l.created_at AS occurred_at,
  jsonb_build_object('service_slug', l.service_slug, 'source_page', l.source_page) AS payload
FROM public.leads l
WHERE l.lead_temperature = 'hot'
  AND l.created_at >= now() - interval '30 minutes'

UNION ALL

SELECT
  'sla_breach'::text AS alert_type,
  l.id AS lead_id,
  l.owner_id,
  l.priority AS priority_tier,
  l.lead_score,
  COALESCE(l.sla_first_contact_breached_at, l.sla_follow_up_breached_at, l.status_updated_at) AS occurred_at,
  jsonb_build_object(
    'sla_first_contact_breached', l.sla_first_contact_breached,
    'sla_follow_up_breached', l.sla_follow_up_breached
  ) AS payload
FROM public.leads l
WHERE l.sla_first_contact_breached = true
   OR l.sla_follow_up_breached = true

UNION ALL

SELECT
  'lead_unresponsive'::text AS alert_type,
  l.id AS lead_id,
  l.owner_id,
  l.priority AS priority_tier,
  l.lead_score,
  l.status_updated_at AS occurred_at,
  jsonb_build_object('lead_status', l.lead_status) AS payload
FROM public.leads l
WHERE l.lead_status = 'unresponsive'

UNION ALL

SELECT
  'lead_converted'::text AS alert_type,
  l.id AS lead_id,
  l.owner_id,
  l.priority AS priority_tier,
  l.lead_score,
  COALESCE(l.closed_at, l.status_updated_at) AS occurred_at,
  jsonb_build_object('won_value', l.won_value, 'source_page', l.source_page) AS payload
FROM public.leads l
WHERE l.lead_status = 'won';
