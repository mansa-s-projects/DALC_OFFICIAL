/**
 * Maps normalized venue name strings to their DALC venue IDs.
 *
 * Keys   — lowercase, diacritic-stripped, punctuation-removed venue names.
 * Values — arrays of DALC IDs (arrays support multi-venue suppliers like Soho Garden).
 *
 * Used by the Admin Bulk Import preview to show which existing venues
 * will be linked when a supplier row is imported.
 */
export const VENUE_ALIAS_MAP: Readonly<Record<string, string[]>> = {
  // ── Night Clubs ────────────────────────────────────────────────────────────
  'soho garden': ['nc-soho-meydan', 'nc-soho-palm'],
  'soho garden meydan': ['nc-soho-meydan'],
  'soho garden palm': ['nc-soho-palm'],
  'code by soho garden': ['nc-code'],
  'code': ['nc-code'],
  'bund lounge by shanghai me': ['nc-bund'],
  'bund lounge': ['nc-bund'],
  'ly la by alaya': ['nc-ly-la'],
  'ly la': ['nc-ly-la'],
  'nyx by gaia': ['nc-nyx'],
  'nyx': ['nc-nyx'],
  'ongaku by clap': ['nc-ongaku'],
  'ongaku': ['nc-ongaku'],
  'paraiso rooftop by amazonico': ['nc-paraiso'],
  'paraiso': ['nc-paraiso'],
  'secret room': ['nc-secret-room'],
  'babylon club': ['nc-babylon-club'],
  'babylon': ['nc-babylon-club'],
  'iris': ['nc-iris'],
  'epik': ['nc-epik'],
  'litt': ['nc-litt'],
  'raspoutine': ['nc-raspoutine'],
  'avenue': ['nc-avenue'],
  'ora': ['nc-ora'],
  'socialista': ['nc-socialista'],

  // ── Beach Clubs ────────────────────────────────────────────────────────────
  'nikki beach': ['bc-nikki'],
  'verde beach': ['bc-verde'],
  'nobu by the beach': ['bc-nobu'],
  'kyma beach': ['bc-kyma'],
  'kyma': ['bc-kyma'],

  // ── Dining Entertainment ───────────────────────────────────────────────────
  'billionaire': ['de-billionaire'],
  'the theater': ['de-theater'],
  'theater': ['de-theater'],
  // krasota appears in Restaurants SEO folder but lives under de- in mockData
  'krasota': ['de-krasota'],

  // ── Restaurants ───────────────────────────────────────────────────────────
  '1920': ['r-1920'],
  'amazonico': ['r-amazonico'],
  'amelia': ['r-amelia'],
  'bagatelle': ['r-bagatelle'],
  'bar des pres': ['r-bar-de-pres'],
  'bar de pres': ['r-bar-de-pres'],
  'ce la vi': ['r-ce-la-vi'],
  'clap': ['r-clap'],
  'coucou': ['r-coucou'],
  'coya': ['r-coya'],
  'gaia': ['r-gaia'],
  'hakkasan': ['r-hakkasan'],
  'il gattopardo': ['r-il-gattopardo'],
  'la mar': ['r-la-mar'],
  'la nina': ['r-la-nina'],
  'ling ling': ['r-ling-ling'],
  'mamabella': ['r-mamabello'],
  'mamabello': ['r-mamabello'],
  'nahate': ['r-nahate'],
  'nammos': ['r-nammos'],
  'nazcaa': ['r-nazcaa'],
  'nobu': ['r-nobu'],
  'opa': ['r-opa'],
  'ram and roll': ['r-ram-roll'],
  'ram roll': ['r-ram-roll'],
  'salvaje': ['r-salvaje'],
  'sexy fish': ['r-sexy-fish'],
  'shanghai me': ['r-shanghai-me'],
  'sushi samba': ['r-sushisamba'],
  'sushisamba': ['r-sushisamba'],
  'tang': ['r-tang'],
  'tattu': ['r-tattu'],
  'urla': ['r-urla'],
  // "Verde" (Restaurants/fine-dining at Four Seasons) maps to r-verde-fs, NOT bc-verde
  'verde': ['r-verde-fs'],
  'villa coconut': ['r-villa-coconut'],
};

/**
 * Look up DALC venue IDs for a raw venue name string.
 * Returns an empty array when there is no known mapping.
 */
export function lookupVenueIds(venueName: string): string[] {
  const key = venueName
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[,.'"\u2018\u2019\u201c\u201d()\-]/g, ' ')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();
  return VENUE_ALIAS_MAP[key] ?? [];
}
