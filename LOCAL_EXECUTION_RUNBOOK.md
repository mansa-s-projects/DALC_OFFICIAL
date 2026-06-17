# Local Image Recovery Runbook

**Duration:** ~1.5 hours total  
**Location:** Your local machine (must have internet)  
**Output:** `public/images/` folder with 396 real images

---

## Phase 1: Setup (5 min)

### Prerequisites Check
```bash
# Verify Python is installed and accessible
python --version
# Expected: Python 3.7+

# Verify you're in the project root
cd c:\WORKSPACE\ACTIVE\DALC_OFFICIAL
dir scripts/image-recovery.py
# Expected: File exists
```

### Prepare for Execution
```bash
# Create reports directory if missing
mkdir reports -Force

# Verify manifest exists
dir scripts/image-sourcing-manifest.json
```

---

## Phase 2: Execute Tier 1 (30-40 min)

**Entertainment (152 images) + Luxury Cars (18 images) + Yachts (4 images) = 174 images**

```bash
# In PowerShell or Command Prompt, run:
python scripts/image-recovery.py --tier 1

# Expected output:
# ✅ Created directory: C:\WORKSPACE\ACTIVE\DALC_OFFICIAL\public\images\experiences\entertainment\abu-dhabi-city-tour-standard
# ⬇️  hero.jpg: downloading... ✅
# ⬇️  gallery-1.jpg: downloading... ✅
# ... (many more images)
# 📊 Report saved: reports\asset-recovery-execution.json
#    ✅ Recovered: 174
#    ❌ Failed: 0
```

**Time estimate:** 30-40 minutes (depends on internet speed)

---

## Phase 3: Execute Tier 2 (10-15 min)

**Aerial & Adrenaline (9 images) + Desert Adventures (9 images) + Water Activities (3 images) = 21 images**

```bash
python scripts/image-recovery.py --tier 2

# Expected output:
# ✅ Recovered: 21
# ❌ Failed: 0
```

**Time estimate:** 10-15 minutes

---

## Phase 4: Execute Tier 3 (20-30 min)

**Concierge Services (4 images) + Move to Dubai (4 images) + Support Services (~192 images) = ~200 images**

```bash
python scripts/image-recovery.py --tier 3

# Expected output:
# ✅ Recovered: ~200
# ❌ Failed: 0
```

**Time estimate:** 20-30 minutes

---

## Phase 5: Verify Downloads (5 min)

```bash
# Check total files downloaded
Get-ChildItem public\images -Recurse -File | Measure-Object
# Expected: Count = 396+ (including subdirectories)

# Check for 0-byte files
Get-ChildItem public\images -Recurse -File | Where-Object {$_.Length -eq 0}
# Expected: No output (all files have content)

# Check total size
Get-ChildItem public\images -Recurse -File | Measure-Object -Sum -Property Length
# Expected: TotalSize > 500MB
```

---

## Phase 6: Push Changes Back (2 min)

Once all tiers download successfully:

```bash
# Stage all images
git add public/images

# Commit with message
git commit -m "feat: populate 396 real images from official sources (Tier 1, 2, 3)"

# Push to remote
git push origin codex/godmode-no-errors-seo-metadata
```

Or if you prefer not to commit yet:
```bash
# Just copy the public/images folder and let Claude Code sync it
# Copy: C:\WORKSPACE\ACTIVE\DALC_OFFICIAL\public\images\
# The system will detect changes when you return to Claude Code
```

---

## Troubleshooting

### Script hangs or is very slow
- **Cause:** Network latency or rate limiting
- **Fix:** Wait 5-10 minutes. If still hanging, abort with Ctrl+C and run again

### "Failed" count > 0
- **Check:** Which entities failed?
- **Fix:** Rerun just that tier: `python scripts/image-recovery.py --tier 1 --category entertainment`
- **Or:** Manually download from [scripts/image-sourcing-manifest.json](scripts/image-sourcing-manifest.json)

### Missing `requests` library
```bash
# Install it
pip install requests
# Then retry
python scripts/image-recovery.py --tier 1
```

### Files are 0 bytes
- **Cause:** Network didn't connect properly
- **Fix:** Delete empty files and retry
```bash
Get-ChildItem public\images -Recurse -File | Remove-Item -Force
python scripts/image-recovery.py --tier 1
```

---

## After Download Complete ✅

Once you push changes back to this repo:

I will **immediately**:
1. ✅ Convert all JPGs → WebP (5 min)
2. ✅ Generate info.json metadata for all entities (5 min)
3. ✅ Run npm run build & verify (2 min)
4. ✅ Hit all checkpoints and report final count

**Final state:** 396 empty files → **0 empty files** → Production ready

---

## Quick Reference

```bash
# One-liner to run all tiers sequentially
python scripts/image-recovery.py --tier 1 && python scripts/image-recovery.py --tier 2 && python scripts/image-recovery.py --tier 3
```

---

**Questions?** Check the sourcing manifest at `scripts/image-sourcing-manifest.json` for details on each entity's image sources.

**Timeline:**
- Phase 1 (Setup): 5 min ⏱️
- Phase 2 (Tier 1): 30-40 min 📸
- Phase 3 (Tier 2): 10-15 min 📸
- Phase 4 (Tier 3): 20-30 min 📸
- Phase 5 (Verify): 5 min ✅
- Phase 6 (Push): 2 min 📤

**Total: ~70-100 minutes**

Then I complete the rest in <15 minutes while you wait.
