// ─── Venue Images — Dubai À La Carte ──────────────────────────────────────────
// Real venue imagery from /public/images — organized by category

// ─── Image Path Builder ───────────────────────────────────────────────────────

export type VenueImageSet = {
  hero: string;
  gallery: string;
  menu: string;
  blogPath: string;
};

function bc(folder: string): VenueImageSet {
  return {
    hero: `/images/beach_clubs/${folder}/image1.jpg`,
    gallery: `/images/beach_clubs/${folder}/image2.jpg`,
    menu: `/images/beach_clubs/${folder}/menu.jpg`,
    blogPath: `/images/beach_clubs/${folder}/blog.html`,
  };
}

function nc(folder: string): VenueImageSet {
  return {
    hero: `/images/nightclubs/${folder}/image1.jpg`,
    gallery: `/images/nightclubs/${folder}/image2.jpg`,
    menu: `/images/nightclubs/${folder}/menu.jpg`,
    blogPath: `/images/nightclubs/${folder}/blog.html`,
  };
}

function rs(folder: string): VenueImageSet {
  return {
    hero: `/images/restaurants/${folder}/image1.jpg`,
    gallery: `/images/restaurants/${folder}/image2.jpg`,
    menu: `/images/restaurants/${folder}/menu.jpg`,
    blogPath: `/images/restaurants/${folder}/blog.html`,
  };
}

function de(folder: string): VenueImageSet {
  return {
    hero: `/images/dining_entertainment/${folder}/image1.jpg`,
    gallery: `/images/dining_entertainment/${folder}/image2.jpg`,
    menu: `/images/dining_entertainment/${folder}/menu.jpg`,
    blogPath: `/images/dining_entertainment/${folder}/blog.html`,
  };
}

// ─── Name-based lookup (handles all ID formats) ───────────────────────────────

