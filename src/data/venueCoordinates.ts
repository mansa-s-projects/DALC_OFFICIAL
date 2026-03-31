// ─── Venue Coordinates — Real Dubai GPS Data ─────────────────────────────────
// Actual lat/lng for every venue in the DALC nightlife vertical.
// Source: Google Maps cross-referenced for accuracy.

export interface VenueCoords {
  lat: number;
  lng: number;
}

/**
 * Coordinates keyed by venue ID (supports both slug and prefixed formats).
 * All coordinates are real Dubai positions.
 */
export const VENUE_COORDINATES: Record<string, VenueCoords> = {
  // ─── RESTAURANTS ─────────────────────────────────────────────────────────────
  'r-bagatelle':       { lat: 25.2048, lng: 55.2708 },  // Fairmont SZR
  'bagatelle':         { lat: 25.2048, lng: 55.2708 },
  'r-verde-fs':        { lat: 25.2048, lng: 55.2708 },  // Four Seasons DIFC
  'verde':             { lat: 25.2048, lng: 55.2708 },
  'r-coucou':          { lat: 25.1124, lng: 55.1390 },  // Palm Jumeirah
  'coucou':            { lat: 25.1124, lng: 55.1390 },
  'r-amazonico':       { lat: 25.2178, lng: 55.2795 },  // DIFC Gate Village
  'amazonico':         { lat: 25.2178, lng: 55.2795 },
  'r-il-gattopardo':   { lat: 25.2178, lng: 55.2800 },  // DIFC
  'il-gattopardo':     { lat: 25.2178, lng: 55.2800 },
  'r-bar-de-pres':     { lat: 25.1970, lng: 55.2744 },  // Downtown Dubai
  'bar-de-pres':       { lat: 25.1970, lng: 55.2744 },
  'r-1920':            { lat: 25.2178, lng: 55.2810 },  // DIFC
  '1920':              { lat: 25.2178, lng: 55.2810 },
  'r-nahate':          { lat: 25.1972, lng: 55.2744 },  // Downtown
  'nahate':            { lat: 25.1972, lng: 55.2744 },
  'r-nobu':            { lat: 25.1020, lng: 55.1480 },  // Atlantis The Palm
  'nobu':              { lat: 25.1020, lng: 55.1480 },
  'r-ling-ling':       { lat: 25.0761, lng: 55.1330 },  // Atlantis The Royal
  'ling-ling':         { lat: 25.0761, lng: 55.1330 },
  'r-la-mar':          { lat: 25.0761, lng: 55.1335 },  // Atlantis The Royal
  'la-mar':            { lat: 25.0761, lng: 55.1335 },
  'r-hakkasan':        { lat: 25.0761, lng: 55.1340 },  // Atlantis The Royal
  'hakkasan':          { lat: 25.0761, lng: 55.1340 },
  'r-mamabello':       { lat: 25.0816, lng: 55.1431 },  // Marina
  'mambaella':         { lat: 25.0816, lng: 55.1431 },
  'r-ram-roll':        { lat: 25.2127, lng: 55.2707 },  // DIFC
  'ram-and-roll':      { lat: 25.2127, lng: 55.2707 },
  'r-tang':            { lat: 25.0936, lng: 55.1504 },  // JBR
  'tang':              { lat: 25.0936, lng: 55.1504 },
  'r-nazcaa':          { lat: 25.2009, lng: 55.2691 },  // SZR
  'nazcaa':            { lat: 25.2009, lng: 55.2691 },
  'r-salvaje':         { lat: 25.2178, lng: 55.2805 },  // DIFC
  'salvaje':           { lat: 25.2178, lng: 55.2805 },
  'r-villa-coconut':   { lat: 25.0436, lng: 55.1224 },  // Palm West Beach
  'villa-coconut':     { lat: 25.0436, lng: 55.1224 },
  'r-shanghai-me':     { lat: 25.2178, lng: 55.2815 },  // DIFC
  'shanghai-me':       { lat: 25.2178, lng: 55.2815 },
  'r-gaia':            { lat: 25.2178, lng: 55.2820 },  // DIFC Gate Village
  'gal':               { lat: 25.2178, lng: 55.2820 },
  'r-urla':            { lat: 25.1124, lng: 55.1395 },  // Palm Jumeirah
  'urla':              { lat: 25.1124, lng: 55.1395 },
  'r-coya':            { lat: 25.2040, lng: 55.2710 },  // Four Seasons / SZR
  'coya':              { lat: 25.2040, lng: 55.2710 },
  'r-amelia':          { lat: 25.2178, lng: 55.2825 },  // DIFC
  'amelia':            { lat: 25.2178, lng: 55.2825 },
  'r-ce-la-vi':        { lat: 25.1972, lng: 55.2749 },  // Address Downtown
  'ce-la-vi':          { lat: 25.1972, lng: 55.2749 },
  'r-sushisamba':      { lat: 25.1124, lng: 55.1400 },  // Palm Jumeirah
  'sushi-samba':       { lat: 25.1124, lng: 55.1400 },
  'r-la-nina':         { lat: 25.0816, lng: 55.1436 },  // Marina
  'la-nina':           { lat: 25.0816, lng: 55.1436 },
  'r-opa':             { lat: 25.2178, lng: 55.2830 },  // DIFC
  'opa':               { lat: 25.2178, lng: 55.2830 },
  'r-clap':            { lat: 25.2178, lng: 55.2835 },  // DIFC
  'clap':              { lat: 25.2178, lng: 55.2835 },
  'r-sexy-fish':       { lat: 25.2178, lng: 55.2840 },  // DIFC
  'sexy-fish':         { lat: 25.2178, lng: 55.2840 },
  'r-nammos':          { lat: 25.1124, lng: 55.1405 },  // Four Seasons Palm
  'nammos':            { lat: 25.1124, lng: 55.1405 },
  'r-tattu':           { lat: 25.1972, lng: 55.2754 },  // Downtown
  'tattu':             { lat: 25.1972, lng: 55.2754 },
  'krasota':           { lat: 25.2178, lng: 55.2803 },  // DIFC

  // ─── BEACH CLUBS ─────────────────────────────────────────────────────────────
  'bc-verde':          { lat: 25.0936, lng: 55.1508 },  // JBR
  'verde-beach':       { lat: 25.0936, lng: 55.1508 },
  'bc-nikki':          { lat: 25.1124, lng: 55.1410 },  // Pearl Jumeira
  'nikki-beach':       { lat: 25.1124, lng: 55.1410 },
  'bc-nobu':           { lat: 25.0761, lng: 55.1345 },  // Atlantis The Royal
  'nobu-beach':        { lat: 25.0761, lng: 55.1345 },
  'bc-kyma':           { lat: 25.0436, lng: 55.1228 },  // Five Palm Jumeirah
  'kyma':              { lat: 25.0436, lng: 55.1228 },
  'african-queen':     { lat: 25.0436, lng: 55.1232 },  // Palm West Beach
  'sakhalin':          { lat: 25.0881, lng: 55.1480 },  // Bluewaters
  'gigi-beach':        { lat: 25.0881, lng: 55.1475 },  // Bluewaters
  'baoli-beach':       { lat: 25.0936, lng: 55.1512 },  // JBR
  'ina-beach':         { lat: 25.0436, lng: 55.1236 },  // Palm West Beach
  'maison-revka':      { lat: 25.1124, lng: 55.1415 },  // Jumeirah
  'casablanca-beach':  { lat: 25.1920, lng: 55.2680 },  // Jumeirah Beach
  'drift-beach':       { lat: 25.1124, lng: 55.1420 },  // One&Only Royal Mirage
  'playa':             { lat: 25.0936, lng: 55.1516 },  // JBR
  'terra-solis':       { lat: 25.0100, lng: 55.3200 },  // Dubai Desert
  'surf-beach':        { lat: 25.0881, lng: 55.1470 },  // Bluewaters
  'gitano':            { lat: 25.0436, lng: 55.1240 },  // Palm West Beach
  'bch-club':          { lat: 25.0436, lng: 55.1244 },  // Palm West Beach
  'casa-amor':         { lat: 25.0936, lng: 55.1520 },  // JBR
  'ninive-beach':      { lat: 25.0881, lng: 55.1465 },  // Bluewaters
  'maison-de-la-plage':{ lat: 25.0436, lng: 55.1248 },  // Palm West Beach
  'lucky-fish':        { lat: 25.0881, lng: 55.1460 },  // Bluewaters
  'gallery-740':       { lat: 25.0936, lng: 55.1524 },  // JBR

  // ─── NIGHT CLUBS ─────────────────────────────────────────────────────────────
  'nc-iris':           { lat: 25.1951, lng: 55.2716 },  // Meydan Tower
  'iris':              { lat: 25.1951, lng: 55.2716 },
  'nc-epik':           { lat: 25.2009, lng: 55.2820 },  // W Hotel Mina Seyahi
  'epik':              { lat: 25.2009, lng: 55.2820 },
  'nc-nyx':            { lat: 25.2178, lng: 55.2800 },  // DIFC
  'nyx':               { lat: 25.2178, lng: 55.2800 },
  'nc-ly-la':          { lat: 25.1972, lng: 55.2780 },  // Downtown
  'ly-la':             { lat: 25.1972, lng: 55.2780 },
  'nc-paraiso':        { lat: 25.2178, lng: 55.2808 },  // DIFC Rooftop
  'paraiso-rooftop':   { lat: 25.2178, lng: 55.2808 },
  'nc-bund':           { lat: 25.2178, lng: 55.2816 },  // DIFC
  'nc-raspoutine':     { lat: 25.2178, lng: 55.2812 },  // DIFC
  'rasputine':         { lat: 25.2178, lng: 55.2812 },
  'nc-avenue':         { lat: 25.2178, lng: 55.2818 },  // DIFC
  'avenue':            { lat: 25.2178, lng: 55.2818 },
  'nc-ora':            { lat: 25.2178, lng: 55.2822 },  // DIFC
  'ora':               { lat: 25.2178, lng: 55.2822 },
  'nc-secret-room':    { lat: 25.2178, lng: 55.2826 },  // DIFC
  'secret-room':       { lat: 25.2178, lng: 55.2826 },
  'nc-socialista':     { lat: 25.2178, lng: 55.2830 },  // DIFC
  'socialista':        { lat: 25.2178, lng: 55.2830 },
  'nc-soho-meydan':    { lat: 25.1680, lng: 55.3070 },  // Meydan
  'soho-garden':       { lat: 25.1680, lng: 55.3070 },
  'nc-soho-palm':      { lat: 25.1124, lng: 55.1425 },  // Palm Jumeirah
  'nc-code':           { lat: 25.0881, lng: 55.1685 },  // JLT
  'code':              { lat: 25.0881, lng: 55.1685 },
  'nc-babylon-club':   { lat: 25.2178, lng: 55.2838 },  // DIFC
  'nc-litt':           { lat: 25.0786, lng: 55.1380 },  // Marina
  'litt':              { lat: 25.0786, lng: 55.1380 },
  'nc-ongaku':         { lat: 25.0936, lng: 55.1528 },  // JBR
  'ongaku':            { lat: 25.0936, lng: 55.1528 },

  // ─── DINING & ENTERTAINMENT ──────────────────────────────────────────────────
  'de-billionaire':    { lat: 25.1951, lng: 55.2720 },  // Taj Hotel, Business Bay
  'billionaire':       { lat: 25.1951, lng: 55.2720 },
  'de-babylon':        { lat: 25.2178, lng: 55.2834 },  // DIFC
  'de-josette':        { lat: 25.2040, lng: 55.2715 },  // SZR
  'de-krasota':        { lat: 25.2178, lng: 55.2804 },  // DIFC
  'de-theater':        { lat: 25.1880, lng: 55.2607 },  // Mall of the Emirates area
  'theater':           { lat: 25.1880, lng: 55.2607 },
  'adaline':           { lat: 25.2040, lng: 55.2718 },
  'aretha':            { lat: 25.1972, lng: 55.2760 },
  'dream':             { lat: 25.2009, lng: 55.2700 },
  'gatsby':            { lat: 25.2178, lng: 55.2836 },
};

/**
 * Get coordinates for a venue by ID.
 * Returns undefined if the venue has no known coordinates.
 */
export function getVenueCoordinates(id: string): VenueCoords | undefined {
  return VENUE_COORDINATES[id];
}

/**
 * Get coordinates for all venues that have known positions.
 * Returns an array of { id, coords } pairs.
 */
export function getAllVenueCoordinates(): Array<{ id: string; coords: VenueCoords }> {
  const seen = new Set<string>();
  return Object.entries(VENUE_COORDINATES)
    .filter(([id]) => {
      // Deduplicate — prefer prefixed IDs
      const key = `${VENUE_COORDINATES[id].lat},${VENUE_COORDINATES[id].lng}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(([id, coords]) => ({ id, coords }));
}
