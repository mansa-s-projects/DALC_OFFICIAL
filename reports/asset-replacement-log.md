# DALC Asset Replacement Execution Log

**Generated:** 2026-06-17  
**Mission:** Replace 396 empty image files with production-ready assets  
**Status:** READY FOR EXECUTION  

---

## Executive Summary

This document tracks the replacement of 396 empty (0-byte) image files across 18 categories of DALC's asset library. The recovery is organized by priority tier and includes automated sourcing, conversion, and validation steps.

| Tier | Category | Empty Files | Status |
|------|----------|-------------|--------|
| 1 | Entertainment (ticketsCulture) | 152 | ⏳ Pending |
| 1 | Luxury Cars (luxuryLeisure) | 18 | ⏳ Pending |
| 1 | Yachts (marine) | 4 | ⏳ Pending |
| 2 | Aerial & Adrenaline | 9 | ⏳ Pending |
| 2 | Desert Adventures | 9 | ⏳ Pending |
| 2 | Water Activities | 3 | ⏳ Pending |
| 3 | Support Services | ~200 | ⏳ Pending |
| **TOTAL** | **396** | **396** | **⏳ READY** |

---

## Phase 1: Image Sourcing

### Strategy

Each empty category has been analyzed and assigned a sourcing strategy:

- **Official Sources First:** Manufacturer, attraction, and tourism board official sites
- **Professional Photography:** High-quality licensed photography from professional sources
- **Free Stock Photography:** Unsplash, Pexels (secondary fallback)
- **Minimum Requirements:**
  - Width: ≥ 1600px
  - Format: JPG (will be converted to WebP)
  - Aspect Ratio: Landscape (16:9 or 3:2)
  - Quality: Professional, high-resolution

### Sourcing Manifest

A comprehensive sourcing manifest has been generated at:
```
scripts/image-sourcing-manifest.json
```

This manifest includes:
- 19 Entertainment attractions with official URLs
- 6 Luxury cars with manufacturer links
- 1 Yacht offering with professional photography sources
- 7 Aerial & Adrenaline experiences
- 6 Desert Adventure experiences
- 3 Water Activities

**Each entity includes:**
- Primary official source URLs (if available)
- Fallback stock photo sources (Unsplash, Pexels)
- Search terms for easy discovery
- Expected image count and types

### Execution Options

**Option 1: Manual Download**
```
1. Open scripts/image-sourcing-manifest.json
2. For each entity, download images from fallback_urls
3. Save as: 1.jpg, 2.jpg, 3.jpg, etc. in entity folder
4. Verify minimum 1600px width
```

**Option 2: Automated Script (Python)**
```bash
python scripts/image-recovery.py --tier 1

# Options:
# --tier 1          : Download Tier 1 images (Entertainment, Cars, Yachts)
# --tier 1-2        : Download Tier 1 & 2
# --dry-run         : Preview without downloading
# --category NAME   : Specific category only
```

**Option 3: API Integration (Advanced)**
- Requires Unsplash/Pexels API keys
- Automated intelligent selection based on search terms
- Recommended for large-scale sourcing

---

## Phase 2: Image Optimization & Conversion

### WebP Conversion

Once images are downloaded, convert to WebP format:

```powershell
.\scripts\convert-to-webp.ps1 -Quality 85
```

**Options:**
- `-Quality 85` : Compression quality (80-90 recommended)
- `-DryRun` : Preview without converting
- `-IncludeExisting` : Convert previously converted images

**Output:**
- All JPGs → WebPs (same directory)
- Original JPG kept as fallback
- Manifest saved to `reports/image-manifest.json`
- Conversion report saved to `reports/webp-conversion-report.json`

### Image Specifications

After conversion, verify:

```powershell
# Check for remaining 0-byte files
Get-ChildItem public\images -Recurse -File | Where-Object {$_.Length -eq 0} | Measure-Object

# Expected output: Count = 0
```

Minimum dimensions (after conversion):
- Width: ≥ 1600px
- Height: ≥ 900px (landscape)
- Aspect Ratio: 16:9 or 3:2

File size targets:
- Hero image: < 200KB (WebP)
- Gallery images: < 150KB each (WebP)
- JPG fallback: < 300KB each

---

## Phase 3: Metadata Generation & info.json Updates

### Template Structure

A template info.json has been created at:
```
scripts/create-entity-info.json
```

For each entity with replaced images, create/update `public/images/category/entity/info.json`:

```json
{
  "id": "entity-id",
  "slug": "entity-slug",
  "name": "Entity Name",
  "coverImage": {
    "filename": "hero.webp",
    "width": 1920,
    "height": 1080,
    "format": "webp",
    "alt": "Descriptive alt text",
    "source": "Unsplash",
    "sourceUrl": "https://unsplash.com/photos/...",
    "lastVerified": "2026-06-17"
  },
  "gallery": [
    { "filename": "gallery-1.webp", ... },
    { "filename": "gallery-2.webp", ... },
    { "filename": "gallery-3.webp", ... }
  ]
}
```

