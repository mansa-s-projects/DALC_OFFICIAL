#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { downloadImage, getLocalPath } from './lib/downloader.js';
import { optimizeImage } from './lib/optimizer.js';
import { buildMetadata, saveMetadata } from './lib/metadata.js';
import { OUTPUT_DIR, PUBLIC_DIR } from './config.js';
import type { PipelineManifest, ImageCandidate, CandidateSet } from './types.js';

function loadManifest(): PipelineManifest {
  const file = path.join(OUTPUT_DIR, 'manifest.json');
  if (!existsSync(file)) {
    throw new Error('manifest.json not found. Run build-manifest first.');
  }
  return JSON.parse(readFileSync(file, 'utf-8')) as PipelineManifest;
}

function loadWinner(slug: string): ImageCandidate | null {
  const file = path.join(OUTPUT_DIR, 'candidates', `${slug}.json`);
  if (!existsSync(file)) return null;
  const set = JSON.parse(readFileSync(file, 'utf-8')) as CandidateSet;
  if (set.selectedIndex == null) return null;
  return set.candidates[set.selectedIndex] ?? null;
}

const isDryRun = process.argv.includes('--dry-run');

async function main(): Promise<void> {
  const manifest = loadManifest();

  const eligible = manifest.items.filter(
    (i) => i.imageStatus === 'pending' || i.imageStatus === 'fallback'
  );

  console.log(`[optimize-assets] Processing ${eligible.length} items...`);

  let downloaded = 0;
  let skipped = 0;

  for (const item of eligible) {
    const winner = loadWinner(item.slug);
    if (!winner) {
      skipped++;
      continue;
    }

    const tmpPath = getLocalPath(item, 'raw');
    const outputFolder = path.join(PUBLIC_DIR, item.targetFolder);

    if (isDryRun) {
      console.log(`  [dry-run] Would download + optimize: ${item.slug}`);
      downloaded++;
      continue;
    }

    try {
      await downloadImage(winner.downloadUrl, tmpPath);

      const paths = await optimizeImage(tmpPath, item, outputFolder);

      const metadata = buildMetadata(item, winner, paths);
      saveMetadata(metadata, outputFolder);

      item.coverImage = paths.coverUrl;
      item.thumbnail = paths.thumbnailUrl;
      item.alt = metadata.alt;
      item.imageStatus = 'verified';
      downloaded++;
    } catch (err) {
      console.warn(
        `  [WARN] Failed to optimize ${item.slug}:`,
        (err as Error).message
      );
      skipped++;
    }
  }

  writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );

  console.log(`[optimize-assets] Done.`);
  console.log(`  optimized: ${downloaded}`);
  console.log(`  skipped:   ${skipped}`);
}

main().catch((err) => {
  console.error('[optimize-assets] Fatal:', err);
  process.exit(1);
});