const NAME_TO_IMAGE_SET: Record<string, VenueImageSet> = {
  // ─── RESTAURANTS ─────────────────────────────────────────────────────────────
  'bagatelle':     rs('Bagatelle'),
  'verde':         rs('Bagatelle'), // Verde folder has .txt not .jpg — temporary fallback
  'coucou':        rs('CouCou'),
  'amazonico':     rs('Amazonico'),
  'il gattopardo': rs('Il_Gattopardo'),
  'bar des pres':  rs('Bar_de_Pres'),
  'bar de pres':   rs('Bar_de_Pres'),
  '1920':          rs('1920'),
  'nahate':        rs('Nahate'),
  'nobu':          rs('Nobu'),
  'ling ling':     rs('Ling_Ling'),
  'la mar':        rs('La_Mar'),
  'hakkasan':      rs('Hakkasan'),
  'mamabello':     rs('Mambaella'),
  'mambaella':     rs('Mambaella'),
  'woohoo':        rs('Woohoo'),
  'ram & roll':    rs('Ram___Roll'),
  'ram and roll':  rs('Ram___Roll'),
  'tang':          rs('Tang'),
  'nazcaa':        rs('Nazcaa'),
  'krasota':       rs('Krasota'),
  'salvaje':       rs('Salvaje'),
  'villa coconut': rs('Villa_Coconut'),
  'shanghai me':   rs('Shanghai_Me'),
  'gal':           rs('Gal'),
  'gaia':          rs('Gal'),
  'urla':          rs('Urla'),
  'coya':          rs('Coya'),
  'amelia':        rs('Amelia'),
  'ce la vi':      rs('Ce_La_Vi'),
  'sushisamba':    rs('Sushi_Samba'),
  'sushi samba':   rs('Sushi_Samba'),
  'la nina':       rs('La_Ni_a'),
  'opa':           rs('Opa'),
  'clap':          rs('Clap'),
  'sexy fish':     rs('Sexy_Fish'),
  'nammos':        rs('Nammos'),
  'jumeirah':      rs('Jumeirah'),
  'tattu':         rs('Tattu'),

  // ─── BEACH CLUBS ─────────────────────────────────────────────────────────────
  'verde beach':       bc('Verde_Beach'),
  'african queen':     bc('African_Queen'),
  'sakhalin':          bc('Sakhalin'),
  'gigi':              bc('Gigi'),
  'baoli':             bc('Baoli'),
  'ina':               bc('Ina'),
  'maison revka':      bc('Maison_Revka'),
  'nikki beach':       bc('Nikki_Beach'),
  'nobu by the beach': bc('Nobu_by_the_beach'),
  'casablanca beach':  bc('CasaBlanca_Beach'),
  'drift beach':       bc('Drift_Beach'),
  'playa':             bc('Playa'),
  'terra solis':       bc('Terra_Solis'),
  'surf':              bc('Surf'),
  'gitano':            bc('Gitano'),
  'bch':               bc('BCH'),
  'kyma':              bc('Kyma'),
  'kyma beach':        bc('Kyma'),
  'casa amor':         bc('Casa_Amor'),
  'ninive beach':      bc('Ninive_Beach'),
  'maison de la plage':bc('Maison_De_La_Plage'),
  'lucky fish':        bc('Lucky_Fish'),
  'gallery 7/40':      bc('Gallery_7_40'),
  'aura skypool':      bc('Nikki_Beach'), // fallback

  // ─── NIGHT CLUBS ─────────────────────────────────────────────────────────────
  'iris':            nc('Iris'),
  'epik':            nc('Epik'),
  'nyx':             nc('Nyx'),
  'ly-la':           nc('Ly-La'),
  'paraiso':         nc('Paraiso_Rooftop'),
  'paraiso rooftop': nc('Paraiso_Rooftop'),
  'blume lounge':    nc('Blume_Lounge'),
  'bund lounge':     nc('Shanghai_Me'),
  'raspoutine':      nc('Rasputine'),
  'rasputine':       nc('Rasputine'),
  'avenue':          nc('Avenue'),
  'ora':             nc('Ora'),
  'secret room':     nc('Secret_Room'),
  'socialista':      nc('Socialista'),
  'soho garden':     nc('Soho_Garden'),
  'soho garden meydan': nc('Soho_Garden'),
  'soho garden palm': nc('Palm_Jumeirah'),
  'code':            nc('Code'),
  'babylon club':    nc('Babylon'),
  'litt':            nc('Litt'),
  'ongaku':          nc('Ongaku'),

  // ─── DINING & ENTERTAINMENT ──────────────────────────────────────────────────
  'adaline':      de('Adaline'),
  'aretha':       de('Aretha'),
  'dream':        de('Dream'),
  'gatsby':       de('Gatsby'),
  'the theater':  de('Theater'),
  'theater':      de('Theater'),
  'billionaire':  de('Billionaire'),
  'babylon':      de('Babylon'),
  'josette':      de('Adaline'), // fallback to Adaline if no Josette folder
};

