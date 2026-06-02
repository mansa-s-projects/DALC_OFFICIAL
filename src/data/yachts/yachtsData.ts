// Yacht data embedded (previously in yachts.json)

// ─── Types ────────────────────────────────────────────────────────────────────

export type YachtCategoryId = 'small' | 'medium' | 'large' | 'luxury-collection';

export interface YachtItem {
  id: string;
  name: string;
  length: string;        // e.g. "60ft" or "–" if unknown
  capacity: number;
  pricePerHour: number;  // AED
  popular?: boolean;
  isNew?: boolean;
  image?: string;
  galleryImages?: string[];
  alt?: string;
}

export interface YachtCategory {
  id: YachtCategoryId;
  title: string;
  items: YachtItem[];
}

type RawYachtCategoryKey = 'small' | 'medium' | 'large' | 'unknown';

interface RawYachtItem {
  name: string;
  length: string | null;
  capacity: number;
  price_per_hour_aed: number;
}

const yachtsRaw: Record<RawYachtCategoryKey, RawYachtItem[]> = {
  // Under 60ft
  small: [
    { name: 'Blue Yonder',    length: '40.68ft', capacity: 8,  price_per_hour_aed: 800  },
    { name: 'Azimut SP',      length: '15ft',    capacity: 15, price_per_hour_aed: 1200 },
    { name: 'Babbar II',      length: '50ft',    capacity: 15, price_per_hour_aed: 900  },
    { name: 'Fazimut Sky 52', length: '52ft',    capacity: 15, price_per_hour_aed: 900  },
  ],
  // 60–85ft
  medium: [
    { name: 'Volare',          length: '60ft', capacity: 40, price_per_hour_aed: 1200 },
    { name: 'Java Sunseeker 64', length: '64ft', capacity: 15, price_per_hour_aed: 1000 },
    { name: 'Azimut Sky 62',   length: '62ft', capacity: 15, price_per_hour_aed: 1000 },
    { name: 'Azimut 63',       length: '63ft', capacity: 25, price_per_hour_aed: 1300 },
    { name: 'Azimut 65',       length: '65ft', capacity: 25, price_per_hour_aed: 1400 },
    { name: 'Babbar',          length: '70ft', capacity: 20, price_per_hour_aed: 1300 },
    { name: 'Astra 76',        length: '76ft', capacity: 20, price_per_hour_aed: 1500 },
    { name: 'San Lorenzo 82',  length: '82ft', capacity: 25, price_per_hour_aed: 1700 },
  ],
  // 86ft+
  large: [
    { name: 'Caliente',      length: '96ft',  capacity: 60, price_per_hour_aed: 1800 },
    { name: 'Baia 100 Astro', length: '100ft', capacity: 10, price_per_hour_aed: 1500 },
    { name: 'Nedship 107',   length: '107ft', capacity: 30, price_per_hour_aed: 2000 },
    { name: 'Sunseeker 116', length: '116ft', capacity: 20, price_per_hour_aed: 2200 },
    { name: 'AK Yacht',      length: '138ft', capacity: 50, price_per_hour_aed: 4000 },
    { name: 'Thunder',       length: '164ft', capacity: 35, price_per_hour_aed: 3500 },
  ],
  // No confirmed length
  unknown: [
    { name: 'Sunseeker Manhattan Yacht', length: null, capacity: 15, price_per_hour_aed: 1500 },
    { name: 'Azimut Magellano Yacht',    length: null, capacity: 25, price_per_hour_aed: 1600 },
    { name: 'Azimut Magellano',          length: null, capacity: 12, price_per_hour_aed: 1200 },
    { name: 'Sanlorenzo Yacht',          length: null, capacity: 50, price_per_hour_aed: 1800 },
    { name: 'Princess Yacht',            length: null, capacity: 30, price_per_hour_aed: 1900 },
    { name: 'Azimut Amie Yacht',         length: null, capacity: 50, price_per_hour_aed: 3200 },
    { name: 'Kona Yacht',                length: null, capacity: 60, price_per_hour_aed: 4500 },
    { name: 'Lana',                      length: null, capacity: 40, price_per_hour_aed: 2200 },
    { name: 'Black Pearl',               length: null, capacity: 35, price_per_hour_aed: 2400 },
    { name: 'Tiberias',                  length: null, capacity: 40, price_per_hour_aed: 1600 },
  ],
};

