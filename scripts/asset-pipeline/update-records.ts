#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { updateAllRecords } from './lib/record-updater.js';
import { OUTPUT_DIR } from './config.js';
import type { PipelineManifest } from './types.js';

function loadManifest(): PipelineManifest {
  const file = path.join(OUTPUT_DIR, 'manifest.json');
  if (!existsSync(file)) {
    throw new Error('manifest.json not found. Run build-manifest first.');
  }
  return JSON.parse(readFileSync(file, 'utf-8')) as PipelineManifest;
}

async function main(): Promise<void> {
  const manifest = loadManifest();

  const verified = manifest.items.filter((i) => i.imageStatus === 'verified');
  console.log(
    `[update-records] Patching source files for ${verified.length} verified items...`
  );

  updateAllRecords(manifest);

  console.log('[update-records] Done. Source files patched.');
}

main().catch((err) => {
  console.error('[update-records] Fatal:', err);
  process.exit(1);
});
