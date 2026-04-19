#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import path from 'path';
import { pickWinner } from './lib/validator.js';
import { SCORING_THRESHOLDS, OUTPUT_DIR } from './config.js';
import type { PipelineManifest, CandidateSet, ImageCandidate } from './types.js';

function loadManifest(): PipelineManifest {
  const file = path.join(OUTPUT_DIR, 'manifest.json');
  if (!existsSync(file)) {
    throw new Error('manifest.json not found. Run build-manifest first.');
  }
  return JSON.parse(readFileSync(file, 'utf-8')) as PipelineManifest;
}

interface ValidationReport {
  generatedAt: string;
  total: number;
  approved: number;
  manualReview: number;
  failed: number;
  results: Array<{
    id: string;
    slug: string;
    status: 'approved' | 'manual-review' | 'failed';
    winnerId?: string;
    winnerUrl?: string;
    winnerScore?: number;
  }>;
}

async function main(): Promise<void> {
  const manifest = loadManifest();
  const candidatesDir = path.join(OUTPUT_DIR, 'candidates');

  if (!existsSync(candidatesDir)) {
    throw new Error('No candidates directory. Run fetch-candidates first.');
  }

  const report: ValidationReport = {
    generatedAt: new Date().toISOString(),
    total: 0,
    approved: 0,
    manualReview: 0,
    failed: 0,
    results: [],
  };

  const candidateFiles = readdirSync(candidatesDir).filter((f) =>
    f.endsWith('.json')
  );

  for (const file of candidateFiles) {
    const slug = file.replace('.json', '');
    const item = manifest.items.find((i) => i.slug === slug);
    if (!item) continue;

    const raw = readFileSync(path.join(candidatesDir, file), 'utf-8');
    const set = JSON.parse(raw) as CandidateSet;

    report.total++;
    const winner: ImageCandidate | null = pickWinner(set.candidates);

    if (winner) {
      item.imageStatus = 'pending';
      item.coverImage = winner.sourceUrl;
      set.selectedIndex = set.candidates.indexOf(winner);
      report.approved++;
      report.results.push({
        id: item.id,
        slug,
        status: 'approved',
        winnerId: winner.unsplashId,
        winnerUrl: winner.sourceUrl,
        winnerScore: winner.totalScore,
      });
    } else {
      const best = set.candidates
        .sort((a, b) => b.totalScore - a.totalScore)
        .find((c) => c.totalScore >= SCORING_THRESHOLDS.manualReview);

      if (best) {
        item.imageStatus = 'fallback';
        report.manualReview++;
        report.results.push({
          id: item.id,
          slug,
          status: 'manual-review',
          winnerScore: best.totalScore,
        });
      } else {
        item.imageStatus = 'missing';
        report.failed++;
        report.results.push({ id: item.id, slug, status: 'failed' });
      }
    }

    writeFileSync(
      path.join(candidatesDir, file),
      JSON.stringify(set, null, 2),
      'utf-8'
    );
  }

  writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );

  writeFileSync(
    path.join(OUTPUT_DIR, 'validation-report.json'),
    JSON.stringify(report, null, 2),
    'utf-8'
  );

  console.log('[validate-assets] Validation complete.');
  console.log(`  approved:      ${report.approved}`);
  console.log(`  manual-review: ${report.manualReview}`);
  console.log(`  failed:        ${report.failed}`);
}

main().catch((err) => {
  console.error('[validate-assets] Fatal:', err);
  process.exit(1);
});
