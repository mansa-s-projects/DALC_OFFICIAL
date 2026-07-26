ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = pg_catalog, public
AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = pg_catalog, public
AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge');
$$;

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY profiles_update_safe_fields ON public.profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (
  first_name,
  last_name,
  phone,
  avatar_url,
  skills,
  preferences,
  relocation_stage
) ON public.profiles TO authenticated;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_chk;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_chk
  CHECK (
    role IN (
      'user',
      'viewer',
      'sales_agent',
      'sales_manager',
      'concierge',
      'admin'
    )
  ) NOT VALID;

ALTER FUNCTION public.handle_new_user()
  SET search_path = pg_catalog, public;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;

ALTER FUNCTION public.upsert_supplier_by_name(TEXT, TEXT[], TEXT)
  SET search_path = pg_catalog, public;
REVOKE ALL ON FUNCTION public.upsert_supplier_by_name(TEXT, TEXT[], TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.upsert_supplier_by_name(TEXT, TEXT[], TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.upsert_supplier_by_name(TEXT, TEXT[], TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_supplier_by_name(TEXT, TEXT[], TEXT) TO service_role;

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own requests" ON public.requests;
DROP POLICY IF EXISTS "Users can create requests" ON public.requests;
DROP POLICY IF EXISTS "Staff can view all requests" ON public.requests;
DROP POLICY IF EXISTS "Staff can update requests" ON public.requests;
DROP POLICY IF EXISTS requests_select_own_or_staff ON public.requests;
DROP POLICY IF EXISTS requests_insert_guarded ON public.requests;
DROP POLICY IF EXISTS requests_update_guarded ON public.requests;

CREATE POLICY requests_select_own_or_staff ON public.requests
  FOR SELECT USING (
    user_id = auth.uid()
    OR COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  );
CREATE POLICY requests_insert_guarded ON public.requests
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  );
CREATE POLICY requests_update_guarded ON public.requests
  FOR UPDATE
  USING (
    (
      user_id = auth.uid()
      AND status IN ('pending', 'submitted', 'acknowledged')
    )
    OR COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  )
  WITH CHECK (
    (
      user_id = auth.uid()
      AND status IN ('pending', 'submitted', 'acknowledged')
    )
    OR COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  );

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own quotes" ON public.quotes;
CREATE POLICY quotes_select_own_or_staff ON public.quotes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.requests r
      WHERE r.id = request_id AND r.user_id = auth.uid()
    )
    OR COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  );

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY payments_select_own_or_staff ON public.payments
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.requests r
      WHERE r.id = request_id AND r.user_id = auth.uid()
    )
    OR COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  );

CREATE UNIQUE INDEX IF NOT EXISTS ux_payments_stripe_session_id
  ON public.payments(stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS bookings_select_own_or_staff ON public.bookings;
CREATE POLICY bookings_select_own_or_staff ON public.bookings
  FOR SELECT USING (
    user_id = auth.uid()
    OR COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  );
