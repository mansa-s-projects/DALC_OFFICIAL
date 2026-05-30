-- RBAC core
DO $$
BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'sales_manager', 'sales_agent', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  team_id text,
  UNIQUE (user_id)
);
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS owner_team_id text;
CREATE OR REPLACE FUNCTION public.current_app_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role'),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role'),
    'viewer'
  );
$$;
CREATE OR REPLACE FUNCTION public.current_app_team_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'team_id'),
    ''
  );
$$;
-- Permission map (db-native)
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  resource text NOT NULL,
  action text NOT NULL,
  allowed boolean NOT NULL DEFAULT true,
  UNIQUE(role, resource, action)
);
INSERT INTO public.role_permissions (role, resource, action, allowed)
VALUES
  ('admin', 'leads', 'view', true),
  ('admin', 'leads', 'edit', true),
  ('admin', 'leads', 'assign', true),
  ('admin', 'leads', 'change_status', true),
  ('admin', 'tasks', 'manage', true),
  ('admin', 'reports', 'view', true),
  ('admin', 'users', 'manage', true),
  ('sales_manager', 'leads', 'view', true),
  ('sales_manager', 'leads', 'edit', true),
  ('sales_manager', 'leads', 'assign', true),
  ('sales_manager', 'leads', 'change_status', true),
  ('sales_manager', 'tasks', 'manage', true),
  ('sales_manager', 'reports', 'view', true),
  ('sales_manager', 'users', 'manage', false),
  ('sales_agent', 'leads', 'view', true),
  ('sales_agent', 'leads', 'edit', true),
  ('sales_agent', 'leads', 'assign', false),
  ('sales_agent', 'leads', 'change_status', true),
  ('sales_agent', 'tasks', 'manage', true),
  ('sales_agent', 'reports', 'view', false),
  ('sales_agent', 'users', 'manage', false),
  ('viewer', 'leads', 'view', true),
  ('viewer', 'leads', 'edit', false),
  ('viewer', 'leads', 'assign', false),
  ('viewer', 'leads', 'change_status', false),
  ('viewer', 'tasks', 'manage', false),
  ('viewer', 'reports', 'view', true),
  ('viewer', 'users', 'manage', false)
ON CONFLICT (role, resource, action) DO UPDATE SET allowed = EXCLUDED.allowed;
-- RLS policies for sales ops entities
DROP POLICY IF EXISTS leads_select_policy ON public.leads;
DROP POLICY IF EXISTS leads_update_policy ON public.leads;
DROP POLICY IF EXISTS leads_insert_policy ON public.leads;
CREATE POLICY leads_select_policy ON public.leads
FOR SELECT
USING (
  public.current_app_role() = 'admin'
  OR (
    public.current_app_role() = 'sales_manager'
    AND owner_team_id = public.current_app_team_id()
  )
  OR (
    public.current_app_role() = 'sales_agent'
    AND owner_id = auth.uid()::text
  )
  OR public.current_app_role() = 'viewer'
);
CREATE POLICY leads_update_policy ON public.leads
FOR UPDATE
USING (
  public.current_app_role() = 'admin'
  OR (
    public.current_app_role() = 'sales_manager'
    AND owner_team_id = public.current_app_team_id()
  )
  OR (
    public.current_app_role() = 'sales_agent'
    AND owner_id = auth.uid()::text
  )
);
CREATE POLICY leads_insert_policy ON public.leads
FOR INSERT
WITH CHECK (
  public.current_app_role() IN ('admin', 'sales_manager', 'sales_agent')
);
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lead_tasks_select_policy ON public.lead_tasks;
DROP POLICY IF EXISTS lead_tasks_update_policy ON public.lead_tasks;
DROP POLICY IF EXISTS lead_tasks_insert_policy ON public.lead_tasks;
CREATE POLICY lead_tasks_select_policy ON public.lead_tasks
FOR SELECT
USING (
  public.current_app_role() = 'admin'
  OR public.current_app_role() = 'viewer'
  OR (
    public.current_app_role() = 'sales_manager'
    AND EXISTS (
      SELECT 1 FROM public.leads l WHERE l.id = lead_tasks.lead_id AND l.owner_team_id = public.current_app_team_id()
    )
  )
  OR (
    public.current_app_role() = 'sales_agent'
    AND owner_id = auth.uid()::text
  )
);
CREATE POLICY lead_tasks_update_policy ON public.lead_tasks
FOR UPDATE
USING (
  public.current_app_role() = 'admin'
  OR (
    public.current_app_role() = 'sales_manager'
    AND EXISTS (
      SELECT 1 FROM public.leads l WHERE l.id = lead_tasks.lead_id AND l.owner_team_id = public.current_app_team_id()
    )
  )
  OR (
    public.current_app_role() = 'sales_agent'
    AND owner_id = auth.uid()::text
  )
);
CREATE POLICY lead_tasks_insert_policy ON public.lead_tasks
FOR INSERT
WITH CHECK (
  public.current_app_role() IN ('admin', 'sales_manager', 'sales_agent')
);
-- CRM sync layer
CREATE TABLE IF NOT EXISTS public.crm_sync_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  job_type text NOT NULL,
  provider text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  dedupe_key text NOT NULL,
  attempt_count integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz,
  last_error text,
  processed_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_crm_sync_jobs_dedupe ON public.crm_sync_jobs(dedupe_key);
