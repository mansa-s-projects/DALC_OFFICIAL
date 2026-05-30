#!/usr/bin/env node
/**
 * Master pipeline orchestrator.
 *
 * Usage:
 *   npx tsx scripts/asset-pipeline/pipeline.ts
 *   npx tsx scripts/asset-pipeline/pipeline.ts --step=manifest
 *   npx tsx scripts/asset-pipeline/pipeline.ts --step=fetch
 *   npx tsx scripts/asset-pipeline/pipeline.ts --step=validate
 *   npx tsx scripts/asset-pipeline/pipeline.ts --step=optimize
 *   npx tsx scripts/asset-pipeline/pipeline.ts --step=update
 *   npx tsx scripts/asset-pipeline/pipeline.ts --dry-run
 */
import { spawnSync, SpawnSyncOptions } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STEP_SCRIPTS: Record<string, string> = {
  manifest: 'build-manifest.ts',
  fetch: 'fetch-candidates.ts',
  validate: 'validate-assets.ts',
  optimize: 'optimize-assets.ts',
  update: 'update-records.ts',
};

const STEP_ORDER = ['manifest', 'fetch', 'validate', 'optimize', 'update'];

function runStep(scriptName: string, extraArgs: string[]): void {
  const scriptPath = path.join(__dirname, scriptName);
  const opts: SpawnSyncOptions = {
    stdio: 'inherit',
    shell: false,
  };
  const result = spawnSync('npx', ['tsx', scriptPath, ...extraArgs], opts);
  if (result.status !== 0) {
    throw new Error(`Step "${scriptName}" exited with code ${result.status ?? 'unknown'}`);
  }
}

function parseArgs(): { step?: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  let step: string | undefined;
  let dryRun = false;

  for (const arg of args) {
    if (arg.startsWith('--step=')) {
      step = arg.slice('--step='.length);
    } else if (arg === '--dry-run') {
      dryRun = true;
    }
  }

  return { step, dryRun };
}

async function main(): Promise<void> {
  const { step, dryRun } = parseArgs();
  const extraArgs = dryRun ? ['--dry-run'] : [];

  if (step) {
    const script = STEP_SCRIPTS[step];
    if (!script) {
      console.error(
        `Unknown step: "${step}". Valid steps: ${STEP_ORDER.join(', ')}`
      );
      process.exit(1);
    }
    console.log(`\n[pipeline] Running step: ${step}`);
    runStep(script, extraArgs);
  } else {
    console.log('[pipeline] Running full pipeline...');
    for (const s of STEP_ORDER) {
      console.log(`\n[pipeline] ── Step: ${s}`);
      runStep(STEP_SCRIPTS[s]!, extraArgs);
    }
    console.log('\n[pipeline] All steps complete.');
  }
}

main().catch((err) => {
  console.error('[pipeline] Fatal:', err);
  process.exit(1);
});
