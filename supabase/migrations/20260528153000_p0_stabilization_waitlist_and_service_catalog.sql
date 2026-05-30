-- P0 stabilization: restore missing waitlist table and service catalog view used by runtime/admin stats.

CREATE TABLE IF NOT EXISTS public.waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  experience_id UUID NOT NULL REFERENCES public.experience_services(id) ON DELETE CASCADE,
  time_slot TEXT,
  booking_date DATE,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'booked', 'expired')),
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_entries_experience_status
  ON public.waitlist_entries (experience_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_waitlist_entries_user_status
  ON public.waitlist_entries (user_id, status, created_at);

GRANT SELECT, INSERT, UPDATE ON public.waitlist_entries TO authenticated;

CREATE OR REPLACE VIEW public.v_service_catalog AS
SELECT
  'core.services'::TEXT AS source,
  s.id::TEXT AS source_id,
  s.id::TEXT AS canonical_service_id,
  s.slug,
  s.name,
  s.description,
  s.status,
  NULL::TEXT AS supplier_id,
  s.created_at,
  s.updated_at
FROM public.services s

UNION ALL

SELECT
  'business_services'::TEXT AS source,
  bs.id::TEXT AS source_id,
  bs.canonical_service_id::TEXT AS canonical_service_id,
  bs.slug,
  bs.name,
  bs.description_short AS description,
  bs.status,
  bs.supplier_id::TEXT AS supplier_id,
  bs.created_at,
  bs.updated_at
FROM public.business_services bs

UNION ALL

SELECT
  'transport_services'::TEXT AS source,
  ts.id::TEXT AS source_id,
  ts.canonical_service_id::TEXT AS canonical_service_id,
  ts.slug,
  ts.name,
  ts.description_short AS description,
  ts.status,
  ts.supplier_id::TEXT AS supplier_id,
  ts.created_at,
  ts.updated_at
FROM public.transport_services ts

UNION ALL

SELECT
  'stays_properties'::TEXT AS source,
  sp.id::TEXT AS source_id,
  sp.canonical_service_id::TEXT AS canonical_service_id,
  sp.slug,
  sp.name,
  sp.description_short AS description,
  sp.status,
  sp.supplier_id::TEXT AS supplier_id,
  sp.created_at,
  sp.updated_at
FROM public.stays_properties sp

UNION ALL

SELECT
  'experience_services'::TEXT AS source,
  es.id::TEXT AS source_id,
  NULL::TEXT AS canonical_service_id,
  es.slug,
  es.title AS name,
  es.description_short AS description,
  es.status,
  NULL::TEXT AS supplier_id,
  es.created_at,
  es.updated_at
FROM public.experience_services es;

GRANT SELECT ON public.v_service_catalog TO authenticated;
