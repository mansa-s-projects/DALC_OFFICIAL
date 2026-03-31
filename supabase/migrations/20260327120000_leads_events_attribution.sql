CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  source_page text NOT NULL,
  source_section text NOT NULL,
  cta_label text NOT NULL,
  service_slug text,
  destination text NOT NULL,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  user_agent text,
  session_id text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_name text NOT NULL,
  page text NOT NULL,
  section text,
  cta_label text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  session_id text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source_page ON public.leads(source_page);
CREATE INDEX IF NOT EXISTS idx_leads_service_slug ON public.leads(service_slug);
CREATE INDEX IF NOT EXISTS idx_leads_session_id ON public.leads(session_id);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON public.events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_page ON public.events(page);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON public.events(session_id);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
