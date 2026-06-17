# Quick Start - Copy & Paste Commands

## On Your Local Machine

### Verify Setup (30 seconds)
```bash
python --version
cd c:\WORKSPACE\ACTIVE\DALC_OFFICIAL
dir scripts/image-recovery.py
```

### Run All Tiers (90 minutes)
```bash
python scripts/image-recovery.py --tier 1 && python scripts/image-recovery.py --tier 2 && python scripts/image-recovery.py --tier 3
```

Or run individually:
```bash
python scripts/image-recovery.py --tier 1
# Wait for "✅ Recovered: 174"

python scripts/image-recovery.py --tier 2
# Wait for "✅ Recovered: 21"

python scripts/image-recovery.py --tier 3
# Wait for "✅ Recovered: ~200"
```

### Verify Everything Downloaded (60 seconds)
```bash
# Should show ~396+ files
Get-ChildItem public\images -Recurse -File | Measure-Object

# Should show NO output (no 0-byte files)
Get-ChildItem public\images -Recurse -File | Where-Object {$_.Length -eq 0}

# Should show > 500MB total
Get-ChildItem public\images -Recurse -File | Measure-Object -Sum -Property Length
```

### Push Changes Back (2 minutes)
```bash
git add public/images
git commit -m "feat: populate 396 real images from official sources (Tier 1, 2, 3)"
git push origin codex/godmode-no-errors-seo-metadata
```

---

## That's It!

Once pushed, return to Claude Code and I will:
- ✅ Convert all JPGs → WebP
- ✅ Generate metadata  
- ✅ Verify build
- ✅ Report final status

**Total time with me:** <15 minutes  
**Total time for full mission:** ~2 hours end-to-end
