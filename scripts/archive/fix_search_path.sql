BEGIN;

ALTER FUNCTION IF EXISTS public.handle_new_user() SET search_path = public;
ALTER FUNCTION IF EXISTS public.update_updated_at() SET search_path = public;
ALTER FUNCTION IF EXISTS public.log_request_status_change() SET search_path = public;
ALTER FUNCTION IF EXISTS public.update_transport_updated_at() SET search_path = public;
ALTER FUNCTION IF EXISTS public.update_stays_updated_at() SET search_path = public;
ALTER FUNCTION IF EXISTS public.update_experiences_updated_at() SET search_path = public;
ALTER FUNCTION IF EXISTS public.generate_experience_ticket_code() SET search_path = public;
ALTER FUNCTION IF EXISTS public.upsert_supplier_by_name(text, text[], text) SET search_path = public;
ALTER FUNCTION IF EXISTS public.is_valid_lead_status_transition(text, text) SET search_path = public;
ALTER FUNCTION IF EXISTS public.enforce_lead_status_transition() SET search_path = public;
ALTER FUNCTION IF EXISTS public.current_app_role() SET search_path = public;
ALTER FUNCTION IF EXISTS public.current_app_team_id() SET search_path = public;
ALTER FUNCTION IF EXISTS public.generate_venue_slug(text, text) SET search_path = public;
ALTER FUNCTION IF EXISTS public.venues_before_insert_slug() SET search_path = public;
ALTER FUNCTION IF EXISTS public.set_updated_at() SET search_path = public;
ALTER FUNCTION IF EXISTS public.handle_updated_at() SET search_path = public;
ALTER FUNCTION IF EXISTS public.update_activities_updated_at() SET search_path = public;
ALTER FUNCTION IF EXISTS public.generate_activity_ticket_code() SET search_path = public;
ALTER FUNCTION IF EXISTS public.set_activity_booking_ticket() SET search_path = public;

CREATE SCHEMA IF NOT EXISTS extensions;

DO $$
DECLARE
  ext record;
BEGIN
  FOR ext IN
    SELECT e.extname
    FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace
    WHERE n.nspname = 'public'
      AND e.extrelocatable = true
  LOOP
    EXECUTE format('ALTER EXTENSION %I SET SCHEMA extensions', ext.extname);
  END LOOP;
END
$$;

COMMIT;
