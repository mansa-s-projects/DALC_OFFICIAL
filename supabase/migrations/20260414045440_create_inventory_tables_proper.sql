DO $$
BEGIN
  IF to_regclass('public.venues') IS NULL
    OR to_regclass('public.experience_services') IS NULL
    OR to_regclass('public.transport_items') IS NULL THEN
    RAISE EXCEPTION 'Inventory tables were not created by the preceding migration';
  END IF;
END;
$$;
