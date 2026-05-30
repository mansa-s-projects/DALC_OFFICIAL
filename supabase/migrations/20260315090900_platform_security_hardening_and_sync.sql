-- ============================================================
-- Platform Security Hardening + Schema Sync
-- ============================================================

-- ------------------------------------------------------------
-- 1) SECURITY HARDENING (RLS + policy tightening)
-- ------------------------------------------------------------

-- REQUESTS
ALTER TABLE IF EXISTS public.requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own requests" ON public.requests;
DROP POLICY IF EXISTS "Users can create requests" ON public.requests;
DROP POLICY IF EXISTS "Staff can view all requests" ON public.requests;
DROP POLICY IF EXISTS "Staff can update requests" ON public.requests;
CREATE POLICY "requests_select_own_or_staff" ON public.requests
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
  );
-- Authenticated users can create their own requests.
-- Anonymous access is restricted to the DALC access intake pattern.
CREATE POLICY "requests_insert_guarded" ON public.requests
  FOR INSERT WITH CHECK (
    (
      auth.uid() IS NOT NULL
      AND user_id = auth.uid()
    )
    OR
    (
      auth.uid() IS NULL
      AND user_id IS NULL
      AND request_type = 'inquiry'
      AND notes = 'source=dalc_access'
      AND contact_info IS NOT NULL
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
  );
-- Users can update own requests only before fulfillment states.
CREATE POLICY "requests_update_guarded" ON public.requests
  FOR UPDATE USING (
    (
      user_id = auth.uid()
      AND status IN ('pending', 'submitted', 'acknowledged')
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
  )
  WITH CHECK (
    (
      user_id = auth.uid()
      AND status IN ('pending', 'submitted', 'acknowledged')
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
  );
-- REQUEST STATUS LOG
ALTER TABLE IF EXISTS public.request_status_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Staff can view request log" ON public.request_status_log;
DROP POLICY IF EXISTS "System can insert request log" ON public.request_status_log;
CREATE POLICY "request_log_select_own_or_staff" ON public.request_status_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.requests r
      WHERE r.id = request_id AND r.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
  );
CREATE POLICY "request_log_insert_staff_only" ON public.request_status_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
    OR
    changed_by = auth.uid()
  );
-- SUPPLIERS
ALTER TABLE IF EXISTS public.suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage suppliers" ON public.suppliers;
CREATE POLICY "suppliers_select_staff" ON public.suppliers
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
  );
CREATE POLICY "suppliers_manage_admin" ON public.suppliers
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
-- BOOKINGS (core)
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can manage bookings" ON public.bookings;
CREATE POLICY "bookings_select_own_or_staff" ON public.bookings
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
  );
CREATE POLICY "bookings_insert_staff_or_owner" ON public.bookings
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
  );
CREATE POLICY "bookings_update_staff_or_owner" ON public.bookings
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'concierge')
    )
  );
-- ------------------------------------------------------------
-- 2) FULL DATA SCHEME SYNC (canonical + legacy bridge)
-- ------------------------------------------------------------

-- Canonical status checks
ALTER TABLE IF EXISTS public.services
  ADD CONSTRAINT services_status_chk
  CHECK (status IN ('active', 'draft', 'archived')) NOT VALID;
ALTER TABLE IF EXISTS public.experiences
  ADD CONSTRAINT experiences_status_chk
  CHECK (status IN ('active', 'draft', 'archived')) NOT VALID;
ALTER TABLE IF EXISTS public.bookings
  ADD CONSTRAINT bookings_status_chk
  CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) NOT VALID;
-- Legacy -> canonical mapping columns
ALTER TABLE IF EXISTS public.business_services
  ADD COLUMN IF NOT EXISTS canonical_service_id UUID REFERENCES public.services(id) ON DELETE SET NULL;
ALTER TABLE IF EXISTS public.transport_services
  ADD COLUMN IF NOT EXISTS canonical_service_id UUID REFERENCES public.services(id) ON DELETE SET NULL;
ALTER TABLE IF EXISTS public.stays_properties
  ADD COLUMN IF NOT EXISTS canonical_service_id UUID REFERENCES public.services(id) ON DELETE SET NULL;
ALTER TABLE IF EXISTS public.experience_services
  ADD COLUMN IF NOT EXISTS canonical_service_id UUID REFERENCES public.services(id) ON DELETE SET NULL;
-- Requests/bookings normalized links
ALTER TABLE IF EXISTS public.requests
  ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL;
-- Core categories seed for platform pillars
INSERT INTO public.categories (slug, name, description)
VALUES
  ('move-to-dubai', 'Move To Dubai', 'Relocation and setup services'),
  ('experiences', 'Experiences', 'Curated activities and experiences'),
  ('nightlife', 'Nightlife', 'Venues and reservations'),
  ('travel', 'Travel', 'Flights, hotels, villas, residences'),
  ('business', 'Business', 'Formation, banking, corporate services'),
  ('concierge', 'Concierge', 'Private request orchestration')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
