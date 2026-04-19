import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ManifestItem, Vertical } from '../types.js';
import { ROOT_DIR } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
void __filename;

interface AircraftRecord {
  id: string;
  category: string;
  name: string;
  manufacturer: string;
  capacity: number;
  image?: string;
}

interface JetFleetItem {
  id: string;
  model: string;
  passengers: number;
  cabinType: string;
  image?: string;
}

export async function scanJets(): Promise<ManifestItem[]> {
  const items: ManifestItem[] = [];

  const aircraftRaw = readFileSync(
    path.join(ROOT_DIR, 'src/data/travel/jets/aircraft.json'),
    'utf-8'
  );
  const aircraft: AircraftRecord[] = JSON.parse(aircraftRaw);

  for (const a of aircraft) {
    items.push({
      id: `travel/jets/${a.id}`,
      slug: a.id,
      name: a.name,
      vertical: 'travel' as Vertical,
      category: 'jets',
      subcategory: a.category,
      brand: a.manufacturer,
      city: 'Dubai',
      country: 'UAE',
      assetType: 'private-jet',
      searchQueries: [],
      targetFolder: `images/travel/jets/${a.category}/${a.id}`,
      currentImage: a.image ?? undefined,
      imageStatus: a.image ? ('pending' as const) : ('missing' as const),
    });
  }

  const fleetPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../../src/data/jets/jetFleet.ts'
  );
  const fleetMod = await import(fleetPath) as { jetFleet: JetFleetItem[] };
  for (const j of fleetMod.jetFleet) {
    const alreadyAdded = items.some((i) => i.slug === j.id);
    if (!alreadyAdded) {
      items.push({
        id: `transport/jets/${j.id}`,
        slug: j.id,
        name: j.model,
        vertical: 'transport' as Vertical,
        category: 'jets',
        subcategory: j.cabinType.toLowerCase().replace(/\s+/g, '-'),
        city: 'Dubai',
        country: 'UAE',
        assetType: 'private-jet',
        searchQueries: [],
        targetFolder: `images/transport/jets/${j.id}`,
        currentImage: j.image ?? undefined,
        imageStatus: j.image ? ('pending' as const) : ('missing' as const),
      });
    }
  }

  return items;
}
