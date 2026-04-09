-- Create events table with client_event_id deduplication support
-- Safe to run even if events table already exists (handles both states)

CREATE TABLE IF NOT EXISTS public.events (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz NOT NULL DEFAULT now(),
  client_event_id  text        UNIQUE,
  event_name       text        NOT NULL,
  page             text        NOT NULL DEFAULT '',
  section          text,
  cta_label        text,
  metadata         jsonb       NOT NULL DEFAULT '{}'::jsonb,
  session_id       text        NOT NULL DEFAULT ''
);

-- If the table already existed without client_event_id, add it now
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'events'
      AND column_name  = 'client_event_id'
  ) THEN
    ALTER TABLE public.events ADD COLUMN client_event_id text UNIQUE;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_created_at      ON public.events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_name      ON public.events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_page            ON public.events(page);
CREATE INDEX IF NOT EXISTS idx_events_session_id      ON public.events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_client_event_id ON public.events(client_event_id);

-- RLS (service-role key bypasses this; anon cannot read)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert/select freely (policy for anon is intentionally absent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'events'
      AND policyname = 'service_role_all'
  ) THEN
    EXECUTE 'CREATE POLICY service_role_all ON public.events
      FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- Ensure leads table also exists (API uses it in the same request path)
CREATE TABLE IF NOT EXISTS public.leads (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  name           text        NOT NULL DEFAULT '',
  email          text,
  phone          text        NOT NULL DEFAULT '',
  source_page    text        NOT NULL DEFAULT '',
  source_section text        NOT NULL DEFAULT '',
  cta_label      text        NOT NULL DEFAULT '',
  service_slug   text,
  destination    text        NOT NULL DEFAULT '',
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  utm_term       text,
  utm_content    text,
  referrer       text,
  user_agent     text,
  session_id     text        NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at   ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source_page  ON public.leads(source_page);
CREATE INDEX IF NOT EXISTS idx_leads_service_slug ON public.leads(service_slug);
CREATE INDEX IF NOT EXISTS idx_leads_session_id   ON public.leads(session_id);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
