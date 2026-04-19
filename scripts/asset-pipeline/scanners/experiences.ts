import path from 'path';
import { fileURLToPath } from 'url';
import type { ManifestItem } from '../types.js';

interface WaterModel {
  slug: string;
  title: string;
  image: string;
  fromPrice: number;
  group: string;
  location: string;
  galleryImages?: string[];
  alt?: string;
}

interface DesertSubcategory {
  slug: string;
  title: string;
  image: string;
  fromPrice: number;
  galleryImages?: string[];
  alt?: string;
}

export async function scanExperiences(): Promise<ManifestItem[]> {
  const dir = path.dirname(fileURLToPath(import.meta.url));

  const waterPath = path.resolve(dir, '../../../src/features/experiences/waterData.ts');
  const desertPath = path.resolve(dir, '../../../src/features/experiences/desertData.ts');

  const [waterMod, desertMod] = await Promise.all([
    import(waterPath) as Promise<{ WATER_MODELS: WaterModel[] }>,
    import(desertPath) as Promise<{ DESERT_SUBCATEGORIES: DesertSubcategory[] }>,
  ]);

  const items: ManifestItem[] = [];

  for (const w of waterMod.WATER_MODELS) {
    items.push({
      id: `experiences/water/${w.slug}`,
      slug: w.slug,
      name: w.title,
      vertical: 'experiences',
      category: 'water',
      subcategory: w.group,
      city: w.location,
      country: 'UAE',
      assetType: 'experience',
      searchQueries: [],
      targetFolder: `images/experiences/water/${w.slug}`,
      currentImage: w.image,
      galleryImages: w.galleryImages,
      alt: w.alt,
      imageStatus: w.galleryImages?.length ? 'verified' : 'pending',
    });
  }

  for (const d of desertMod.DESERT_SUBCATEGORIES) {
    items.push({
      id: `experiences/desert/${d.slug}`,
      slug: d.slug,
      name: d.title,
      vertical: 'experiences',
      category: 'desert',
      subcategory: 'desert-safari',
      city: 'Dubai',
      country: 'UAE',
      assetType: 'experience',
      searchQueries: [],
      targetFolder: `images/experiences/desert/${d.slug}`,
      currentImage: d.image,
      galleryImages: d.galleryImages,
      alt: d.alt,
      imageStatus: d.galleryImages?.length ? 'verified' : 'pending',
    });
  }

  return items;
}