### Batch Update Script (Placeholder)

```bash
# After manual image placement, run:
npx ts-node scripts/generate-info-jsons.ts

# This will:
# 1. Scan all image directories for empty .json files
# 2. Analyze image dimensions
# 3. Generate metadata
# 4. Create/update info.json with proper structure
```

---

## Phase 4: Build Verification

### Type Checking

```bash
npx tsc --noEmit
```

Expected: ✅ No errors

### Linting

```bash
npm run lint
```

Expected: ✅ No errors related to image paths

### Build

```bash
npm run build
```

Expected: ✅ Build completes, dist/ folder created, no image-related errors

### Final Verification

```powershell
# Confirm all 0-byte files are gone
Get-ChildItem public\images -Recurse -File | Where-Object {$_.Length -eq 0} | Measure-Object

# Should output: Count = 0 ✅
```

---

## Recovery Timeline

| Phase | Task | Duration | Owner | Status |
|-------|------|----------|-------|--------|
| 1 | Image sourcing (Tier 1) | 3-5 days | Asset Team | ⏳ Ready |
| 1 | Image sourcing (Tier 2) | 2-3 days | Asset Team | ⏳ Ready |
| 1 | Image sourcing (Tier 3) | 2 days | Asset Team | ⏳ Ready |
| 2 | WebP conversion & optimization | 2-3 hours | Engineering | ⏳ Ready |
| 3 | Metadata generation & info.json updates | 3-4 hours | Engineering | ⏳ Ready |
| 4 | Build verification | 1 hour | Engineering | ⏳ Ready |
| 4 | Launch validation | 2-3 hours | QA | ⏳ Ready |

**Total Estimated Effort:** 40-60 hours over 1-2 weeks

---

## Success Criteria

### Phase 1: Sourcing ✅
- [ ] All 152 Entertainment images sourced
- [ ] All 18 Luxury Cars images sourced
- [ ] All 4 Yacht images sourced
- [ ] All 9 Aerial & Adrenaline images sourced
- [ ] All 9 Desert Adventures images sourced
- [ ] All 3 Water Activities images sourced
- [ ] All sourced images ≥ 1600px width

### Phase 2: Conversion ✅
- [ ] All JPG → WebP conversion complete
- [ ] All WebP files ≤ 200KB (hero) / 150KB (gallery)
- [ ] JPG fallbacks maintained
- [ ] 0-byte file count = 0

### Phase 3: Metadata ✅
- [ ] All info.json files created/updated
- [ ] All alt texts populated (SEO optimized)
- [ ] All source URLs documented
- [ ] lastVerified dates set to today

### Phase 4: Build ✅
- [ ] `npm run build` succeeds
- [ ] `npx tsc --noEmit` succeeds
- [ ] `npm run lint` succeeds
- [ ] Images load correctly in browser
- [ ] No 404 errors for image paths

---

## Rollback Plan

If recovery fails or introduces issues:

```bash
# Restore from backup
git checkout HEAD -- public/images

# Or restore from specific commit
git log --oneline | head -20
git checkout COMMIT_HASH -- public/images
```

---

## Monitoring & Support

### Image Verification Checklist

For each entity, after sourcing:
- [ ] Directory exists: `public/images/category/entity/`
- [ ] Files present:
  - [ ] `hero.webp` (or `1.jpg` before conversion)
  - [ ] `gallery-1.webp` (or `2.jpg` before conversion)
  - [ ] `gallery-2.webp` (or `3.jpg` before conversion)
  - [ ] `info.json` (metadata)
- [ ] No 0-byte files
- [ ] Minimum 1600px width verified

### Performance Metrics

After deployment:
- [ ] Image load time < 500ms (hero)
- [ ] Core Web Vitals maintained
- [ ] No image 404 errors in logs
- [ ] CDN cache hit rate > 95%

---

## Next Steps

1. **Review sourcing manifest** (`scripts/image-sourcing-manifest.json`)
2. **Choose execution method** (manual, Python script, or API)
3. **Download images** for Tier 1 categories
4. **Run conversion script** (`scripts/convert-to-webp.ps1`)
5. **Verify build** (`npm run build`)
6. **Generate metadata** (info.json files)
7. **Test in browser** and verify no broken images
8. **Deploy with confidence**

---

## Support & Issues

For questions or issues during recovery:

1. Check the sourcing manifest for official source URLs
2. Review conversion report: `reports/webp-conversion-report.json`
3. Review image manifest: `reports/image-manifest.json`
4. Check build output for specific errors: `npm run build`

---

**Report Status:** ✅ READY FOR EXECUTION  
**Last Updated:** 2026-06-17  
**Next Review:** Upon recovery completion
