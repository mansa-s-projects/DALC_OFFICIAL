-- Migration: suppliers_002_bulk_import
-- Adds a case-insensitive unique index on suppliers.name to support safe
-- bulk upsert-by-name operations from the Admin Bulk Import pipeline.

-- Case-insensitive unique index so ilike-based upserts are deterministic
CREATE UNIQUE INDEX IF NOT EXISTS idx_suppliers_name_ci
  ON suppliers (LOWER(name));

-- Optional helper function: upsert a single supplier row by name.
-- The platform layer uses this via .ilike() + branching, but keeping a
-- DB-side function here gives a single-round-trip alternative if needed later.
CREATE OR REPLACE FUNCTION upsert_supplier_by_name(
  p_name        TEXT,
  p_categories  TEXT[],
  p_notes       TEXT DEFAULT NULL
)
RETURNS TABLE (id UUID, was_created BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id       UUID;
  v_created  BOOLEAN := FALSE;
BEGIN
  SELECT s.id INTO v_id
  FROM suppliers s
  WHERE LOWER(s.name) = LOWER(p_name);

  IF v_id IS NULL THEN
    INSERT INTO suppliers (name, categories, commission_rate, status, notes)
    VALUES (p_name, p_categories, 0, 'pending', p_notes)
    RETURNING id INTO v_id;
    v_created := TRUE;
  ELSE
    UPDATE suppliers
    SET categories = ARRAY(
      SELECT DISTINCT UNNEST(categories || p_categories)
    )
    WHERE id = v_id;
  END IF;

  RETURN QUERY SELECT v_id, v_created;
END;
$$;
