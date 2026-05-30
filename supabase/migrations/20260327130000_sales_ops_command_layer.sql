ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS owner_id text,
  ADD COLUMN IF NOT EXISTS assigned_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_follow_up_at timestamptz,
  ADD COLUMN IF NOT EXISTS follow_up_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS closed_at timestamptz,
  ADD COLUMN IF NOT EXISTS lost_reason text,
  ADD COLUMN IF NOT EXISTS won_value numeric(12,2),
  ADD COLUMN IF NOT EXISTS notes_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sla_first_contact_breached boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sla_first_contact_breached_at timestamptz,
  ADD COLUMN IF NOT EXISTS sla_follow_up_breached boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sla_follow_up_breached_at timestamptz;
CREATE TABLE IF NOT EXISTS public.lead_ownership_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  previous_owner_id text,
  new_owner_id text NOT NULL,
  changed_by text,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE TABLE IF NOT EXISTS public.lead_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  owner_id text,
  task_type text NOT NULL,
  title text NOT NULL,
  due_at timestamptz,
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'medium',
  created_by text,
  completion_note text,
  idempotency_key text
);
CREATE TABLE IF NOT EXISTS public.lead_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  actor_id text,
  previous_data jsonb,
  next_data jsonb,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key text
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_lead_tasks_idempotency_key
  ON public.lead_tasks(idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_lead_history_idempotency_key
  ON public.lead_history(idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_owner_status
  ON public.leads(owner_id, lead_status, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up_due
  ON public.leads(next_follow_up_at)
  WHERE lead_status NOT IN ('won', 'lost');
CREATE INDEX IF NOT EXISTS idx_lead_tasks_owner_status_due
  ON public.lead_tasks(owner_id, status, due_at);
CREATE INDEX IF NOT EXISTS idx_lead_history_lead_created
  ON public.lead_history(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ownership_history_lead_created
  ON public.lead_ownership_history(lead_id, created_at DESC);
CREATE OR REPLACE FUNCTION public.is_valid_lead_status_transition(old_status text, new_status text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  IF old_status = new_status THEN
    RETURN true;
  END IF;

  RETURN (
    (old_status = 'new' AND new_status IN ('assigned', 'lost', 'unresponsive')) OR
    (old_status = 'assigned' AND new_status IN ('contacted', 'lost', 'unresponsive')) OR
    (old_status = 'contacted' AND new_status IN ('qualified', 'lost', 'unresponsive')) OR
    (old_status = 'qualified' AND new_status IN ('proposal_sent', 'lost', 'unresponsive')) OR
    (old_status = 'proposal_sent' AND new_status IN ('negotiation', 'won', 'lost', 'unresponsive')) OR
    (old_status = 'negotiation' AND new_status IN ('won', 'lost', 'unresponsive')) OR
    (old_status = 'unresponsive' AND new_status IN ('contacted', 'lost')) OR
    (old_status = 'won' AND new_status = 'won') OR
    (old_status = 'lost' AND new_status = 'lost')
  );
END;
$$;
CREATE OR REPLACE FUNCTION public.enforce_lead_status_transition()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT public.is_valid_lead_status_transition(OLD.lead_status, NEW.lead_status) THEN
    RAISE EXCEPTION 'Invalid lead status transition: % -> %', OLD.lead_status, NEW.lead_status;
  END IF;

  IF NEW.lead_status IS DISTINCT FROM OLD.lead_status THEN
    NEW.status_updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_enforce_lead_status_transition ON public.leads;
CREATE TRIGGER trg_enforce_lead_status_transition
BEFORE UPDATE ON public.leads
FOR EACH ROW
WHEN (OLD.lead_status IS DISTINCT FROM NEW.lead_status)
EXECUTE FUNCTION public.enforce_lead_status_transition();
CREATE OR REPLACE VIEW public.v_leads_by_owner AS
SELECT
  owner_id,
  lead_status,
  priority,
  COUNT(*) AS lead_count
FROM public.leads
GROUP BY owner_id, lead_status, priority;
CREATE OR REPLACE VIEW public.v_overdue_follow_ups AS
SELECT
  t.id,
  t.lead_id,
  t.owner_id,
  t.task_type,
  t.title,
  t.due_at,
  t.priority,
  l.lead_status,
  l.lead_temperature
FROM public.lead_tasks t
JOIN public.leads l ON l.id = t.lead_id
WHERE t.status <> 'completed'
  AND t.due_at IS NOT NULL
  AND t.due_at < now();
CREATE OR REPLACE VIEW public.v_hot_leads_no_contact AS
SELECT
  id,
  owner_id,
  lead_temperature,
  lead_status,
  created_at,
  source_page,
  service_slug
FROM public.leads
WHERE lead_temperature = 'hot'
  AND last_contacted_at IS NULL
  AND lead_status NOT IN ('won', 'lost');
CREATE OR REPLACE VIEW public.v_won_leads_by_source AS
SELECT
  source_page,
  service_slug,
  COUNT(*) AS won_count,
  COALESCE(SUM(won_value), 0) AS total_won_value
FROM public.leads
WHERE lead_status = 'won'
GROUP BY source_page, service_slug;
CREATE OR REPLACE VIEW public.v_lost_leads_by_reason AS
SELECT
  COALESCE(lost_reason, 'unspecified') AS lost_reason,
  COUNT(*) AS lost_count
FROM public.leads
WHERE lead_status = 'lost'
GROUP BY COALESCE(lost_reason, 'unspecified');
CREATE OR REPLACE VIEW public.v_salesperson_workload AS
SELECT
  l.owner_id,
  COUNT(*) FILTER (WHERE l.lead_status NOT IN ('won', 'lost')) AS open_leads,
  COUNT(t.id) FILTER (WHERE t.status <> 'completed') AS open_tasks,
  COUNT(t.id) FILTER (WHERE t.status <> 'completed' AND t.due_at < now()) AS overdue_tasks
FROM public.leads l
LEFT JOIN public.lead_tasks t ON t.lead_id = l.id
GROUP BY l.owner_id;
CREATE OR REPLACE VIEW public.v_conversion_rate_by_owner AS
SELECT
  owner_id,
  COUNT(*) FILTER (WHERE lead_status = 'won') AS won_count,
  COUNT(*) FILTER (WHERE lead_status = 'lost') AS lost_count,
  COUNT(*) AS total_count,
  CASE
    WHEN COUNT(*) = 0 THEN 0
    ELSE ROUND((COUNT(*) FILTER (WHERE lead_status = 'won')::numeric / COUNT(*)::numeric) * 100, 2)
  END AS conversion_rate_pct
FROM public.leads
GROUP BY owner_id;
CREATE OR REPLACE VIEW public.v_avg_time_to_first_contact AS
SELECT
  owner_id,
  AVG(EXTRACT(EPOCH FROM (last_contacted_at - created_at)) / 60.0) AS avg_minutes_to_first_contact
FROM public.leads
WHERE last_contacted_at IS NOT NULL
GROUP BY owner_id;
ALTER TABLE public.lead_ownership_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_history ENABLE ROW LEVEL SECURITY;
