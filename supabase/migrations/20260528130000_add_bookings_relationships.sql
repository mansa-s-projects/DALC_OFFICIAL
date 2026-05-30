-- Safe production relationship recovery for bookings.
-- These constraints are added NOT VALID to avoid scanning existing data
-- while enforcing referential integrity for new rows.

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) NOT VALID,
  ADD CONSTRAINT bookings_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(id) NOT VALID,
  ADD CONSTRAINT bookings_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) NOT VALID;

-- Once data integrity is verified for new writes, consider validating
-- the constraints with: ALTER TABLE public.bookings VALIDATE CONSTRAINT <constraint_name>;
