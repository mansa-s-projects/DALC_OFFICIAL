import path from 'path';
import { fileURLToPath } from 'url';
import type { ManifestItem, Vertical } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
void __filename;

interface YachtSource {
  id: string;
  name: string;
  slug: string;
  category: string;
  length?: number;
  image?: string;
}

export async function scanYachts(): Promise<ManifestItem[]> {
  const srcPath = path.resolve(__dirname, '../../../src/data/yachts/yachtsData.ts');
  const mod = await import(srcPath) as { getAllYachts: () => YachtSource[] };
  const yachts = mod.getAllYachts();

  return yachts.map((y) => ({
    id: `transport/yachts/${y.slug}`,
    slug: y.slug,
    name: y.name,
    vertical: 'transport' as Vertical,
    category: 'yachts',
    subcategory: y.category,
    city: 'Dubai',
    country: 'UAE',
    assetType: 'yacht',
    searchQueries: [],
    targetFolder: `images/transport/yachts/${y.category}/${y.slug}`,
    currentImage: y.image ?? undefined,
    imageStatus: y.image ? ('pending' as const) : ('missing' as const),
  }));
}
