ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lead_temperature text NOT NULL DEFAULT 'cold',
  ADD COLUMN IF NOT EXISTS last_scored_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_automation_at timestamptz,
  ADD COLUMN IF NOT EXISTS automation_status text NOT NULL DEFAULT 'idle',
  ADD COLUMN IF NOT EXISTS assigned_to text,
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'low',
  ADD COLUMN IF NOT EXISTS follow_up_state text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS notifications_sent jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS workflow_history jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS idempotency_key text;
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS client_event_id text;
CREATE UNIQUE INDEX IF NOT EXISTS ux_leads_idempotency_key
  ON public.leads(idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_events_client_event_id
  ON public.events(client_event_id)
  WHERE client_event_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS public.lead_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  trigger_name text NOT NULL,
  trigger_key text NOT NULL,
  action_name text NOT NULL,
  status text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  executed_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_lead_automations_dedupe
  ON public.lead_automations(lead_id, trigger_key, action_name);
CREATE INDEX IF NOT EXISTS idx_lead_automations_lead_id
  ON public.lead_automations(lead_id, executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_temperature_priority
  ON public.leads(lead_temperature, priority, created_at DESC);
ALTER TABLE public.lead_automations ENABLE ROW LEVEL SECURITY;
