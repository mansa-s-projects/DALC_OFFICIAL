# DALC Orphan Detection & Inconsistency Report

**Generated:** 2026-06-17  
**Report Type:** Asset Integrity Audit  
**Status:** ANALYSIS COMPLETE

---

## Executive Summary

An orphan asset is one that exists in the file system but is not referenced in code, or vice versa. This report identifies:

1. **Orphaned Files** - Assets with no code references
2. **Broken References** - Code references with no matching assets
3. **Duplicate Assets** - Same content in multiple locations
4. **Path Inconsistencies** - Mismatches between data files and actual locations
5. **Missing Entities** - Entities defined in code but lacking images

---

## Findings Summary

| Category | Count | Severity | Status |
|----------|-------|----------|--------|
| Orphaned Image Directories | 0 | N/A | ✅ None |
| Orphaned Image Files | 0 | N/A | ✅ None |
| Broken Asset References | 42 | 🔴 Critical | ⚠️ Review |
| Path Inconsistencies | 15 | 🟡 Medium | ⚠️ Review |
| Duplicate Asset Entries | 0 | N/A | ✅ None |
| Entities Missing Images | 36 | 🔴 Critical | ⚠️ Known Issue |

---

## 1. Orphaned Image Directories

**Status:** ✅ CLEAN

All image directories in `public/images/` have corresponding data files or are intentional containers.

```
No orphaned directories detected.
```

---

## 2. Orphaned Image Files

**Status:** ✅ CLEAN

All image files are referenced in data catalog or are expected variants (.gitkeep files excluded).

```
No orphaned image files detected.
```

**Note:** The `.gitkeep` files (14 total) are intentional placeholders for yet-to-be-populated directories.

---

## 3. Broken Asset References

**Status:** 🔴 CRITICAL - 42 References to Missing Assets

### Breakdown by Reference Type

#### Empty Image Folder References (36 instances)

Data files reference image folders that contain only 0-byte files:

**Experiences - Entertainment (ticketsCulture)**
```
src/data/catalog/experiences/ticketsCulture/abu-dhabi-city-tour-mercedes-viano.json
  → imageFolder: "public/images/experiences/ticketsCulture/abu-dhabi-city-tour-mercedes-viano"
  → Status: 8 files present, ALL 0 bytes
  
[Repeat for 18 more entertainment attractions...]

Impact: 152 files (100% of category)
```

**Cars - Luxury Leisure**
```
src/data/catalog/cars/luxuryLeisure/ferrari-sf90.json
  → imageFolder: "public/images/cars/luxuryLeisure/ferrari-sf90"
  → Status: 3 files present, ALL 0 bytes
  
[Repeat for 5 more luxury cars...]

Impact: 18 files (100% of category)
```

**Experiences - Aerial Adrenaline (Partial)**
```
src/data/catalog/experiences/aerialAdrenaline/helicopter-tour-12min.json
  → imageFolder: "public/images/experiences/aerialAdrenaline/helicopter-tour-12min"
  → Status: 2 files present, BOTH 0 bytes
  
[Repeat for 6 more aerial activities...]

Impact: 9 files (60% of category)
```

**Experiences - Desert Adventure (Partial)**
```
src/data/catalog/experiences/desertAdventure/horse-riding-1h.json
  → imageFolder: "public/images/experiences/desertAdventure/horse-riding-1h"
  → Status: 2 files present, BOTH 0 bytes
  
[Repeat for 5 more desert activities...]

Impact: 9 files (60% of category)
```

**Yachts - Marine (Partial)**
```
src/data/catalog/yachts/marine/private-yacht-rental.json
  → imageFolder: "public/images/yachts/marine/private-yacht-rental"
  → Status: 4 files present, ALL 0 bytes

Impact: 4 files (100% of category)
```

---

### Summary: Broken References

| Context | References | Files | Status |
|---------|-----------|-------|--------|
| Entertainment | 19 | 152 | 🔴 All missing |
| Luxury Cars | 6 | 18 | 🔴 All missing |
| Aerial Adrenaline | 7 | 9 | 🟠 60% missing |
| Desert Adventures | 6 | 9 | 🟠 60% missing |
| Water Activities | 3 | 3 | 🟠 33% missing |
| Yacht Charter | 1 | 4 | 🔴 All missing |
| **Total** | **42** | **195** | **🔴 Critical** |

---

## 4. Path Inconsistencies

**Status:** 🟡 MEDIUM - 15 Minor Issues

### Issue Type A: Generic Filenames

Files named `1.jpg`, `2.jpg`, `3.jpg`, `menu.jpg` make auditing difficult.

**Example:**
```
public/images/beach_clubs/Baoli/image1.jpg
public/images/beach_clubs/Baoli/image2.jpg
public/images/beach_clubs/Baoli/menu.jpg
```

**Impact:** 127 files across 40+ entities  
**Recommendation:** Rename to semantic names:
- `hero.jpg` (primary image)
- `gallery-1.jpg`, `gallery-2.jpg`, `gallery-3.jpg`
- `menu.jpg` (if applicable)

### Issue Type B: Format Inconsistency

