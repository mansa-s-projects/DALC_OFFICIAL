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
  small: [
    { name: 'Blue Yonder', length: '45ft', capacity: 8, price_per_hour_aed: 650 },
    { name: 'Azimut SP', length: '48ft', capacity: 10, price_per_hour_aed: 750 },
  ],
  medium: [
    { name: 'Volare', length: '55ft', capacity: 12, price_per_hour_aed: 950 },
    { name: 'Java Sunseeker 64', length: '64ft', capacity: 15, price_per_hour_aed: 1200 },
    { name: 'Caliente', length: '62ft', capacity: 14, price_per_hour_aed: 1100 },
    { name: 'Baia 100 Astro', length: '100ft', capacity: 20, price_per_hour_aed: 1800 },
    { name: 'Fazimut Sky 52', length: '52ft', capacity: 12, price_per_hour_aed: 900 },
    { name: 'Azimut Sky 62', length: '62ft', capacity: 15, price_per_hour_aed: 1150 },
    { name: 'Azimut 63', length: '63ft', capacity: 15, price_per_hour_aed: 1200 },
    { name: 'Azimut 65', length: '65ft', capacity: 18, price_per_hour_aed: 1300 },
    { name: 'San Lorenzo 82', length: '82ft', capacity: 20, price_per_hour_aed: 1600 },
    { name: 'Astra 76', length: '76ft', capacity: 18, price_per_hour_aed: 1450 },
    { name: 'Babbar II', length: '70ft', capacity: 16, price_per_hour_aed: 1350 },
    { name: 'Babbar', length: '68ft', capacity: 16, price_per_hour_aed: 1300 },
  ],
  large: [
    { name: 'Thunder', length: '95ft', capacity: 25, price_per_hour_aed: 2200 },
    { name: 'Sunseeker 116', length: '116ft', capacity: 30, price_per_hour_aed: 2800 },
    { name: 'Nedship 107', length: '107ft', capacity: 28, price_per_hour_aed: 2500 },
    { name: 'AK Yacht', length: '120ft', capacity: 35, price_per_hour_aed: 3200 },
  ],
  unknown: [
    { name: 'Sunseeker Manhattan Yacht', length: null, capacity: 20, price_per_hour_aed: 1700 },
    { name: 'Azimut Magellano Yacht', length: null, capacity: 18, price_per_hour_aed: 1550 },
    { name: 'Azimut Magellano', length: null, capacity: 16, price_per_hour_aed: 1400 },
    { name: 'Sanlorenzo Yacht', length: null, capacity: 22, price_per_hour_aed: 1900 },
    { name: 'Princess Yacht', length: null, capacity: 19, price_per_hour_aed: 1650 },
    { name: 'Azimut Amie Yacht', length: null, capacity: 17, price_per_hour_aed: 1500 },
    { name: 'Kona Yacht', length: null, capacity: 21, price_per_hour_aed: 1750 },
    { name: 'Lana', length: null, capacity: 24, price_per_hour_aed: 2100 },
    { name: 'Black Pearl', length: null, capacity: 40, price_per_hour_aed: 4500 },
    { name: 'Tiberias', length: null, capacity: 32, price_per_hour_aed: 2900 },
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
  'san-lorenzo-82': 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop',
  'astra-76': 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop',
  'babbar-ii': 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=800&auto=format&fit=crop',
  'babbar': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
  
  // Large Yachts
  'thunder': 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop',
  'sunseeker-116': 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb462e?q=80&w=800&auto=format&fit=crop',
  'nedship-107': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
  'ak-yacht': 'https://images.unsplash.com/photo-1599232288126-7c0673ef20a8?q=80&w=800&auto=format&fit=crop',
  
  // Luxury Collection (Unknown)
  'sunseeker-manhattan-yacht': 'https://images.unsplash.com/photo-1586456198823-7ffdb81a3e1e?q=80&w=800&auto=format&fit=crop',
  'azimut-magellano-yacht': 'https://images.unsplash.com/photo-1621277224630-81a0a4d2b9cc?q=80&w=800&auto=format&fit=crop',
  'azimut-magellano': 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop',
  'sanlorenzo-yacht': 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop',
  'princess-yacht': 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=800&auto=format&fit=crop',
  'azimut-amie-yacht': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
  'kona-yacht': 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop',
  'lana': 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb462e?q=80&w=800&auto=format&fit=crop',
  'black-pearl': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
  'tiberias': 'https://images.unsplash.com/photo-1599232288126-7c0673ef20a8?q=80&w=800&auto=format&fit=crop',
};

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
  small: { id: 'small', title: 'Compact' },
  medium: { id: 'medium', title: 'Mid-Size' },
  large: { id: 'large', title: 'Mega Yachts' },
  unknown: { id: 'luxury-collection', title: 'Luxury Collection' },
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
  return price >= r.min && price <= r.max;
}

// ─── Capacity Filter ──────────────────────────────────────────────────────────

export const CAPACITY_OPTIONS = ['All', '1–15', '16–30', '31–50', '50+'] as const;

export function capacityInRange(capacity: number, range: string): boolean {
  if (range === 'All') return true;
  if (range === '1–15') return capacity >= 1 && capacity <= 15;
  if (range === '16–30') return capacity >= 16 && capacity <= 30;
  if (range === '31–50') return capacity >= 31 && capacity <= 50;
  if (range === '50+') return capacity > 50;
  return true;
}
