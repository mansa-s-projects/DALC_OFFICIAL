import path from 'path';
import { fileURLToPath } from 'url';
import type { ManifestItem, Vertical } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
void __dirname;

interface CarSource {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuel: string;
  image?: string;
}

interface CarCategorySource {
  id: string;
  items: CarSource[];
}

const SUBCATEGORY_MAP: Record<string, string> = {
  economy: 'economy',
  standard: 'standard',
  suv: 'suv',
  luxury: 'luxury',
  supercar: 'supercar',
  electric: 'electric',
  business: 'luxury',
  sport: 'supercar',
};

export async function scanCars(): Promise<ManifestItem[]> {
  const srcPath = path.resolve(__dirname, '../../../src/data/transport/carsData.ts');
  const mod = await import(srcPath) as { CAR_CATEGORIES: CarCategorySource[] };
  const categories: CarCategorySource[] = mod.CAR_CATEGORIES;
  const items: ManifestItem[] = [];

  for (const cat of categories) {
    const subcategory = SUBCATEGORY_MAP[cat.id] ?? cat.id;
    for (const car of cat.items) {
      items.push({
        id: `transport/cars/${car.id}`,
        slug: car.id,
        name: `${car.brand} ${car.model} ${car.year}`,
        vertical: 'transport' as Vertical,
        category: 'cars',
        subcategory,
        brand: car.brand,
        city: 'Dubai',
        country: 'UAE',
        assetType: 'car',
        searchQueries: [],
        targetFolder: `images/transport/cars/${subcategory}/${car.id}`,
        currentImage: car.image ?? undefined,
        imageStatus: car.image ? 'pending' : 'missing',
      });
    }
  }

  return items;
}