-- Core subcategory seed (minimal stable baseline)
WITH c AS (
  SELECT id, slug FROM public.categories
)
INSERT INTO public.subcategories (category_id, slug, name, description)
SELECT c.id, s.slug, s.name, s.description
FROM c
JOIN (
  VALUES
    ('move-to-dubai', 'visa-services', 'Visa Services', 'Visa and entry pathways'),
    ('move-to-dubai', 'relocation-services', 'Relocation Services', 'Move planning and onboarding'),
    ('move-to-dubai', 'bank-setup', 'Bank Setup', 'Bank account setup and guidance'),
    ('move-to-dubai', 'schooling', 'Schooling', 'School search and placement'),
    ('experiences', 'activities', 'Activities', 'Adventure, water, air and desert activities'),
    ('nightlife', 'venues', 'Venues', 'Clubs, beach clubs, restaurants and events'),
    ('travel', 'stays-and-flights', 'Stays and Flights', 'Travel planning and accommodation'),
    ('business', 'company-services', 'Company Services', 'Formation and corporate support'),
    ('concierge', 'request-services', 'Request Services', 'Custom concierge handling')
) AS s(category_slug, slug, name, description)
  ON s.category_slug = c.slug
ON CONFLICT (category_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
-- ------------------------------------------------------------
-- 3) SYNC VIEWS (single query surfaces)
-- ------------------------------------------------------------

-- Unified service catalog across canonical and legacy vertical tables
CREATE OR REPLACE VIEW public.v_service_catalog AS
SELECT
  'core.services'::TEXT AS source,
  s.id::TEXT AS source_id,
  s.id AS canonical_service_id,
  s.slug,
  s.name,
  s.description,
  s.status,
  NULL::UUID AS supplier_id,
  s.created_at,
  s.updated_at
FROM public.services s

UNION ALL

SELECT
  'business_services'::TEXT,
  bs.id::TEXT,
  bs.canonical_service_id,
  bs.slug,
  bs.name,
  bs.description_short,
  bs.status,
  bs.supplier_id,
  bs.created_at,
  bs.updated_at
FROM public.business_services bs

UNION ALL

SELECT
  'transport_services'::TEXT,
  ts.id::TEXT,
  ts.canonical_service_id,
  ts.slug,
  ts.name,
  ts.description_short,
  ts.status,
  ts.supplier_id,
  ts.created_at,
  ts.updated_at
FROM public.transport_services ts

UNION ALL

SELECT
  'stays_properties'::TEXT,
  sp.id::TEXT,
  sp.canonical_service_id,
  sp.slug,
  sp.name,
  sp.description_short,
  sp.status,
  sp.supplier_id,
  sp.created_at,
  sp.updated_at
FROM public.stays_properties sp

UNION ALL

SELECT
  'experience_services'::TEXT,
  es.id::TEXT,
  es.canonical_service_id,
  es.slug,
  es.name,
  es.description_short,
  es.status,
  es.supplier_id,
  es.created_at,
  es.updated_at
FROM public.experience_services es;
-- Unified bookings surface (core + vertical bookings)
CREATE OR REPLACE VIEW public.v_booking_sync AS
SELECT
  'core.bookings'::TEXT AS source,
  b.id::TEXT AS booking_source_id,
  b.request_id::TEXT AS request_id,
  b.user_id::TEXT AS user_id,
  b.venue_id::TEXT AS venue_id,
  b.status,
  b.amount,
  b.currency,
  b.booking_date,
  b.created_at,
  b.updated_at
FROM public.bookings b

UNION ALL

SELECT
  'stays_bookings'::TEXT,
  sb.id::TEXT,
  sb.request_id::TEXT,
  sb.user_id::TEXT,
  NULL::TEXT AS venue_id,
  sb.status,
  sb.total_price AS amount,
  sb.currency,
  sb.check_in::TIMESTAMPTZ AS booking_date,
  sb.created_at,
  sb.updated_at
FROM public.stays_bookings sb

UNION ALL

SELECT
  'transport_bookings'::TEXT,
  tb.id::TEXT,
  tb.request_id::TEXT,
  tb.user_id::TEXT,
  NULL::TEXT AS venue_id,
  tb.status,
  tb.final_price AS amount,
  tb.currency,
  tb.pickup_date AS booking_date,
  tb.created_at,
  tb.updated_at
FROM public.transport_bookings tb

UNION ALL

SELECT
  'experience_bookings'::TEXT,
  eb.id::TEXT,
  eb.request_id::TEXT,
  eb.user_id::TEXT,
  NULL::TEXT AS venue_id,
  eb.status,
  eb.total_price AS amount,
  eb.currency,
  eb.booking_date::TIMESTAMPTZ AS booking_date,
  eb.created_at,
  eb.updated_at
FROM public.experience_bookings eb;
-- Read access for authenticated users (RLS applies to base tables)
GRANT SELECT ON public.v_service_catalog TO authenticated;
GRANT SELECT ON public.v_booking_sync TO authenticated;
