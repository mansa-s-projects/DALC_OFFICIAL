#!/usr/bin/env node
/**
 * scripts/parseSeoFiles.mjs
 *
 * Parses all markdown files in "SEO MD FILES/**" and generates a structured
 * JSON payload ready to paste into the Admin Bulk Import tab.
 *
 * Usage:  node scripts/parseSeoFiles.mjs
 * Output: scripts/output/parsedSuppliers.json
 */

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEO_DIR = join(__dirname, '..', 'SEO MD FILES');
const OUTPUT_DIR = join(__dirname, 'output');

// ---------------------------------------------------------------------------
// Category normalization
// ---------------------------------------------------------------------------
function normalizeSeoCategory(folder) {
  if (folder === 'Night_Clubs') return 'nightlife';
  if (folder === 'Beach_Clubs') return 'nightlife'; // beach clubs live in the nightlife pillar
  if (folder === 'Dining_Entertainment') return 'dining-entertainment';
  return 'dining'; // Restaurants folder
}

// ---------------------------------------------------------------------------
// Name normalization for alias lookup
// ---------------------------------------------------------------------------
function normalizeName(name) {
  return name
    .toLowerCase()
    // Remove diacritics (é→e, ñ→n, etc.)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    // Remove punctuation that turns up in SEO titles
    .replace(/[,.'"\u2018\u2019\u201c\u201d()\-]/g, ' ')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Venue alias map  (normalized name → DALC venue ID array)
// Covers: both the exact SEO-file name AND common abbreviations.
// ---------------------------------------------------------------------------
const VENUE_ALIAS_MAP = {
  // Night Clubs ───────────────────────────────────────────────────────────────
  'soho garden': ['nc-soho-meydan', 'nc-soho-palm'],
  'soho garden meydan': ['nc-soho-meydan'],
  'soho garden palm': ['nc-soho-palm'],
  'code  by soho garden': ['nc-code'],   // "Code, By Soho Garden" → comma becomes space
  'code by soho garden': ['nc-code'],
  'code': ['nc-code'],
  'bund lounge by shanghai me': ['nc-bund'],
  'bund lounge': ['nc-bund'],
  'ly la  by alaya': ['nc-ly-la'],       // "Ly-La, By Alaya" → hyphens/commas → spaces
  'ly la by alaya': ['nc-ly-la'],
  'ly la': ['nc-ly-la'],
  'nyx by gaia': ['nc-nyx'],
  'nyx': ['nc-nyx'],
  'ongaku by clap': ['nc-ongaku'],
  'ongaku': ['nc-ongaku'],
  'paraiso rooftop by amazonico': ['nc-paraiso'],
  'paraiso': ['nc-paraiso'],
  'secret room': ['nc-secret-room'],
  'babylon club': ['nc-babylon-club'],
  'babylon': ['nc-babylon-club'],
  'iris': ['nc-iris'],
  'epik': ['nc-epik'],
  'litt': ['nc-litt'],
  'raspoutine': ['nc-raspoutine'],
  'avenue': ['nc-avenue'],
  'ora': ['nc-ora'],
  'socialista': ['nc-socialista'],

  // Beach Clubs ───────────────────────────────────────────────────────────────
  'nikki beach': ['bc-nikki'],
  'verde beach': ['bc-verde'],
  'nobu by the beach': ['bc-nobu'],
  'kyma beach': ['bc-kyma'],
  'kyma': ['bc-kyma'],

  // Dining Entertainment ──────────────────────────────────────────────────────
  'billionaire': ['de-billionaire'],
  'the theater': ['de-theater'],
  'theater': ['de-theater'],
  // Note: krasota appears in Restaurants SEO folder but is de- in mockData
  'krasota': ['de-krasota'],

  // Restaurants ───────────────────────────────────────────────────────────────
  '1920': ['r-1920'],
  'amazonico': ['r-amazonico'],
  'amelia': ['r-amelia'],
  'bagatelle': ['r-bagatelle'],
  'bar des pres': ['r-bar-de-pres'],
  'bar de pres': ['r-bar-de-pres'],
  'ce la vi': ['r-ce-la-vi'],
  'clap': ['r-clap'],
  'coucou': ['r-coucou'],
  'coya': ['r-coya'],
  'gaia': ['r-gaia'],
  'hakkasan': ['r-hakkasan'],
  'il gattopardo': ['r-il-gattopardo'],
  'la mar': ['r-la-mar'],
  'la nina': ['r-la-nina'],
  'ling ling': ['r-ling-ling'],
  'mamabella': ['r-mamabello'],
  'mamabello': ['r-mamabello'],
  'nahate': ['r-nahate'],
  'nammos': ['r-nammos'],
  'nazcaa': ['r-nazcaa'],
  'nobu': ['r-nobu'],
  'opa': ['r-opa'],
  'ram and roll': ['r-ram-roll'],
  'ram roll': ['r-ram-roll'],
  'salvaje': ['r-salvaje'],
  'sexy fish': ['r-sexy-fish'],
  'shanghai me': ['r-shanghai-me'],
  'sushi samba': ['r-sushisamba'],
  'sushisamba': ['r-sushisamba'],
  'tang': ['r-tang'],
  'tattu': ['r-tattu'],
  'urla': ['r-urla'],
  // "Verde" in Restaurants folder = fine-dining venue (r-verde-fs), not the beach club
  'verde': ['r-verde-fs'],
  'villa coconut': ['r-villa-coconut'],
};

function lookupVenueIds(name) {
  const key = normalizeName(name);
  return VENUE_ALIAS_MAP[key] ?? [];
}

// ---------------------------------------------------------------------------
// Parse a single SEO markdown file
// ---------------------------------------------------------------------------
function parseSeoFile(filePath, folder) {
  const content = readFileSync(filePath, 'utf-8');

  const nameMatch = content.match(/^# SEO Strategy: (.+)$/m);
  const locationMatch = content.match(/^## Location: (.+)$/m);
  const categoryMatch = content.match(/^## Category: (.+)$/m);
  const primaryKwMatch = content.match(/^- Primary Keyword: (.+)$/m);
  const secondaryKwMatch = content.match(/^- Secondary Keyword: (.+)$/m);
  const heroImageMatch = content.match(/^- Hero Image: (.+)$/m);

  if (!nameMatch) return null;

  const venueName = nameMatch[1].trim();
  const location = locationMatch ? locationMatch[1].trim() : '';
  const rawCategory = categoryMatch ? categoryMatch[1].trim() : '';
  const category = normalizeSeoCategory(folder);
  const primaryKeyword = primaryKwMatch ? primaryKwMatch[1].trim() : '';
  const secondaryKeyword = secondaryKwMatch ? secondaryKwMatch[1].trim() : '';
  const heroImageStatus = heroImageMatch ? heroImageMatch[1].trim() : '';

  const venueIds = lookupVenueIds(venueName);

  return {
    venueName,
    location,
    rawCategory,
    category,
    primaryKeyword,
    secondaryKeyword,
    heroImageStatus,
    venueIds,
    sourceFile: basename(filePath),
    folder,
    hasVenueMatch: venueIds.length > 0,
  };
}

// ---------------------------------------------------------------------------
// Walk the SEO MD FILES directory
// ---------------------------------------------------------------------------
function getAllSeoFiles() {
  const results = [];
  const entries = readdirSync(SEO_DIR);

  for (const entry of entries) {
    const entryPath = join(SEO_DIR, entry);
    if (statSync(entryPath).isDirectory()) {
      const files = readdirSync(entryPath).filter((f) => f.endsWith('.md'));
      for (const file of files) {
        results.push({ filePath: join(entryPath, file), folder: entry });
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Convert parsed SEO row → BulkImportRow (matches AdminSuppliers import schema)
// ---------------------------------------------------------------------------
function toBulkImportRow(parsed) {
  return {
    name: parsed.venueName,
    categories: [parsed.category],
    venue_ids: parsed.venueIds,
    location: parsed.location,
    primary_keyword: parsed.primaryKeyword,
    secondary_keyword: parsed.secondaryKeyword,
    seo_category: parsed.rawCategory,
    hero_image_status: parsed.heroImageStatus,
    source_file: parsed.sourceFile,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  const files = getAllSeoFiles();
  const parsed = [];
  const errors = [];

  for (const { filePath, folder } of files) {
    try {
      const result = parseSeoFile(filePath, folder);
      if (result) {
        parsed.push(result);
      } else {
        errors.push({ file: basename(filePath), error: 'Could not extract venue name from H1' });
      }
    } catch (err) {
      errors.push({ file: basename(filePath), error: err.message });
    }
  }

  const matched = parsed.filter((p) => p.hasVenueMatch);
  const unmatched = parsed.filter((p) => !p.hasVenueMatch);
  const importRows = parsed.map(toBulkImportRow);

  const output = {
    generatedAt: new Date().toISOString(),
    summary: {
      total: parsed.length,
      matchedToVenueId: matched.length,
      unmatchedNewVenues: unmatched.length,
      parseErrors: errors.length,
    },
    venues: importRows,
    errors,
  };

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const outPath = join(OUTPUT_DIR, 'parsedSuppliers.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');

  // ── Console summary ──────────────────────────────────────────────────────
  console.log('\n=== DALC SEO Parser Results ===');
  console.log(`Total SEO files parsed : ${parsed.length}`);
  console.log(`Matched to venue ID    : ${matched.length}`);
  console.log(`Unmatched (new venues) : ${unmatched.length}`);
  if (errors.length) console.log(`Parse errors           : ${errors.length}`);

  if (unmatched.length > 0) {
    console.log('\nUnmatched venues (will be created as new suppliers without venue links):');
    for (const v of unmatched) {
      console.log(`  - "${v.venueName}" [${v.folder}]`);
    }
  }

  if (errors.length > 0) {
    console.log('\nParse errors:');
    for (const e of errors) {
      console.log(`  - ${e.file}: ${e.error}`);
    }
  }

  console.log(`\nOutput: ${outPath}\n`);
  console.log('Next step: copy the "venues" array from the JSON file and paste into');
  console.log('Admin → Suppliers → Bulk Import tab, then click Preview → Import.\n');
}

main();
