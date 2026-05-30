-- Patch missing bookings columns needed by the DALC hotel booking flow.
ALTER TABLE IF EXISTS public.bookings
  ADD COLUMN IF NOT EXISTS booking_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS booking_type TEXT,
  ADD COLUMN IF NOT EXISTS hotel_name TEXT,
  ADD COLUMN IF NOT EXISTS room_type TEXT,
  ADD COLUMN IF NOT EXISTS check_in DATE,
  ADD COLUMN IF NOT EXISTS check_out DATE,
  ADD COLUMN IF NOT EXISTS guests INTEGER,
  ADD COLUMN IF NOT EXISTS total_price NUMERIC,
  ADD COLUMN IF NOT EXISTS guest_first_name TEXT,
  ADD COLUMN IF NOT EXISTS guest_last_name TEXT,
  ADD COLUMN IF NOT EXISTS guest_email TEXT,
  ADD COLUMN IF NOT EXISTS guest_phone TEXT,
  ADD COLUMN IF NOT EXISTS special_requests TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i'
      AND c.relname = 'idx_bookings_booking_id'
      AND n.nspname = 'public'
  ) THEN
    EXECUTE 'CREATE INDEX idx_bookings_booking_id ON public.bookings(booking_id)';
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i'
      AND c.relname = 'idx_bookings_status'
      AND n.nspname = 'public'
  ) THEN
    EXECUTE 'CREATE INDEX idx_bookings_status ON public.bookings(status)';
  END IF;
END$$;