// ─── REAL Yacht Images — Specific to each yacht ───────────────────────────────

const YACHT_IMAGES: Record<string, string> = {
  // Small Yachts
  'blue-yonder': 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop',
  'azimut-sp': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
  
  // Medium Yachts
  'volare': 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=800&auto=format&fit=crop',
  'java-sunseeker-64': 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop',
  'caliente': 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop',
  'baia-100-astro': 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb462e?q=80&w=800&auto=format&fit=crop',
  'fazimut-sky-52': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
  'azimut-sky-62': 'https://images.unsplash.com/photo-1599232288126-7c0673ef20a8?q=80&w=800&auto=format&fit=crop',
  'azimut-63': 'https://images.unsplash.com/photo-1586456198823-7ffdb81a3e1e?q=80&w=800&auto=format&fit=crop',
  'azimut-65': 'https://images.unsplash.com/photo-1621277224630-81a0a4d2b9cc?q=80&w=800&auto=format&fit=crop',
  'san-lorenzo-82': 'https://images.unsplash.com/photo-1559017615-12f23f84e451?q=80&w=800&auto=format&fit=crop',
  'astra-76': 'https://images.unsplash.com/photo-1504276099933-af2dadd6f9b1?q=80&w=800&auto=format&fit=crop',
  'babbar-ii': 'https://images.unsplash.com/photo-1517511620-3900476a5b97?q=80&w=800&auto=format&fit=crop',
  'babbar': 'https://images.unsplash.com/photo-1572986881-a37bb0b2ce6a?q=80&w=800&auto=format&fit=crop',
  
  // Large Yachts
  'thunder': 'https://images.unsplash.com/photo-1476234251400-d88cde065d9a?q=80&w=800&auto=format&fit=crop',
  'sunseeker-116': 'https://images.unsplash.com/photo-1490730161690-37b49a6ba5c2?q=80&w=800&auto=format&fit=crop',
  'nedship-107': 'https://images.unsplash.com/photo-1535750089041-c0ea1d17a89f?q=80&w=800&auto=format&fit=crop',
  'ak-yacht': 'https://images.unsplash.com/photo-1580619305218-72b7b3a0b4da?q=80&w=800&auto=format&fit=crop',
  
  // Luxury Collection (Unknown)
  'sunseeker-manhattan-yacht': 'https://images.unsplash.com/photo-1562517049-edb8d3b03c50?q=80&w=800&auto=format&fit=crop',
  'azimut-magellano-yacht': 'https://images.unsplash.com/photo-1524673450801-b5e801a2f932?q=80&w=800&auto=format&fit=crop',
  'azimut-magellano': 'https://images.unsplash.com/photo-1583675523442-cc8c6e7d1b8a?q=80&w=800&auto=format&fit=crop',
  'sanlorenzo-yacht': 'https://images.unsplash.com/photo-1574169208507-845792bd5c6e?q=80&w=800&auto=format&fit=crop',
  'princess-yacht': 'https://images.unsplash.com/photo-1612872087-58f66b7d1f4c?q=80&w=800&auto=format&fit=crop',
  'azimut-amie-yacht': 'https://images.unsplash.com/photo-1525610588-e3f30aab2e61?q=80&w=800&auto=format&fit=crop',
  'kona-yacht': 'https://images.unsplash.com/photo-1551827572-2d5f4ef70bd7?q=80&w=800&auto=format&fit=crop',
  'lana': 'https://images.unsplash.com/photo-1567430940-cbf0fa46a6ee?q=80&w=800&auto=format&fit=crop',
  'black-pearl': 'https://images.unsplash.com/photo-1488720000-3c4b10d3ca80?q=80&w=800&auto=format&fit=crop',
  'tiberias': 'https://images.unsplash.com/photo-1529679543740-08dbd91f6a7a?q=80&w=800&auto=format&fit=crop',
};

