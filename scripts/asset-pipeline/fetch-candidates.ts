#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fetchCandidatesForQuery } from './lib/unsplash.js';
import { scoreCandidate } from './lib/validator.js';
import { OUTPUT_DIR } from './config.js';
import type { PipelineManifest, CandidateSet } from './types.js';

function loadManifest(): PipelineManifest {
  const file = path.join(OUTPUT_DIR, 'manifest.json');
  if (!existsSync(file)) {
    throw new Error('manifest.json not found. Run build-manifest first.');
  }
  return JSON.parse(readFileSync(file, 'utf-8')) as PipelineManifest;
}

async function main(): Promise<void> {
  const manifest = loadManifest();
  const candidatesDir = path.join(OUTPUT_DIR, 'candidates');
  mkdirSync(candidatesDir, { recursive: true });

  const needsFetch = manifest.items.filter(
    (i) => i.imageStatus === 'missing' || i.imageStatus === 'pending'
  );

  console.log(
    `[fetch-candidates] Fetching candidates for ${needsFetch.length} items...`
  );

  const usedIds = new Set<string>();
  let done = 0;

  for (const item of needsFetch) {
    const queries = item.searchQueries.slice(0, 3);
    const candidateSet: CandidateSet = {
      manifestItemId: item.id,
      queries,
      fetchedAt: new Date().toISOString(),
      candidates: [],
    };

    for (const query of queries) {
      try {
        const photos = await fetchCandidatesForQuery(query);
        for (const photo of photos) {
          const scored = scoreCandidate(photo, item, usedIds);
          candidateSet.candidates.push(scored);
        }
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.warn(`  [WARN] Query "${query}" failed:`, (err as Error).message);
      }
    }

    const outFile = path.join(candidatesDir, `${item.slug}.json`);
    writeFileSync(outFile, JSON.stringify(candidateSet, null, 2), 'utf-8');
    done++;

    if (done % 10 === 0) {
      console.log(`  ${done}/${needsFetch.length} fetched`);
    }
  }

  console.log(`[fetch-candidates] Done. ${done} candidate files written.`);
}

main().catch((err) => {
  console.error('[fetch-candidates] Fatal:', err);
  process.exit(1);
});
