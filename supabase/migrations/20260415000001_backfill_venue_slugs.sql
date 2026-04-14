-- ============================================================
-- Migration: backfill_venue_slugs
-- Seeds slug and emirate_id for the 90 venues defined in
-- src/lib/venueSlugMap.ts. Safe to run multiple times (uses
-- WHERE slug IS NULL so existing slugs are never overwritten).
-- ============================================================

DO $$
DECLARE
  dubai_id UUID;
BEGIN
  SELECT id INTO dubai_id FROM public.emirates WHERE slug = 'dubai';
  IF dubai_id IS NULL THEN
    RAISE EXCEPTION 'emirates row for slug=dubai not found — run 20260409110001_emirates.sql first';
  END IF;

  -- ── Restaurants ──────────────────────────────────────────
  UPDATE public.venues SET slug = 'bagatelle',          emirate_id = dubai_id WHERE id = 'bagatelle'           AND slug IS NULL;
  UPDATE public.venues SET slug = 'verde',               emirate_id = dubai_id WHERE id = 'verde'               AND slug IS NULL;
  UPDATE public.venues SET slug = 'coucou',              emirate_id = dubai_id WHERE id = 'coucou'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'amazonico',           emirate_id = dubai_id WHERE id = 'amazonico'           AND slug IS NULL;
  UPDATE public.venues SET slug = 'il-gattopardo',       emirate_id = dubai_id WHERE id = 'il-gattopardo'       AND slug IS NULL;
  UPDATE public.venues SET slug = 'bar-de-pres',         emirate_id = dubai_id WHERE id = 'bar-de-pres'         AND slug IS NULL;
  UPDATE public.venues SET slug = '1920',                emirate_id = dubai_id WHERE id = '1920'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'nahate',              emirate_id = dubai_id WHERE id = 'nahate'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'nobu',                emirate_id = dubai_id WHERE id = 'nobu'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'ling-ling',           emirate_id = dubai_id WHERE id = 'ling-ling'           AND slug IS NULL;
  UPDATE public.venues SET slug = 'la-mar',              emirate_id = dubai_id WHERE id = 'la-mar'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'hakkasan',            emirate_id = dubai_id WHERE id = 'hakkasan'            AND slug IS NULL;
  UPDATE public.venues SET slug = 'mambaella',           emirate_id = dubai_id WHERE id = 'mambaella'           AND slug IS NULL;
  UPDATE public.venues SET slug = 'woohoo',              emirate_id = dubai_id WHERE id = 'woohoo'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'ram-and-roll',        emirate_id = dubai_id WHERE id = 'ram-and-roll'        AND slug IS NULL;
  UPDATE public.venues SET slug = 'tang',                emirate_id = dubai_id WHERE id = 'tang'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'nazcaa',              emirate_id = dubai_id WHERE id = 'nazcaa'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'krasota',             emirate_id = dubai_id WHERE id = 'krasota'             AND slug IS NULL;
  UPDATE public.venues SET slug = 'salvaje',             emirate_id = dubai_id WHERE id = 'salvaje'             AND slug IS NULL;
  UPDATE public.venues SET slug = 'villa-coconut',       emirate_id = dubai_id WHERE id = 'villa-coconut'       AND slug IS NULL;
  UPDATE public.venues SET slug = 'shanghai-me',         emirate_id = dubai_id WHERE id = 'shanghai-me'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'gal',                 emirate_id = dubai_id WHERE id = 'gal'                 AND slug IS NULL;
  UPDATE public.venues SET slug = 'urla',                emirate_id = dubai_id WHERE id = 'urla'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'coya',                emirate_id = dubai_id WHERE id = 'coya'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'amelia',              emirate_id = dubai_id WHERE id = 'amelia'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'ce-la-vi',            emirate_id = dubai_id WHERE id = 'ce-la-vi'            AND slug IS NULL;
  UPDATE public.venues SET slug = 'sushi-samba',         emirate_id = dubai_id WHERE id = 'sushi-samba'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'la-nina',             emirate_id = dubai_id WHERE id = 'la-nina'             AND slug IS NULL;
  UPDATE public.venues SET slug = 'opa',                 emirate_id = dubai_id WHERE id = 'opa'                 AND slug IS NULL;
  UPDATE public.venues SET slug = 'clap',                emirate_id = dubai_id WHERE id = 'clap'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'sexy-fish',           emirate_id = dubai_id WHERE id = 'sexy-fish'           AND slug IS NULL;
  UPDATE public.venues SET slug = 'nammos',              emirate_id = dubai_id WHERE id = 'nammos'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'jumeirah',            emirate_id = dubai_id WHERE id = 'jumeirah'            AND slug IS NULL;
  UPDATE public.venues SET slug = 'tattu',               emirate_id = dubai_id WHERE id = 'tattu'               AND slug IS NULL;

  -- ── Beach Clubs ──────────────────────────────────────────
  UPDATE public.venues SET slug = 'verde-beach',         emirate_id = dubai_id WHERE id = 'verde-beach'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'african-queen',       emirate_id = dubai_id WHERE id = 'african-queen'       AND slug IS NULL;
  UPDATE public.venues SET slug = 'sakhalin',            emirate_id = dubai_id WHERE id = 'sakhalin'            AND slug IS NULL;
  UPDATE public.venues SET slug = 'gigi-beach',          emirate_id = dubai_id WHERE id = 'gigi-beach'          AND slug IS NULL;
  UPDATE public.venues SET slug = 'baoli-beach',         emirate_id = dubai_id WHERE id = 'baoli-beach'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'ina-beach',           emirate_id = dubai_id WHERE id = 'ina-beach'           AND slug IS NULL;
  UPDATE public.venues SET slug = 'maison-revka',        emirate_id = dubai_id WHERE id = 'maison-revka'        AND slug IS NULL;
  UPDATE public.venues SET slug = 'nikki-beach',         emirate_id = dubai_id WHERE id = 'nikki-beach'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'nobu-beach',          emirate_id = dubai_id WHERE id = 'nobu-beach'          AND slug IS NULL;
  UPDATE public.venues SET slug = 'casablanca-beach',    emirate_id = dubai_id WHERE id = 'casablanca-beach'    AND slug IS NULL;
  UPDATE public.venues SET slug = 'drift-beach',         emirate_id = dubai_id WHERE id = 'drift-beach'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'playa',               emirate_id = dubai_id WHERE id = 'playa'               AND slug IS NULL;
  UPDATE public.venues SET slug = 'terra-solis',         emirate_id = dubai_id WHERE id = 'terra-solis'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'surf-beach',          emirate_id = dubai_id WHERE id = 'surf-beach'          AND slug IS NULL;
  UPDATE public.venues SET slug = 'gitano',              emirate_id = dubai_id WHERE id = 'gitano'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'bch-club',            emirate_id = dubai_id WHERE id = 'bch-club'            AND slug IS NULL;
  UPDATE public.venues SET slug = 'kyma',                emirate_id = dubai_id WHERE id = 'kyma'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'casa-amor',           emirate_id = dubai_id WHERE id = 'casa-amor'           AND slug IS NULL;
  UPDATE public.venues SET slug = 'ninive-beach',        emirate_id = dubai_id WHERE id = 'ninive-beach'        AND slug IS NULL;
  UPDATE public.venues SET slug = 'maison-de-la-plage',  emirate_id = dubai_id WHERE id = 'maison-de-la-plage'  AND slug IS NULL;
  UPDATE public.venues SET slug = 'lucky-fish',          emirate_id = dubai_id WHERE id = 'lucky-fish'          AND slug IS NULL;
  UPDATE public.venues SET slug = 'gallery-740',         emirate_id = dubai_id WHERE id = 'gallery-740'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'o-beach',             emirate_id = dubai_id WHERE id = 'o-beach'             AND slug IS NULL;
  UPDATE public.venues SET slug = 'zetta-pool',          emirate_id = dubai_id WHERE id = 'zetta-pool'          AND slug IS NULL;

  -- ── Night Clubs ──────────────────────────────────────────
  UPDATE public.venues SET slug = 'iris',                emirate_id = dubai_id WHERE id = 'iris'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'epik',                emirate_id = dubai_id WHERE id = 'epik'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'nyx',                 emirate_id = dubai_id WHERE id = 'nyx'                 AND slug IS NULL;
  UPDATE public.venues SET slug = 'ly-la',               emirate_id = dubai_id WHERE id = 'ly-la'               AND slug IS NULL;
  UPDATE public.venues SET slug = 'paraiso-rooftop',     emirate_id = dubai_id WHERE id = 'paraiso-rooftop'     AND slug IS NULL;
  UPDATE public.venues SET slug = 'blume-lounge',        emirate_id = dubai_id WHERE id = 'blume-lounge'        AND slug IS NULL;
  UPDATE public.venues SET slug = 'shanghai-me-nc',      emirate_id = dubai_id WHERE id = 'shanghai-me-nc'      AND slug IS NULL;
  UPDATE public.venues SET slug = 'rasputine',           emirate_id = dubai_id WHERE id = 'rasputine'           AND slug IS NULL;
  UPDATE public.venues SET slug = 'avenue',              emirate_id = dubai_id WHERE id = 'avenue'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'ora',                 emirate_id = dubai_id WHERE id = 'ora'                 AND slug IS NULL;
  UPDATE public.venues SET slug = 'secret-room',         emirate_id = dubai_id WHERE id = 'secret-room'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'socialista',          emirate_id = dubai_id WHERE id = 'socialista'          AND slug IS NULL;
  UPDATE public.venues SET slug = 'soho-garden',         emirate_id = dubai_id WHERE id = 'soho-garden'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'code',                emirate_id = dubai_id WHERE id = 'code'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'babylon-nc',          emirate_id = dubai_id WHERE id = 'babylon-nc'          AND slug IS NULL;
  UPDATE public.venues SET slug = 'litt',                emirate_id = dubai_id WHERE id = 'litt'                AND slug IS NULL;
  UPDATE public.venues SET slug = 'ongaku',              emirate_id = dubai_id WHERE id = 'ongaku'              AND slug IS NULL;

  -- ── Dining & Entertainment ───────────────────────────────
  UPDATE public.venues SET slug = 'adaline',             emirate_id = dubai_id WHERE id = 'adaline'             AND slug IS NULL;
  UPDATE public.venues SET slug = 'aretha',              emirate_id = dubai_id WHERE id = 'aretha'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'dream',               emirate_id = dubai_id WHERE id = 'dream'               AND slug IS NULL;
  UPDATE public.venues SET slug = 'gatsby',              emirate_id = dubai_id WHERE id = 'gatsby'              AND slug IS NULL;
  UPDATE public.venues SET slug = 'theater',             emirate_id = dubai_id WHERE id = 'theater'             AND slug IS NULL;
  UPDATE public.venues SET slug = 'billionaire',         emirate_id = dubai_id WHERE id = 'billionaire'         AND slug IS NULL;
  UPDATE public.venues SET slug = 'babylon-de',          emirate_id = dubai_id WHERE id = 'babylon-de'          AND slug IS NULL;

  -- ── Experiences ──────────────────────────────────────────
  UPDATE public.venues SET slug = 'exp-platinum',        emirate_id = dubai_id WHERE id = 'exp-platinum'        AND slug IS NULL;
  UPDATE public.venues SET slug = 'exp-skydive',         emirate_id = dubai_id WHERE id = 'exp-skydive'         AND slug IS NULL;

  -- ── Backfill canonical_url for all venues that now have slug + emirate ──
  UPDATE public.venues AS v
  SET canonical_url = '/explore/' || e.slug || '/' ||
                      COALESCE(vc.slug, v.category) || '/' || v.slug
  FROM public.emirates e
  LEFT JOIN public.venue_categories vc ON vc.slug = v.category_slug
  WHERE v.emirate_id = e.id
    AND v.slug IS NOT NULL
    AND v.canonical_url IS NULL;

END;
$$;