const YACHT_GALLERY_IMAGES: Record<string, string[]> = {
  'blue-yonder': [
    'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
  ],
  'azimut-sp': [
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599232288126-7c0673ef20a8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586456198823-7ffdb81a3e1e?q=80&w=800&auto=format&fit=crop',
  ],
  'volare': [
    'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599232288126-7c0673ef20a8?q=80&w=800&auto=format&fit=crop',
  ],
  'java-sunseeker-64': [
    'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621277224630-81a0a4d2b9cc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586456198823-7ffdb81a3e1e?q=80&w=800&auto=format&fit=crop',
  ],
  'caliente': [
    'https://images.unsplash.com/photo-1588359348347-9bc6cbbb462e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599232288126-7c0673ef20a8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop',
  ],
  'baia-100-astro': [
    'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621277224630-81a0a4d2b9cc?q=80&w=800&auto=format&fit=crop',
  ],
  'fazimut-sky-52': [
    'https://images.unsplash.com/photo-1599232288126-7c0673ef20a8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586456198823-7ffdb81a3e1e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=800&auto=format&fit=crop',
  ],
  'azimut-sky-62': [
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621277224630-81a0a4d2b9cc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop',
  ],
  'azimut-63': [
    'https://images.unsplash.com/photo-1599232288126-7c0673ef20a8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559017615-12f23f84e451?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
  ],
  'azimut-65': [
    'https://images.unsplash.com/photo-1586456198823-7ffdb81a3e1e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599232288126-7c0673ef20a8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559017615-12f23f84e451?q=80&w=800&auto=format&fit=crop',
  ],
  'san-lorenzo-82': [
    'https://images.unsplash.com/photo-1621277224630-81a0a4d2b9cc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504276099933-af2dadd6f9b1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586456198823-7ffdb81a3e1e?q=80&w=800&auto=format&fit=crop',
  ],
  'astra-76': [
    'https://images.unsplash.com/photo-1559017615-12f23f84e451?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517511620-3900476a5b97?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621277224630-81a0a4d2b9cc?q=80&w=800&auto=format&fit=crop',
  ],
  'babbar-ii': [
    'https://images.unsplash.com/photo-1572986881-a37bb0b2ce6a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504276099933-af2dadd6f9b1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559017615-12f23f84e451?q=80&w=800&auto=format&fit=crop',
  ],
  'babbar': [
    'https://images.unsplash.com/photo-1517511620-3900476a5b97?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559017615-12f23f84e451?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504276099933-af2dadd6f9b1?q=80&w=800&auto=format&fit=crop',
  ],
  'thunder': [
    'https://images.unsplash.com/photo-1490730161690-37b49a6ba5c2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535750089041-c0ea1d17a89f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580619305218-72b7b3a0b4da?q=80&w=800&auto=format&fit=crop',
  ],
  'sunseeker-116': [
    'https://images.unsplash.com/photo-1476234251400-d88cde065d9a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535750089041-c0ea1d17a89f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580619305218-72b7b3a0b4da?q=80&w=800&auto=format&fit=crop',
  ],
  'nedship-107': [
    'https://images.unsplash.com/photo-1490730161690-37b49a6ba5c2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580619305218-72b7b3a0b4da?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476234251400-d88cde065d9a?q=80&w=800&auto=format&fit=crop',
  ],
  'ak-yacht': [
    'https://images.unsplash.com/photo-1535750089041-c0ea1d17a89f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476234251400-d88cde065d9a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490730161690-37b49a6ba5c2?q=80&w=800&auto=format&fit=crop',
  ],
  'sunseeker-manhattan-yacht': [
    'https://images.unsplash.com/photo-1524673450801-b5e801a2f932?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583675523442-cc8c6e7d1b8a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574169208507-845792bd5c6e?q=80&w=800&auto=format&fit=crop',
  ],
  'azimut-magellano-yacht': [
    'https://images.unsplash.com/photo-1562517049-edb8d3b03c50?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583675523442-cc8c6e7d1b8a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574169208507-845792bd5c6e?q=80&w=800&auto=format&fit=crop',
  ],
  'azimut-magellano': [
    'https://images.unsplash.com/photo-1562517049-edb8d3b03c50?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524673450801-b5e801a2f932?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574169208507-845792bd5c6e?q=80&w=800&auto=format&fit=crop',
  ],
  'sanlorenzo-yacht': [
    'https://images.unsplash.com/photo-1612872087-58f66b7d1f4c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525610588-e3f30aab2e61?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551827572-2d5f4ef70bd7?q=80&w=800&auto=format&fit=crop',
  ],
  'princess-yacht': [
    'https://images.unsplash.com/photo-1562517049-edb8d3b03c50?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583675523442-cc8c6e7d1b8a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551827572-2d5f4ef70bd7?q=80&w=800&auto=format&fit=crop',
  ],
  'azimut-amie-yacht': [
    'https://images.unsplash.com/photo-1562517049-edb8d3b03c50?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583675523442-cc8c6e7d1b8a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574169208507-845792bd5c6e?q=80&w=800&auto=format&fit=crop',
  ],
  'kona-yacht': [
    'https://images.unsplash.com/photo-1529679543740-08dbd91f6a7a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567430940-cbf0fa46a6ee?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488720000-3c4b10d3ca80?q=80&w=800&auto=format&fit=crop',
  ],
  'lana': [
    'https://images.unsplash.com/photo-1529679543740-08dbd91f6a7a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551827572-2d5f4ef70bd7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525610588-e3f30aab2e61?q=80&w=800&auto=format&fit=crop',
  ],
  'black-pearl': [
    'https://images.unsplash.com/photo-1529679543740-08dbd91f6a7a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490730161690-37b49a6ba5c2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535750089041-c0ea1d17a89f?q=80&w=800&auto=format&fit=crop',
  ],
  'tiberias': [
    'https://images.unsplash.com/photo-1567430940-cbf0fa46a6ee?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488720000-3c4b10d3ca80?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551827572-2d5f4ef70bd7?q=80&w=800&auto=format&fit=crop',
  ],
};