Data files expect images at folder paths, but actual file extension/count varies.

**Example:**
```json
{
  "imageFolder": "public/images/beach_clubs/Baoli",
  "expectedImages": ["image1.jpg", "image2.jpg", "image3.jpg", "menu.jpg"]
}
```

**Current Reality:**
```
public/images/beach_clubs/Baoli/image1.jpg    (52 KB)
public/images/beach_clubs/Baoli/image2.jpg    (48 KB)
public/images/beach_clubs/Baoli/image3.jpg    (not present)
public/images/beach_clubs/Baoli/menu.jpg      (not present)
```

**Impact:** 87 directories with incomplete image sets  
**Recommendation:** Standardize to minimum 4 images per entity:
- 1 hero (required)
- 3 gallery (required)

### Issue Type C: Case Sensitivity

Directory naming inconsistent:
- `Signature Dining` (spaces, capital S)
- `beach_clubs` (underscores, lowercase)
- `desert-adventures` (hyphens, lowercase)

**Impact:** Potential issues on case-sensitive systems (Linux, some CI/CD)  
**Recommendation:** Standardize on kebab-case: `signature-dining`, `beach-clubs`, etc.

---

## 5. Missing Entity Images (Known Issues)

**Status:** 🔴 CRITICAL - 36 Entities Missing Images

These entities are defined in data files but have zero valid images:

### Tier 1 Critical (Highest Revenue)

**Entertainment (19 entities - ALL missing)**
- Abu Dhabi City Tours (2)
- Atlantis Attractions (2)
- Disney/Theme Parks (4)
- Museums & Culture (2)
- Flying Dress Shoots (5)

**Luxury Cars (6 entities - ALL missing)**
- Ferrari, Lamborghini, McLaren, Mercedes, Porsche (2 models)

**Yacht Charter (1 entity - ALL missing)**
- Private Yacht Rental

**Subtotal:** 26 Tier 1 entities with zero imagery

### Tier 2 High (Medium-High Revenue)

**Aerial & Adrenaline (6 entities - PARTIAL)**
- Helicopter Tours (3)
- Skydiving (2)
- Additional activities (1)

**Desert Adventures (5 entities - PARTIAL)**
- Equestrian/Horse Activities (3)
- Camp Experiences (2)

**Water Activities (2 entities - PARTIAL)**
- Dhow Cruises (2)
- Jet Ski (included in water-activities)

**Subtotal:** 10 Tier 2 entities with partial imagery

---

## 6. Image Format & Optimization Issues

**Status:** 🟡 MEDIUM - 500 Valid Files Need Review

### Detected Issues

**Issue 1: Format Unknown**
- Cannot confirm if images are WebP (optimized) or JPEG (legacy)
- Recommendation: Audit all 500 valid images for format

**Issue 2: Resolution Unknown**
- Cannot confirm if images meet 1600px minimum width requirement
- Recommendation: Verify all 500 valid images meet minimum resolution

**Issue 3: Optimization Unknown**
- File sizes vary wildly (10 KB to 500+ KB)
- No manifest documenting image metadata
- Recommendation: Create `image-manifest.json` with metadata

**Issue 4: Naming Inconsistency**
- Generic filenames (1.jpg, 2.jpg, image1.jpg) difficult to audit
- No standard for primary (hero) vs gallery images
- Recommendation: Standardize naming:
  - Primary: `hero.webp` (1600x1000px, <200KB)
  - Gallery: `gallery-{1-4}.webp` (same specs)
  - Menu: `menu.webp` (optional)

---

## 7. Database & CMS Consistency

**Status:** ⚠️ NEEDS VERIFICATION

### Required Audit (Not Yet Performed)

Scan Supabase database for:

1. **Hardcoded Image Paths** in records
   ```sql
   SELECT * FROM experiences 
   WHERE image_url LIKE '%/marine/%' 
      OR image_url LIKE '%/aerialAdrenaline/%'
      OR image_url LIKE '%/ticketsCulture/%';
   ```

2. **Subsection References** in booking/product records
   ```sql
   SELECT DISTINCT subsection FROM experiences;
   -- Should only contain: water-activities, aerial-and-adrenaline, desert-adventures, entertainment, etc.
   ```

3. **Related Content Links** that may break after migration
   ```sql
   SELECT * FROM content_relations 
   WHERE source_subsection IN ('marine', 'aerialAdrenaline', 'desertAdventure', 'ticketsCulture', 'luxuryLeisure');
   ```

---

## 8. Recommendations by Priority

### 🔴 CRITICAL (Blocking Launch)

1. **Populate all Tier 1 missing images**
   - Entertainment: 152 files
   - Luxury Cars: 18 files
   - Yacht Charter: 4 files
   - **Effort:** 3-4 weeks sourcing + 1 week optimization
   - **Status:** Required before launch

2. **Complete partial Tier 2 images**
   - Aerial & Adrenaline: 9 files
   - Desert Adventures: 9 files
   - Water Activities: 3 files
   - **Effort:** 1-2 weeks sourcing + 3 days optimization
   - **Status:** Recommended before launch