// ─── Core Lookup Function ─────────────────────────────────────────────────────

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[,.'"\u2018\u2019\u201c\u201d()\-_]/g, ' ')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get the full image set for a venue by its name.
 * This is the primary lookup — works regardless of ID format.
 */
export function getImageSetByName(name: string): VenueImageSet | undefined {
  const normalized = normalizeName(name);
  return NAME_TO_IMAGE_SET[normalized];
}

// ─── ID-based lookup (maps both old IDs and new IDs) ──────────────────────────

const ID_TO_IMAGE_SET: Record<string, VenueImageSet> = {
  // venuesData.ts IDs (slug-style)
  'bagatelle':     rs('Bagatelle'),
  'verde':         rs('Bagatelle'),
  'coucou':        rs('CouCou'),
  'amazonico':     rs('Amazonico'),
  'il-gattopardo': rs('Il_Gattopardo'),
  'bar-de-pres':   rs('Bar_de_Pres'),
  '1920':          rs('1920'),
  'nahate':        rs('Nahate'),
  'nobu':          rs('Nobu'),
  'ling-ling':     rs('Ling_Ling'),
  'la-mar':        rs('La_Mar'),
  'hakkasan':      rs('Hakkasan'),
  'mambaella':     rs('Mambaella'),
  'mamabello':     rs('Mambaella'),
  'woohoo':        rs('Woohoo'),
  'ram-and-roll':  rs('Ram___Roll'),
  'tang':          rs('Tang'),
  'nazcaa':        rs('Nazcaa'),
  'krasota':       rs('Krasota'),
  'salvaje':       rs('Salvaje'),
  'villa-coconut': rs('Villa_Coconut'),
  'shanghai-me':   rs('Shanghai_Me'),
  'gal':           rs('Gal'),
  'gaia':          rs('Gal'),
  'urla':          rs('Urla'),
  'coya':          rs('Coya'),
  'amelia':        rs('Amelia'),
  'ce-la-vi':      rs('Ce_La_Vi'),
  'sushi-samba':   rs('Sushi_Samba'),
  'la-nina':       rs('La_Ni_a'),
  'opa':           rs('Opa'),
  'clap':          rs('Clap'),
  'sexy-fish':     rs('Sexy_Fish'),
  'nammos':        rs('Nammos'),
  'jumeirah':      rs('Jumeirah'),
  'tattu':         rs('Tattu'),
  'verde-beach':       bc('Verde_Beach'),
  'african-queen':     bc('African_Queen'),
  'sakhalin':          bc('Sakhalin'),
  'gigi-beach':        bc('Gigi'),
  'baoli-beach':       bc('Baoli'),
  'ina-beach':         bc('Ina'),
  'maison-revka':      bc('Maison_Revka'),
  'nikki-beach':       bc('Nikki_Beach'),
  'nobu-beach':        bc('Nobu_by_the_beach'),
  'casablanca-beach':  bc('CasaBlanca_Beach'),
  'drift-beach':       bc('Drift_Beach'),
  'playa':             bc('Playa'),
  'terra-solis':       bc('Terra_Solis'),
  'surf-beach':        bc('Surf'),
  'gitano':            bc('Gitano'),
  'bch-club':          bc('BCH'),
  'kyma':              bc('Kyma'),
  'casa-amor':         bc('Casa_Amor'),
  'ninive-beach':      bc('Ninive_Beach'),
  'maison-de-la-plage':bc('Maison_De_La_Plage'),
  'lucky-fish':        bc('Lucky_Fish'),
  'gallery-740':       bc('Gallery_7_40'),
  'iris':            nc('Iris'),
  'epik':            nc('Epik'),
  'nyx':             nc('Nyx'),
  'ly-la':           nc('Ly-La'),
  'paraiso-rooftop': nc('Paraiso_Rooftop'),
  'blume-lounge':    nc('Blume_Lounge'),
  'shanghai-me-nc':  nc('Shanghai_Me'),
  'rasputine':       nc('Rasputine'),
  'avenue':          nc('Avenue'),
  'ora':             nc('Ora'),
  'secret-room':     nc('Secret_Room'),
  'socialista':      nc('Socialista'),
  'soho-garden':     nc('Soho_Garden'),
  'code':            nc('Code'),
  'babylon-nc':      nc('Babylon'),
  'litt':            nc('Litt'),
  'ongaku':          nc('Ongaku'),
  'adaline':      de('Adaline'),
  'aretha':       de('Aretha'),
  'dream':        de('Dream'),
  'gatsby':       de('Gatsby'),
  'theater':      de('Theater'),
  'billionaire':  de('Billionaire'),
  'babylon-de':   de('Babylon'),

  // mockData.ts IDs (prefixed)
  'r-bagatelle':     rs('Bagatelle'),
  'r-verde-fs':      rs('Bagatelle'),
  'r-coucou':        rs('CouCou'),
  'r-amazonico':     rs('Amazonico'),
  'r-il-gattopardo': rs('Il_Gattopardo'),
  'r-bar-de-pres':   rs('Bar_de_Pres'),
  'r-1920':          rs('1920'),
  'r-nahate':        rs('Nahate'),
  'r-nobu':          rs('Nobu'),
  'r-ling-ling':     rs('Ling_Ling'),
  'r-la-mar':        rs('La_Mar'),
  'r-hakkasan':      rs('Hakkasan'),
  'r-mamabello':     rs('Mambaella'),
  'r-ram-roll':      rs('Ram___Roll'),
  'r-tang':          rs('Tang'),
  'r-nazcaa':        rs('Nazcaa'),
  'r-salvaje':       rs('Salvaje'),
  'r-villa-coconut': rs('Villa_Coconut'),
  'r-shanghai-me':   rs('Shanghai_Me'),
  'r-gaia':          rs('Gal'),
  'r-urla':          rs('Urla'),
  'r-coya':          rs('Coya'),
  'r-amelia':        rs('Amelia'),
  'r-ce-la-vi':      rs('Ce_La_Vi'),
  'r-sushisamba':    rs('Sushi_Samba'),
  'r-la-nina':       rs('La_Ni_a'),
  'r-opa':           rs('Opa'),
  'r-clap':          rs('Clap'),
  'r-sexy-fish':     rs('Sexy_Fish'),
  'r-nammos':        rs('Nammos'),
  'r-tattu':         rs('Tattu'),
  'bc-verde':        bc('Verde_Beach'),
  'bc-nikki':        bc('Nikki_Beach'),
  'bc-nobu':         bc('Nobu_by_the_beach'),
  'bc-kyma':         bc('Kyma'),
  'nc-iris':         nc('Iris'),
  'nc-epik':         nc('Epik'),
  'nc-nyx':          nc('Nyx'),
  'nc-ly-la':        nc('Ly-La'),
  'nc-paraiso':      nc('Paraiso_Rooftop'),
  'nc-bund':         nc('Shanghai_Me'),
  'nc-raspoutine':   nc('Rasputine'),
  'nc-avenue':       nc('Avenue'),
  'nc-ora':          nc('Ora'),
  'nc-secret-room':  nc('Secret_Room'),
  'nc-socialista':   nc('Socialista'),
  'nc-soho-meydan':  nc('Soho_Garden'),
  'nc-soho-palm':    nc('Palm_Jumeirah'),
  'nc-code':         nc('Code'),
  'nc-babylon-club': nc('Babylon'),
  'nc-litt':         nc('Litt'),
  'nc-ongaku':       nc('Ongaku'),
  'de-billionaire':  de('Billionaire'),
  'de-babylon':      de('Babylon'),
  'de-josette':      de('Adaline'),
  'de-krasota':      rs('Krasota'),
  'de-theater':      de('Theater'),
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const VENUE_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(ID_TO_IMAGE_SET).map(([id, set]) => [id, set.hero])
);

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  restaurants: '/images/restaurants/Bagatelle/image1.jpg',
  dining: '/images/restaurants/Bagatelle/image1.jpg',
  'beach-clubs': '/images/beach_clubs/Nikki_Beach/image1.jpg',
  'night-clubs': '/images/nightclubs/Iris/image1.jpg',
  nightlife: '/images/nightclubs/Iris/image1.jpg',
  'dining-entertainment': '/images/dining_entertainment/Billionaire/image1.jpg',
};

