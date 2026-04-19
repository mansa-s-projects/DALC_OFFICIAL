#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { runAllScanners } from './scanners/index.js';
import { generateQueries } from './lib/query-builder.js';
import { OUTPUT_DIR } from './config.js';
import type { PipelineManifest, ManifestItem } from './types.js';

async function main(): Promise<void> {
  console.log('[build-manifest] Scanning all data sources...');
  const raw = await runAllScanners();

  const items: ManifestItem[] = raw.map((item) => ({
    ...item,
    searchQueries: generateQueries(item),
    lastUpdated: new Date().toISOString(),
  }));

  const stats = {
    total: items.length,
    verified: items.filter((i) => i.imageStatus === 'verified').length,
    pending: items.filter((i) => i.imageStatus === 'pending').length,
    missing: items.filter((i) => i.imageStatus === 'missing').length,
    fallback: items.filter((i) => i.imageStatus === 'fallback').length,
    unpublished: items.filter((i) => i.imageStatus === 'unpublished').length,
  };

  const manifest: PipelineManifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalItems: items.length,
    stats,
    items,
  };

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const dest = path.join(OUTPUT_DIR, 'manifest.json');
  writeFileSync(dest, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(
    `[build-manifest] Done. ${items.length} items written to ${dest}`
  );
  console.log(`  verified: ${stats.verified}`);
  console.log(`  pending:  ${stats.pending}`);
  console.log(`  missing:  ${stats.missing}`);
}

main().catch((err) => {
  console.error('[build-manifest] Fatal:', err);
  process.exit(1);
});
