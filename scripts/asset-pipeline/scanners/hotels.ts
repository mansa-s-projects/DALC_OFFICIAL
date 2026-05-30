import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ManifestItem } from '../types.js';
import { ROOT_DIR } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
void __filename;

interface HotelRecord {
  id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  image: string;
}

export function scanHotels(): ManifestItem[] {
  const raw = readFileSync(
    path.join(ROOT_DIR, 'src/data/travel/hotels/hotels.json'),
    'utf-8'
  );
  const hotels: HotelRecord[] = JSON.parse(raw);

  return hotels.map((h) => ({
    id: `travel/hotels/${h.id}`,
    slug: h.id,
    name: h.name,
    vertical: 'travel' as const,
    category: 'hotels',
    city: h.city,
    country: h.country,
    assetType: 'hotel',
    searchQueries: [],
    targetFolder: `images/travel/hotels/${h.id}`,
    currentImage: h.image || undefined,
    imageStatus: h.image ? ('pending' as const) : ('missing' as const),
  }));
}