export function getSpecificVenueImage(id: string, categoryId: string): string {
  if (ID_TO_IMAGE_SET[id]) {
    return ID_TO_IMAGE_SET[id].hero;
  }
  return CATEGORY_FALLBACK_IMAGES[categoryId] ?? CATEGORY_FALLBACK_IMAGES.restaurants;
}

export function getVenueGalleryImage(id: string): string | undefined {
  return ID_TO_IMAGE_SET[id]?.gallery;
}

const MENU_STUB_FOLDERS = new Set(['CouCou', 'Ram___Roll', 'Verde_Beach', 'BCH', 'Verde']);

export function getVenueMenuImage(id: string): string | undefined {
  const menuPath = ID_TO_IMAGE_SET[id]?.menu;
  if (!menuPath) return undefined;
  const folder = menuPath.split('/')[3];
  return MENU_STUB_FOLDERS.has(folder) ? undefined : menuPath;
}

export function getVenueBlogPath(id: string): string | undefined {
  return ID_TO_IMAGE_SET[id]?.blogPath;
}

export function getVenueImageSet(id: string): VenueImageSet | undefined {
  return ID_TO_IMAGE_SET[id];
}

/**
 * Apply local images to a venue object. Call this during normalization.
 * Returns the venue with hero_image and gallery_images replaced with local paths.
 */
export function applyLocalImages(venue: { id: string; name: string; hero_image: string; gallery_images?: string[] | null }): {
  hero_image: string;
  gallery_images: string[];
} {
  // Try ID first, then name
  const set = ID_TO_IMAGE_SET[venue.id] ?? getImageSetByName(venue.name);
  if (!set) {
    return { hero_image: venue.hero_image, gallery_images: venue.gallery_images ?? [] };
  }
  return {
    hero_image: set.hero,
    gallery_images: [set.gallery, ...(venue.gallery_images || [])],
  };
}
