CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  owner_id text,
  team_id text,
  event_type text NOT NULL,
  channel text NOT NULL,
  recipient text NOT NULL,
  enabled boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  owner_id text,
  channel text NOT NULL,
  recipient text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  failed_at timestamptz,
  error_message text,
  dedupe_key text NOT NULL,
  retry_count integer NOT NULL DEFAULT 0,
  read_at timestamptz,
  trigger_source text
);

-- Ensure all sales-ops columns exist on the pre-existing notifications table
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS event_type      TEXT,
  ADD COLUMN IF NOT EXISTS lead_id         UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS owner_id        TEXT,
  ADD COLUMN IF NOT EXISTS channel         TEXT,
  ADD COLUMN IF NOT EXISTS recipient       TEXT,
  ADD COLUMN IF NOT EXISTS payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status          TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS sent_at         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS failed_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS error_message   TEXT,
  ADD COLUMN IF NOT EXISTS dedupe_key      TEXT,
  ADD COLUMN IF NOT EXISTS retry_count     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trigger_source  TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS ux_notifications_dedupe_channel_recipient
  ON public.notifications(dedupe_key, channel, recipient)
  WHERE dedupe_key IS NOT NULL AND channel IS NOT NULL AND recipient IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_status_created
  ON public.notifications(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_lead_created
  ON public.notifications(lead_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_owner_created
  ON public.notifications(owner_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_unread_dashboard
  ON public.notifications(channel, read_at, created_at DESC)
  WHERE channel = 'internal_dashboard';

CREATE INDEX IF NOT EXISTS idx_notification_preferences_lookup
  ON public.notification_preferences(event_type, owner_id, team_id, channel, enabled);

CREATE OR REPLACE VIEW public.v_failed_notifications AS
SELECT *
FROM public.notifications
WHERE status = 'failed';

CREATE OR REPLACE VIEW public.v_notifications_by_lead AS
SELECT
  lead_id,
  event_type,
  channel,
  status,
  created_at,
  sent_at,
  failed_at,
  retry_count,
  error_message
FROM public.notifications
WHERE lead_id IS NOT NULL;

CREATE OR REPLACE VIEW public.v_notifications_by_owner AS
SELECT
  owner_id,
  event_type,
  channel,
  status,
  created_at,
  sent_at,
  failed_at,
  retry_count
FROM public.notifications
WHERE owner_id IS NOT NULL;

CREATE OR REPLACE VIEW public.v_recent_alerts AS
SELECT
  id,
  created_at,
  event_type,
  lead_id,
  owner_id,
  channel,
  recipient,
  status,
  payload
FROM public.notifications
WHERE created_at >= now() - interval '24 hours'
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW public.v_unread_dashboard_alerts AS
SELECT
  id,
  created_at,
  event_type,
  lead_id,
  owner_id,
  recipient,
  payload,
  status
FROM public.notifications
WHERE channel = 'internal_dashboard'
  AND read_at IS NULL
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW public.v_notification_volume_by_type AS
SELECT
  event_type,
  channel,
  status,
  date_trunc('hour', created_at) AS hour_bucket,
  COUNT(*) AS volume
FROM public.notifications
GROUP BY event_type, channel, status, date_trunc('hour', created_at)
ORDER BY hour_bucket DESC;

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