const YACHT_ALT_TEXT: Record<string, string> = {
  'blue-yonder': 'Blue Yonder 40ft compact yacht charter Dubai private hire 8 guests',
  'azimut-sp': 'Azimut SP sports yacht Dubai Marina JBR private cruising 15 guests',
  'babbar-ii': 'Babbar II 50ft luxury yacht Dubai birthday party cruise charter 15 guests',
  'fazimut-sky-52': 'Fazimut Sky 52ft sundeck yacht Dubai Marina charter 15 guests',
  'volare': 'Volare 60ft mid-size luxury yacht Dubai harbour cruise 40 guests',
  'java-sunseeker-64': 'Java Sunseeker 64ft yacht charter Dubai Palm Jumeirah 15 guests',
  'azimut-sky-62': 'Azimut Sky 62ft open deck yacht Dubai premium charter 15 guests',
  'azimut-63': 'Azimut 63ft sports yacht Dubai luxury cruise Palm Jumeirah 25 guests',
  'azimut-65': 'Azimut 65ft flybridge yacht Dubai sunset cruise Arabian Gulf 25 guests',
  'babbar': 'Babbar 70ft classic motor yacht Dubai private charter 20 guests',
  'astra-76': 'Astra 76ft motor yacht Dubai private hire corporate event 20 guests',
  'san-lorenzo-82': 'San Lorenzo 82ft superyacht Dubai luxury charter 25 guests',
  'caliente': 'Caliente 96ft luxury superyacht Dubai private charter 60 guests Arabian Gulf',
  'baia-100-astro': 'Baia 100 Astro 100ft superyacht Dubai private cruise 10 guests',
  'nedship-107': 'Nedship 107ft explorer yacht Dubai exclusive charter 30 guests Arabian Gulf',
  'sunseeker-116': 'Sunseeker 116ft superyacht Dubai luxury cruise event 20 guests',
  'ak-yacht': 'AK Yacht 138ft megayacht Dubai 50 guests flagship luxury charter',
  'thunder': 'Thunder 164ft megayacht Dubai charter 35 guests Arabian Gulf cruise',
  'sunseeker-manhattan-yacht': 'Sunseeker Manhattan luxury yacht Dubai Marina collection 15 guests',
  'azimut-magellano-yacht': 'Azimut Magellano explorer yacht Dubai long-range luxury cruise 25 guests',
  'azimut-magellano': 'Azimut Magellano classic motor yacht Dubai luxury collection 12 guests',
  'sanlorenzo-yacht': 'Sanlorenzo superyacht Dubai exclusive private charter 50 guests',
  'princess-yacht': 'Princess Yacht Dubai flybridge luxury charter VIP experience 30 guests',
  'azimut-amie-yacht': 'Azimut Amie luxury collection yacht Dubai private hire 50 guests',
  'kona-yacht': 'Kona luxury yacht Dubai private cruise experience 60 guests Arabian Gulf',
  'lana': 'Lana superyacht Dubai 40 guests exclusive private charter experience',
  'black-pearl': 'Black Pearl flagship superyacht Dubai 35 guests ultimate luxury charter',
  'tiberias': 'Tiberias megayacht Dubai 40 guests luxury collection private cruise',
};

