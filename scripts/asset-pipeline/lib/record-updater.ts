import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import type { PipelineManifest } from '../types.js';
import { ROOT_DIR } from '../config.js';

function patchJsonFile(filePath: string, patches: Record<string, string>): void {
  const raw = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw) as Record<string, unknown>[];
  let changed = false;

  for (const record of data) {
    const id = String(record['id'] ?? '');
    if (id in patches) {
      record['image'] = patches[id];
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

function patchTsRecord(
  filePath: string,
  exportName: string,
  patches: Record<string, string>
): void {
  let src = readFileSync(filePath, 'utf-8');
  let changed = false;

  for (const [key, newUrl] of Object.entries(patches)) {
    const regex = new RegExp(`(['"]${key}['"]\\s*:\\s*)(['"][^'"]+['"])`, 'g');
    const updated = src.replace(regex, `$1'${newUrl}'`);
    if (updated !== src) {
      src = updated;
      changed = true;
    }
  }

  if (changed) {
    void exportName;
    writeFileSync(filePath, src, 'utf-8');
  }
}

export function updateHotelsJson(manifest: PipelineManifest): void {
  const hotelsPath = path.join(ROOT_DIR, 'src/data/travel/hotels/hotels.json');
  const patches: Record<string, string> = {};

  for (const item of manifest.items) {
    if (item.vertical === 'travel' && item.category === 'hotels' && item.coverImage) {
      patches[item.slug] = item.coverImage;
    }
  }

  if (Object.keys(patches).length > 0) {
    patchJsonFile(hotelsPath, patches);
  }
}

export function updateCarsData(manifest: PipelineManifest): void {
  const carsPath = path.join(ROOT_DIR, 'src/data/transport/carsData.ts');
  const patches: Record<string, string> = {};

  for (const item of manifest.items) {
    if (item.vertical === 'transport' && item.category === 'cars' && item.coverImage) {
      patches[item.slug] = item.coverImage;
    }
  }

  if (Object.keys(patches).length > 0) {
    patchTsRecord(carsPath, 'CAR_IMAGES', patches);
  }
}

export function updateJetFleet(manifest: PipelineManifest): void {
  const jetPath = path.join(ROOT_DIR, 'src/data/jets/jetFleet.ts');
  const patches: Record<string, string> = {};

  for (const item of manifest.items) {
    if (item.vertical === 'transport' && item.category === 'jets' && item.coverImage) {
      patches[item.slug] = item.coverImage;
    }
  }

  if (Object.keys(patches).length > 0) {
    patchTsRecord(jetPath, 'jetFleet', patches);
  }
}

export function updateVenueImages(manifest: PipelineManifest): void {
  const venueImagesPath = path.join(ROOT_DIR, 'src/data/venues/venueImages.ts');
  const patches: Record<string, string> = {};

  for (const item of manifest.items) {
    if (item.vertical === 'nightlife' && item.coverImage) {
      patches[item.slug] = item.coverImage;
    }
  }

  if (Object.keys(patches).length > 0) {
    patchTsRecord(venueImagesPath, 'venueImages', patches);
  }
}

export function updateAllRecords(manifest: PipelineManifest): void {
  updateHotelsJson(manifest);
  updateCarsData(manifest);
  updateJetFleet(manifest);
  updateVenueImages(manifest);
  console.log('[record-updater] All source records patched.');
}