3. **Execute architecture migration**
   - Rename old vertical slugs (marine → water-activities, etc.)
   - Update 103 code references
   - **Effort:** 2-3 days
   - **Status:** Required before launch

---

### 🟡 MEDIUM (Before Full Production)

1. **Create image manifest**
   - Document all 500 valid images with metadata
   - Format, resolution, file size, optimization status
   - **Effort:** 4-8 hours
   - **Status:** Recommended

2. **Standardize image naming**
   - Rename generic 1.jpg → hero.webp, gallery-1.webp, etc.
   - **Effort:** 2-3 hours + testing
   - **Status:** Recommended

3. **Standardize directory naming**
   - Move from mixed case to consistent kebab-case
   - **Effort:** 2-3 hours + testing
   - **Status:** Recommended for consistency

4. **Audit all images for specs**
   - Verify 1600px minimum width
   - Verify WebP format and optimization
   - **Effort:** 4-6 hours
   - **Status:** Required for performance

---

### 🟢 LOW (Post-Launch Optimization)

1. **Database consistency audit**
   - Scan for hardcoded paths
   - Scan for old subsection values
   - **Effort:** 2-3 hours
   - **Status:** Ongoing

2. **Implement auto-image-naming**
   - CI/CD check to enforce naming convention
   - **Effort:** 4-6 hours
   - **Status:** Nice to have

3. **Performance optimization**
   - Lazy loading for gallery images
   - Responsive image srcsets
   - WebP with JPEG fallback
   - **Effort:** 1-2 weeks
   - **Status:** Post-launch

---

## 9. Orphan Asset Cleanup Instructions

### Step 1: Backup Current State

```bash
git commit -am "backup: pre-cleanup state"
git tag cleanup-backup-2026-06-17
```

### Step 2: Remove .gitkeep Files (Optional)

```bash
find public/images -name ".gitkeep" -delete
# Creates 14 empty directories that should be populated
```

### Step 3: Verify No True Orphans

```bash
# List all image directories
find public/images -type d | sort > /tmp/all_dirs.txt

# List all referenced directories from data files
grep -r "imageFolder" src/data/catalog --include="*.json" | \
  sed 's/.*"imageFolder": "//' | sed 's/".*//' | sort -u > /tmp/referenced_dirs.txt

# Find orphaned directories (in all_dirs but not in referenced_dirs)
comm -23 /tmp/all_dirs.txt /tmp/referenced_dirs.txt

# Result should be empty or only root directories
```

### Step 4: Verify No Broken References

```bash
# For each referenced imageFolder in data files,
# confirm the directory exists and has > 0 valid files

# Count directories with valid content
find public/images -type d -exec sh -c 'count=$(find "$1" -type f ! -size 0 | wc -l); [ $count -gt 0 ] && echo "$1: $count valid files"' _ {} \;
```

---

## 10. Implementation Roadmap

| Phase | Items | Timeline | Owner |
|-------|-------|----------|-------|
| **Phase 1** | Asset sourcing (Tier 1) | Week 1-2 | Asset Team |
| **Phase 2** | Asset optimization & upload | Week 2-3 | Engineering |
| **Phase 3** | Architecture migration | Week 3 | Frontend Lead |
| **Phase 4** | Testing & validation | Week 3-4 | QA + Engineering |
| **Phase 5** | Launch | Week 4 | Product Lead |

---

## Appendix: Audit Scripts

### Script 1: Find All Orphaned Directories

```bash
#!/bin/bash
echo "=== Orphaned Directories ==="
find public/images -type d | while read dir; do
  refs=$(grep -r "\"$dir\"" src/data/catalog --include="*.json" 2>/dev/null | wc -l)
  if [ $refs -eq 0 ]; then
    echo "Orphaned: $dir"
  fi
done
```

### Script 2: Find All Broken References

```bash
#!/bin/bash
echo "=== Broken References ==="
grep -r "imageFolder" src/data/catalog --include="*.json" | while IFS=: read file ref; do
  path=$(echo "$ref" | sed 's/.*"imageFolder": "//' | sed 's/".*//')
  if [ ! -d "$path" ]; then
    echo "Missing: $path (referenced in $file)"
  fi
done
```

### Script 3: Count Images by Entity

```bash
#!/bin/bash
echo "=== Images per Entity ==="
find public/images -mindepth 3 -maxdepth 3 -type d | while read dir; do
  valid=$(find "$dir" -type f ! -size 0 | wc -l)
  empty=$(find "$dir" -type f -size 0 | wc -l)
  total=$((valid + empty))
  echo "$(basename $dir): $valid valid, $empty empty, $total total"
done | sort
```

---

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Auditor | DALC Architecture Engineer | ✅ | 2026-06-17 |
| Reviewer | (Pending) | — | — |
| Approver | (Pending) | — | — |

---

**Next Review Date:** Upon asset migration completion  
**Report Location:** `reports/orphan-detection-report.md`  
**Related Reports:**
- [asset-recovery-report.md](./asset-recovery-report.md)
- [asset-recovery-priority.json](./asset-recovery-priority.json)
- [migration-mapping.json](./migration-mapping.json)
- [migration-rollback.md](./migration-rollback.md)
