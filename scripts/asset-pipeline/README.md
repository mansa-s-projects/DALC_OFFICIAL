# DALC Asset Ingestion Pipeline

Automated pipeline for scanning, fetching, validating, downloading, and optimising images across all Dubai À La Carte content verticals.

---

## Prerequisites

- Node 18+ / npm 9+
- `sharp` installed: `npm install sharp`
- Unsplash API key added to `.env.local`:
  ```
  UNSPLASH_ACCESS_KEY=your_key_here
  ```

---

## Directory Structure

```
scripts/asset-pipeline/
├── types.ts              # Shared interfaces
├── config.ts             # Paths, thresholds, query templates
├── pipeline.ts           # Master orchestrator
├── build-manifest.ts     # Step 1 — scan data sources
├── fetch-candidates.ts   # Step 2 — query Unsplash per item
├── validate-assets.ts    # Step 3 — score & pick winners
├── optimize-assets.ts    # Step 4 — download, resize, convert to WebP
├── update-records.ts     # Step 5 — patch source data files
├── scanners/
│   ├── hotels.ts
│   ├── cars.ts
│   ├── yachts.ts
│   ├── jets.ts
│   ├── venues.ts
│   ├── experiences.ts
│   └── index.ts
└── lib/
    ├── query-builder.ts
    ├── unsplash.ts
    ├── validator.ts
    ├── downloader.ts
    ├── optimizer.ts
    ├── metadata.ts
    └── record-updater.ts
```

Output files (generated, not committed):

```
scripts/asset-pipeline/output/
├── manifest.json              # Full item manifest with status
├── candidates/
│   └── {slug}.json            # Per-item scored candidates
└── validation-report.json     # Summary of validate step
```

Optimised images land in:

```
public/images/{vertical}/{category}/{subcategory}/{slug}/
```

---

## Running Individual Steps

```bash
# Step 1 — scan all data sources → output/manifest.json
npx tsx scripts/asset-pipeline/build-manifest.ts

# Step 2 — fetch Unsplash candidates per item → output/candidates/*.json
npx tsx scripts/asset-pipeline/fetch-candidates.ts

# Step 3 — score candidates, pick winners → updates manifest + validation-report.json
npx tsx scripts/asset-pipeline/validate-assets.ts

# Step 4 — download + resize + convert to WebP
npx tsx scripts/asset-pipeline/optimize-assets.ts

# Step 4 (dry run — prints what would happen, no file writes)
npx tsx scripts/asset-pipeline/optimize-assets.ts --dry-run

# Step 5 — patch source data files with new image URLs
npx tsx scripts/asset-pipeline/update-records.ts
```

---

## Running the Full Pipeline

```bash
# All 5 steps in sequence
npx tsx scripts/asset-pipeline/pipeline.ts

# Single named step via pipeline
npx tsx scripts/asset-pipeline/pipeline.ts --step=manifest
npx tsx scripts/asset-pipeline/pipeline.ts --step=fetch
npx tsx scripts/asset-pipeline/pipeline.ts --step=validate
npx tsx scripts/asset-pipeline/pipeline.ts --step=optimize
npx tsx scripts/asset-pipeline/pipeline.ts --step=update

# Dry run (passed through to optimize step)
npx tsx scripts/asset-pipeline/pipeline.ts --dry-run
```

---

## Scoring System

Each Unsplash photo is scored out of 100:

| Dimension         | Max | Logic |
|-------------------|-----|-------|
| Entity match      | 25  | Name/brand/subcategory tokens found in photo description + tags |
| Category relevance| 25  | Keyword hit ratio against category keyword dictionary |
| Source trust      | 20  | Fixed value (Unsplash) |
| Resolution        | 15  | ≥1200px wide = 15, ≥800 = 10, ≥600 = 5, else 0 |
| Aspect ratio      | 10  | 1.2–2.0 = 10, 1.0–1.2 = 5, else 0 |
| Duplicate check   | 5   | 5 if unsplash ID not yet used, else 0 |

Thresholds:
- **≥ 70** — `approved` (downloaded automatically)
- **50 – 69** — `manual-review` (logged in validation report for human review)
- **< 50** — `failed` (skipped)

---

## Data Sources Covered

| Vertical     | Source file                                        | Items |
|--------------|----------------------------------------------------|-------|
| Transport    | `src/data/transport/carsData.ts`                   | ~87   |
| Transport    | `src/data/jets/jetFleet.ts`                        | 3     |
| Transport    | `src/data/yachts/yachtsData.ts`                    | 28    |
| Travel       | `src/data/travel/hotels/hotels.json`               | 26    |
| Travel       | `src/data/travel/jets/aircraft.json`               | varied|
| Nightlife    | `src/data/venues/venuesData.ts`                    | ~65   |
| Experiences  | `src/features/experiences/waterData.ts`            | 5     |
| Experiences  | `src/features/experiences/desertData.ts`           | 5     |

---

## Adding a New Scanner

1. Create `scanners/my-vertical.ts` implementing `ManifestItem[]` output.
2. Import and call it in `scanners/index.ts` inside `runAllScanners()`.
3. Add relevant query templates to `config.ts` under `QUERY_TEMPLATES['my-vertical/category']`.