CREATE INDEX IF NOT EXISTS idx_crm_sync_jobs_status_attempt ON public.crm_sync_jobs(status, next_attempt_at, created_at);
CREATE TABLE IF NOT EXISTS public.crm_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  job_id uuid NOT NULL REFERENCES public.crm_sync_jobs(id) ON DELETE CASCADE,
  status text NOT NULL,
  response_payload jsonb,
  error_message text
);
-- WhatsApp automation layer
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  template_key text NOT NULL UNIQUE,
  body text NOT NULL,
  variables jsonb NOT NULL DEFAULT '[]'::jsonb,
  enabled boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS public.whatsapp_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  trigger_type text NOT NULL,
  template_key text NOT NULL,
  recipient_phone text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  dedupe_key text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempt_count integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz,
  sent_at timestamptz,
  failed_at timestamptz,
  error_message text
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_whatsapp_jobs_dedupe ON public.whatsapp_jobs(dedupe_key);
CREATE INDEX IF NOT EXISTS idx_whatsapp_jobs_status_attempt ON public.whatsapp_jobs(status, next_attempt_at, created_at);
CREATE TABLE IF NOT EXISTS public.whatsapp_delivery_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  whatsapp_job_id uuid NOT NULL REFERENCES public.whatsapp_jobs(id) ON DELETE CASCADE,
  provider_message_id text,
  delivery_status text NOT NULL,
  provider_payload jsonb
);
-- Lead enrichment layer
CREATE TABLE IF NOT EXISTS public.lead_enrichment_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  dedupe_key text NOT NULL,
  attempt_count integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz,
  last_error text,
  processed_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_lead_enrichment_jobs_dedupe ON public.lead_enrichment_jobs(dedupe_key);
CREATE INDEX IF NOT EXISTS idx_lead_enrichment_jobs_status_attempt ON public.lead_enrichment_jobs(status, next_attempt_at, created_at);
CREATE TABLE IF NOT EXISTS public.lead_enrichment_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  provider text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidence_score numeric(5,2)
);
-- Experimentation system
CREATE TABLE IF NOT EXISTS public.experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  experiment_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft',
  allocation jsonb NOT NULL DEFAULT '{}'::jsonb,
  start_at timestamptz,
  end_at timestamptz
);
CREATE TABLE IF NOT EXISTS public.experiment_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  experiment_key text NOT NULL,
  session_id text NOT NULL,
  variant text NOT NULL,
  dedupe_key text NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS public.experiment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  experiment_key text NOT NULL,
  session_id text NOT NULL,
  variant text NOT NULL,
  event_name text NOT NULL,
  value numeric(12,2)
);
-- Monitoring setup
CREATE TABLE IF NOT EXISTS public.system_error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  component text NOT NULL,
  severity text NOT NULL,
  error_message text NOT NULL,
  payload jsonb
);
CREATE TABLE IF NOT EXISTS public.queue_health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  queue_name text NOT NULL,
  pending_count integer NOT NULL DEFAULT 0,
  processing_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  lag_seconds integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS public.api_failure_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  route text NOT NULL,
  method text NOT NULL,
  status_code integer,
  error_message text,
  payload jsonb
);
CREATE OR REPLACE VIEW public.v_monitoring_alert_rules AS
SELECT
  'queue_lag'::text AS alert_type,
  queue_name AS target,
  created_at,
  jsonb_build_object('lag_seconds', lag_seconds, 'failed_count', failed_count) AS payload
FROM public.queue_health_metrics
WHERE lag_seconds > 300 OR failed_count > 10

UNION ALL

SELECT
  'api_failure_spike'::text AS alert_type,
  route || ' ' || method AS target,
  created_at,
  jsonb_build_object('status_code', status_code, 'error_message', error_message) AS payload
FROM public.api_failure_logs
WHERE created_at >= now() - interval '15 minutes';
-- Advanced reporting materialized views
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_report_funnel_conversion AS
SELECT
  source_page,
  service_slug,
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE lead_status IN ('qualified','proposal_sent','negotiation','won')) AS progressed_leads,
  COUNT(*) FILTER (WHERE lead_status = 'won') AS won_leads,
  CASE WHEN COUNT(*) = 0 THEN 0
    ELSE ROUND((COUNT(*) FILTER (WHERE lead_status = 'won')::numeric / COUNT(*)::numeric) * 100, 2)
  END AS win_rate_pct
FROM public.leads
GROUP BY source_page, service_slug;
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_report_funnel_conversion_key
  ON public.mv_report_funnel_conversion(source_page, service_slug);
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_report_source_roi AS
SELECT
  source_page,
  COUNT(*) AS lead_count,
  COUNT(*) FILTER (WHERE lead_status = 'won') AS won_count,
  COALESCE(SUM(won_value) FILTER (WHERE lead_status = 'won'), 0) AS revenue,
  COALESCE(SUM(won_value) FILTER (WHERE lead_status = 'won'), 0) / NULLIF(COUNT(*), 0) AS revenue_per_lead