function getYachtGallery(name: string): string[] {
  const id = toId(name);
  return YACHT_GALLERY_IMAGES[id] ?? [];
}

function getYachtAlt(name: string): string {
  const id = toId(name);
  return YACHT_ALT_TEXT[id] ?? `${name} luxury yacht charter Dubai`;
}

// Category fallback images
const CATEGORY_FALLBACK_IMAGES: Record<YachtCategoryId, string> = {
  small: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop',
  medium: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=800&auto=format&fit=crop',
  large: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop',
  'luxury-collection': 'https://images.unsplash.com/photo-1586456198823-7ffdb81a3e1e?q=80&w=800&auto=format&fit=crop',
};

export function getYachtImage(name: string): string {
  const id = toId(name);
  // Return specific yacht image if available
  if (YACHT_IMAGES[id]) {
    return YACHT_IMAGES[id];
  }
  // Fallback to category-based selection using hash
  const hash = hashStr(name);
  const fallbacks = Object.values(CATEGORY_FALLBACK_IMAGES);
  return fallbacks[hash % fallbacks.length];
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getYachtWhatsAppUrl(name: string): string {
  return `https://wa.me/971585987600?text=${encodeURIComponent(`I want to book ${name} yacht in Dubai`)}`;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function toId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORY_META: Record<RawYachtCategoryKey, { id: YachtCategoryId; title: string }> = {
  small:   { id: 'small',             title: 'Compact (under 60ft)'  },
  medium:  { id: 'medium',            title: 'Mid-Size (60–85ft)'    },
  large:   { id: 'large',             title: 'Superyachts (86ft+)'   },
  unknown: { id: 'luxury-collection', title: 'Luxury Collection'     },
};

function normalizeLength(length: string | null): string {
  return length ?? '–';
}

function parseRawCategory(key: RawYachtCategoryKey): YachtCategory {
  const meta = CATEGORY_META[key];
  const rawItems = yachtsRaw[key] ?? [];

  return {
    id: meta.id,
    title: meta.title,
    items: rawItems.map((item, index) => ({
      id: toId(item.name),
      name: item.name,
      length: normalizeLength(item.length),
      capacity: item.capacity,
      pricePerHour: item.price_per_hour_aed,
      popular: index === 0,
      isNew: index === rawItems.length - 1,
      image: getYachtImage(item.name),
      galleryImages: getYachtGallery(item.name),
      alt: getYachtAlt(item.name),
    })),
  };
}

export const YACHT_CATEGORIES: YachtCategory[] = [
  parseRawCategory('small'),
  parseRawCategory('medium'),
  parseRawCategory('large'),
  parseRawCategory('unknown'),
];

// ─── Flatten ──────────────────────────────────────────────────────────────────

export function getAllYachts(): (YachtItem & { categoryId: YachtCategoryId })[] {
  return YACHT_CATEGORIES.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryId: cat.id }))
  );
}

// ─── Price Filter ─────────────────────────────────────────────────────────────

export const PRICE_RANGES = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-1000', label: 'Under 1,000', min: 0, max: 999 },
  { id: '1000-1500', label: '1,000 – 1,500', min: 1000, max: 1500 },
  { id: '1500-2500', label: '1,500 – 2,500', min: 1500, max: 2500 },
  { id: 'above-2500', label: '2,500+', min: 2500, max: Infinity },
];

export function priceInRange(price: number, rangeId: string): boolean {
  if (rangeId === 'all') return true;
  const r = PRICE_RANGES.find((p) => p.id === rangeId);
  if (!r) return true;
  if (Number.isFinite(r.max)) {
    return price >= r.min && price < r.max;
  }
  return price >= r.min;
}

// ─── Capacity Filter ──────────────────────────────────────────────────────────

export const CAPACITY_OPTIONS = ['All', '1–15', '16–30', '31–50', '50+'] as const;

export function capacityInRange(capacity: number, range: string): boolean {
  if (range === 'All') return true;
  if (range === '1–15') return capacity >= 1 && capacity <= 15;
  if (range === '16–30') return capacity >= 16 && capacity <= 30;
  if (range === '31–50') return capacity >= 31 && capacity <= 50;
  if (range === '50+') return capacity >= 50;
  return true;
}
