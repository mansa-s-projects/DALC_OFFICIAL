-- Align shared requests table with concierge-specific request metadata.

ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS concierge_request_type TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS urgency TEXT,
  ADD COLUMN IF NOT EXISTS preferred_date DATE,
  ADD COLUMN IF NOT EXISTS preferred_time TIME,
  ADD COLUMN IF NOT EXISTS budget_range TEXT,
  ADD COLUMN IF NOT EXISTS special_instructions TEXT,
  ADD COLUMN IF NOT EXISTS concierge_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_requests_request_type ON public.requests(request_type);
CREATE INDEX IF NOT EXISTS idx_requests_concierge_type ON public.requests(concierge_request_type)
  WHERE concierge_request_type IS NOT NULL;