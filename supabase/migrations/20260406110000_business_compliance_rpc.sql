CREATE OR REPLACE FUNCTION public.update_compliance_item(
  booking_id UUID,
  item_id TEXT,
  item_completed BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_status JSONB := '[]'::jsonb;
  updated_status JSONB := '[]'::jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT b.compliance_status
  INTO current_status
  FROM public.business_bookings b
  WHERE b.id = booking_id
    AND (
      b.user_id = auth.uid()
      OR EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN ('admin', 'concierge')
      )
    )
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Business booking not found or not accessible';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(COALESCE(current_status, '[]'::jsonb)) AS compliance_item
    WHERE compliance_item->>'id' = item_id
  ) THEN
    RAISE EXCEPTION 'Compliance item % was not found on booking %', item_id, booking_id;
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      CASE
        WHEN compliance_item->>'id' = item_id THEN
          jsonb_strip_nulls(
            compliance_item
            || jsonb_build_object(
              'completed', item_completed,
              'completed_at', CASE WHEN item_completed THEN now() ELSE NULL END
            )
          )
        ELSE compliance_item
      END
    ),
    '[]'::jsonb
  )
  INTO updated_status
  FROM jsonb_array_elements(COALESCE(current_status, '[]'::jsonb)) AS compliance_item;

  UPDATE public.business_bookings
  SET compliance_status = updated_status,
      updated_at = now()
  WHERE id = booking_id;

  RETURN updated_status;
END;
$$;
REVOKE ALL ON FUNCTION public.update_compliance_item(UUID, TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_compliance_item(UUID, TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_compliance_item(UUID, TEXT, BOOLEAN) TO service_role;
