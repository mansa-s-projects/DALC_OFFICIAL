import path from 'path';
import { fileURLToPath } from 'url';
import type { ManifestItem, Vertical } from '../types.js';

const CATEGORY_TO_VERTICAL: Record<string, Vertical> = {
  restaurants: 'nightlife',
  'beach-clubs': 'nightlife',
  'night-clubs': 'nightlife',
  'dining-entertainment': 'nightlife',
};

interface VenueItem {
  id: string;
  name: string;
  location: string;
  tags: string[];
  priceRange: string;
  vibe: string;
  trending?: boolean;
  isNew?: boolean;
}

interface VenueCategory {
  id: string;
  title: string;
  items: VenueItem[];
}

export async function scanVenues(): Promise<ManifestItem[]> {
  const srcPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../../src/data/venues/venuesData.ts'
  );

  const mod = await import(srcPath) as {
    VENUE_CATEGORIES: VenueCategory[];
  };

  const items: ManifestItem[] = [];

  for (const cat of mod.VENUE_CATEGORIES) {
    const vertical = CATEGORY_TO_VERTICAL[cat.id] ?? 'nightlife';
    for (const venue of cat.items) {
      items.push({
        id: `${cat.id}/${venue.id}`,
        slug: venue.id,
        name: venue.name,
        vertical,
        category: cat.id,
        subcategory: venue.vibe,
        city: venue.location,
        country: 'UAE',
        assetType: 'venue',
        searchQueries: [],
        targetFolder: `images/nightlife/${cat.id}/${venue.id}`,
        imageStatus: 'missing' as const,
      });
    }
  }

  return items;
}