FROM public.leads
GROUP BY source_page;
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_report_source_roi_key
  ON public.mv_report_source_roi(source_page);
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_report_lead_quality_by_source AS
SELECT
  source_page,
  AVG(lead_score) AS avg_lead_score,
  COUNT(*) FILTER (WHERE lead_temperature = 'hot') AS hot_count,
  COUNT(*) AS total_count
FROM public.leads
GROUP BY source_page;
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_report_quality_key
  ON public.mv_report_lead_quality_by_source(source_page);
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_report_sales_performance AS
SELECT
  owner_id,
  COUNT(*) AS total_owned,
  COUNT(*) FILTER (WHERE lead_status = 'won') AS won_count,
  COUNT(*) FILTER (WHERE lead_status = 'lost') AS lost_count,
  COALESCE(SUM(won_value) FILTER (WHERE lead_status = 'won'), 0) AS revenue,
  AVG(EXTRACT(EPOCH FROM (last_contacted_at - created_at)) / 60.0) FILTER (WHERE last_contacted_at IS NOT NULL) AS avg_first_contact_minutes,
  CASE WHEN COUNT(*) = 0 THEN 0
    ELSE ROUND((COUNT(*) FILTER (WHERE lead_status = 'won')::numeric / COUNT(*)::numeric) * 100, 2)
  END AS conversion_rate_pct
FROM public.leads
GROUP BY owner_id;
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_report_sales_performance_key
  ON public.mv_report_sales_performance(owner_id);
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_report_time_to_close AS
SELECT
  owner_id,
  AVG(EXTRACT(EPOCH FROM (closed_at - created_at)) / 3600.0) FILTER (WHERE lead_status IN ('won','lost') AND closed_at IS NOT NULL) AS avg_hours_to_close,
  COUNT(*) FILTER (WHERE lead_status IN ('won','lost')) AS closed_count
FROM public.leads
GROUP BY owner_id;
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_report_time_to_close_key
  ON public.mv_report_time_to_close(owner_id);
-- Revenue attribution models
CREATE OR REPLACE VIEW public.v_revenue_attribution_first_touch AS
SELECT
  l.id AS lead_id,
  l.won_value,
  l.utm_source AS attributed_source,
  l.utm_medium AS attributed_medium,
  l.utm_campaign AS attributed_campaign,
  l.source_page AS attributed_page
FROM public.leads l
WHERE l.lead_status = 'won';
CREATE OR REPLACE VIEW public.v_revenue_attribution_last_touch AS
SELECT
  l.id AS lead_id,
  l.won_value,
  COALESCE(e.metadata ->> 'source_page', l.source_page) AS attributed_page,
  COALESCE(e.metadata ->> 'utm_source', l.utm_source) AS attributed_source,
  COALESCE(e.metadata ->> 'utm_medium', l.utm_medium) AS attributed_medium,
  COALESCE(e.metadata ->> 'utm_campaign', l.utm_campaign) AS attributed_campaign
FROM public.leads l
LEFT JOIN LATERAL (
  SELECT *
  FROM public.events e
  WHERE e.session_id = l.session_id
  ORDER BY e.created_at DESC
  LIMIT 1
) e ON true
WHERE l.lead_status = 'won';
CREATE OR REPLACE VIEW public.v_revenue_attribution_multi_touch AS
SELECT
  l.id AS lead_id,
  l.won_value,
  e.event_name,
  e.page,
  ROUND((l.won_value / NULLIF(COUNT(*) OVER (PARTITION BY l.id), 0))::numeric, 2) AS attributed_value
FROM public.leads l
JOIN public.events e ON e.session_id = l.session_id
WHERE l.lead_status = 'won';
-- Forecasting model
CREATE OR REPLACE VIEW public.v_revenue_forecast_simple AS
SELECT
  date_trunc('day', now())::date AS forecast_date,
  (SELECT COUNT(*) FROM public.leads WHERE created_at >= now() - interval '30 days') / 30.0 AS daily_lead_volume,
  (SELECT COALESCE(AVG(CASE WHEN lead_status = 'won' THEN 1.0 ELSE 0.0 END), 0) FROM public.leads WHERE created_at >= now() - interval '90 days') AS conversion_rate,
  (SELECT COALESCE(AVG(won_value), 0) FROM public.leads WHERE lead_status = 'won' AND won_value IS NOT NULL) AS avg_deal_size,
  (
    ((SELECT COUNT(*) FROM public.leads WHERE created_at >= now() - interval '30 days') / 30.0)
    * (SELECT COALESCE(AVG(CASE WHEN lead_status = 'won' THEN 1.0 ELSE 0.0 END), 0) FROM public.leads WHERE created_at >= now() - interval '90 days')
    * (SELECT COALESCE(AVG(won_value), 0) FROM public.leads WHERE lead_status = 'won' AND won_value IS NOT NULL)
  ) AS projected_daily_revenue;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_enrichment_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_enrichment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_failure_logs ENABLE ROW LEVEL SECURITY;
