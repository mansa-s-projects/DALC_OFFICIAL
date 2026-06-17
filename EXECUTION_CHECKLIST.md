# Local Execution Checklist

## Before You Start
- [ ] You have internet access on your local machine
- [ ] Python 3.7+ installed (`python --version`)
- [ ] You're in project root: `c:\WORKSPACE\ACTIVE\DALC_OFFICIAL`
- [ ] `scripts/image-recovery.py` exists
- [ ] `scripts/image-sourcing-manifest.json` exists

## During Execution

### Tier 1: Entertainment, Cars, Yachts (174 images)
```bash
python scripts/image-recovery.py --tier 1
```
- [ ] Script started successfully
- [ ] Script ran without hanging
- [ ] Expected output: "✅ Recovered: 174"
- [ ] Check: `Get-ChildItem public\images\experiences\entertainment -Recurse -File | Measure-Object` shows files

### Tier 2: Aerial, Desert, Water (21 images)
```bash
python scripts/image-recovery.py --tier 2
```
- [ ] Script completed: "✅ Recovered: 21"
- [ ] Check: `Get-ChildItem public\images\experiences\aerial -Recurse -File | Measure-Object` shows files

### Tier 3: Concierge, Move to Dubai, Services (~200 images)
```bash
python scripts/image-recovery.py --tier 3
```
- [ ] Script completed: "✅ Recovered: ~200"
- [ ] Check: `Get-ChildItem public\images\experiences\concierge -Recurse -File | Measure-Object` shows files

## Verification
```bash
# Check total count
Get-ChildItem public\images -Recurse -File | Measure-Object
```
- [ ] Count is approximately 396+ files

```bash
# Check for 0-byte files (should be empty result)
Get-ChildItem public\images -Recurse -File | Where-Object {$_.Length -eq 0}
```
- [ ] No 0-byte files found

```bash
# Check total download size
Get-ChildItem public\images -Recurse -File | Measure-Object -Sum -Property Length
```
- [ ] TotalSize > 500MB (indicates real images, not empty placeholders)

## After Download

### Option 1: Git Commit & Push (Preferred)
```bash
git add public/images
git commit -m "feat: populate 396 real images from official sources"
git push origin codex/godmode-no-errors-seo-metadata
```
- [ ] `git add` completed successfully
- [ ] `git commit` created new commit
- [ ] `git push` completed (may take 1-2 min for large file upload)

### Option 2: Manual Sync
- [ ] Copy entire `public/images` folder
- [ ] Ready to share with Claude Code system

## Final Status
- [ ] All 396 images downloaded
- [ ] No 0-byte files
- [ ] Changes committed/synced
- [ ] Ready for Claude Code to process (conversion, metadata, build)

---

## If Something Goes Wrong

**Script hangs:**
- Abort: Ctrl+C
- Wait a few minutes
- Retry: `python scripts/image-recovery.py --tier 1`

**0-byte files created:**
```bash
Get-ChildItem public\images -Recurse -File | Remove-Item -Force
python scripts/image-recovery.py --tier 1  # Retry
```

**Network error:**
- Check internet connection
- Retry the failed tier
- If persistent, run just one category: `python scripts/image-recovery.py --tier 1 --category entertainment`

---

## Expected Timeline
- Tier 1: ⏱️ 30-40 min
- Tier 2: ⏱️ 10-15 min  
- Tier 3: ⏱️ 20-30 min
- Verify: ⏱️ 5 min
- Push: ⏱️ 2 min

**Total: ~70-100 minutes**

✅ Then Claude Code completes remaining phases (conversion, metadata, build) in <15 min
