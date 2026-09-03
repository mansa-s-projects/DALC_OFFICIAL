DO $$
BEGIN
  IF to_regclass('public.activities') IS NULL
    OR to_regclass('public.activity_bookings') IS NULL THEN
    RAISE EXCEPTION 'Activity tables were not created by the canonical activity migration';
  END IF;
END;
$$;
