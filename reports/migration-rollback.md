# DALC Architecture Migration - Rollback Procedures

**Report Date:** 2026-06-17  
**Rollback Author:** DALC Architecture Migration Engineer  
**Status:** PRE-DEPLOYMENT (Ready for use if needed)

---

## Executive Summary

This document provides comprehensive rollback procedures for the DALC vertical migration (old → new slug mapping). Use this if:

- ❌ Post-deployment errors occur
- ❌ SEO/conversion metrics drop unexpectedly
- ❌ Critical broken links detected
- ❌ Data integrity issues found
- ❌ Production incident requiring immediate reversal

**Estimated Rollback Time:** 5-15 minutes (code) + 30 minutes (validation)  
**Service Downtime:** 2-5 minutes (during deployment rollback)

---

## Pre-Rollback Checklist

Before rolling back, verify:

- [ ] All stakeholders notified
- [ ] Production incident documented
- [ ] Backup commit hash recorded: `git log --oneline | head -5`
- [ ] Current state captured: `git status` + `git diff`
- [ ] Team prepared for testing

---

## Quick Rollback (< 5 minutes)

### Step 1: Checkout Pre-Migration State

```bash
# Identify the backup commit/tag created before migration
git tag | grep migration

# Checkout the backup
git checkout migration-backup-2026-06-17

# OR by commit hash
git checkout abc1234def567890  # Update with actual commit hash
```

### Step 2: Verify State

```bash
# Confirm directories restored
ls -la public/images/experiences/ | grep -E "marine|aerialAdrenaline|desertAdventure|ticketsCulture"
ls -la public/images/cars/ | grep luxuryLeisure
ls -la src/data/catalog/experiences/ | grep -E "marine|aerialAdrenaline|desertAdventure|ticketsCulture"
ls -la src/data/catalog/cars/ | grep luxuryLeisure

# Confirm build clean
npm run build
npx tsc --noEmit
npm run lint
```

### Step 3: Deploy Rollback

```bash
# Push rollback commit
git push origin main

# OR force push (only if necessary and approved)
git push origin main --force-with-lease
```

### Step 4: Clear Caches

```bash
# Clear Next.js build cache
rm -rf .next

# Clear CDN cache (if applicable)
# Contact infrastructure team or use:
# aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"

# Clear browser cache headers
# Next.js will handle on redeployment
```

---

## Step-by-Step Rollback Instructions

### For Development/Staging Environment

```bash
# 1. Switch to rollback branch
git checkout migration-backup-2026-06-17

# 2. Verify everything looks good
git log --oneline -5
git status

# 3. Install dependencies (if environment changed)
npm install

# 4. Verify build
npm run build

# 5. Test locally
npm run dev

# 6. Verify old paths accessible:
#    - http://localhost:3000/experiences?subsection=ticketsCulture
#    - http://localhost:3000/experiences/aerialAdrenaline/helicopter-tour-12min
#    - Public images load from old paths

# 7. Run type check and lint
npx tsc --noEmit
npm run lint

# 8. Deploy to staging
git push origin staging

# Monitor logs for errors
```

### For Production Environment

```bash
# 1. Create incident ticket
# Create a link to this document in incident tracking system

# 2. Notify on-call team
# Slack: #incidents channel

# 3. Prepare rollback
git checkout migration-backup-2026-06-17

# 4. Stage deployment
git push origin main --force-with-lease

# 5. Run pre-deployment checks
npm run build
npx tsc --noEmit
npm run lint

# 6. Deploy to production
# Use your standard deployment process
# Example: vercel deploy --prod

# 7. Monitor metrics
#    - Error rate (should drop to normal)
#    - 404 rate (should return to baseline)
#    - Page load times (should normalize)
#    - Conversion rates (may spike back up)

# 8. Document rollback
# Post in #incidents: "Rolled back to migration-backup-2026-06-17 at [TIME]"
```

---

## Validation After Rollback

### 1. Link Validation

```bash
# Check that old paths work
curl -I https://dalc.ae/experiences?subsection=ticketsCulture
curl -I https://dalc.ae/experiences/marine/dhow-cruise-khasab
curl -I https://dalc.ae/cars/carRental/luxuryLeisure/ferrari-sf90

# Should return 200 OK (not 404 or 301)
```

### 2. Image Verification

```bash
# Verify images load from old paths
curl -I https://dalc.ae/images/experiences/ticketsCulture/dubai-city-tour/1.jpg
curl -I https://dalc.ae/images/cars/luxuryLeisure/ferrari-sf90/1.jpg
curl -I https://dalc.ae/images/experiences/marine/dhow-cruise-khasab/1.jpg

# Should return 200 OK with Content-Length > 0
```

### 3. Data Integrity

```bash
# Verify data files read correctly
node -e "console.log(require('./src/data/catalog/experiences/ticketsCulture/dubai-city-tour.json').subsection)"
# Should output: ticketsCulture

node -e "console.log(require('./src/data/catalog/cars/luxuryLeisure/ferrari-sf90.json').subsection)"
# Should output: luxuryLeisure
```

### 4. Functional Testing

- [ ] Browse to `/experiences` page
- [ ] Filter by `ticketsCulture` - should show attractions
- [ ] Browse to `/cars` page
- [ ] Filter by `luxuryLeisure` - should show luxury cars
- [ ] Check `/yachts` page - should show yacht experiences with `marine` subsection
- [ ] Verify all images display correctly
- [ ] Test search functionality
- [ ] Verify related experiences show correctly

### 5. Performance Metrics

Monitor for 1 hour post-rollback:

| Metric | Expected | Action if Different |
|--------|----------|---------------------|
| Error Rate | < 0.5% | Investigate error logs |
| 404 Rate | 0-1% | Check link crawler results |
| Page Load (p95) | < 3s | Check CDN/image optimization |
| Conversion Rate | Baseline ± 2% | Analysis needed if >2% deviation |
| API Response Time | < 200ms | Check database performance |

---

## File-by-File Rollback (If Selective Rollback Needed)

If only partial rollback is needed:

```bash
# Rollback specific data files
git checkout migration-backup-2026-06-17 -- src/data/catalog/experiences/ticketsCulture/

# Rollback specific image directories (restore from backup)
# Requires separate backup system - consult with DevOps

# Rollback code changes only
git checkout migration-backup-2026-06-17 -- src/

# Then carefully re-add changes
git status
git add -p  # Interactive staging
```

**⚠️ WARNING:** Selective rollback is risky and can lead to inconsistent state. Full rollback is preferred.

---

## Reverse Migration (New → Old)

If decision is made to **stay** on old verticals:

```bash
# Simply keep the migration-backup-2026-06-17 state
# The migration commits should be reverted in history
# Branch name suggestion: main-legacy-verticals

git checkout migration-backup-2026-06-17
git checkout -b main-legacy-verticals
git push origin main-legacy-verticals
```

---

## Database/Cache Rollback

If data was cached or persisted:

### Redis Cache

```bash
# Clear all caches
redis-cli FLUSHDB

# OR specific keys
redis-cli DEL "experiences:*:ticketsCulture"
redis-cli DEL "cars:*:luxuryLeisure"

# Verify
redis-cli DBSIZE
```

### Browser Cache

Automatic on redeployment (Cache-Control headers change).

### CDN Cache

```bash
# Purge CDN cache for affected paths
# Example (AWS CloudFront):
aws cloudfront create-invalidation \
  --distribution-id E123ABCDEF456 \
  --paths "/images/experiences/ticketsCulture/*" \
  --paths "/images/cars/luxuryLeisure/*" \
  --paths "/images/experiences/marine/*" \
  --paths "/images/experiences/aerialAdrenaline/*" \
  --paths "/images/experiences/desertAdventure/*"
```

---

## Incident Triage

### If Error Pattern is "404 Not Found"

```bash
# Check which paths are returning 404
# Review recent requests in access logs
tail -100 /var/log/nginx/access.log | grep " 404 "

# These will be new paths
# Either:
# A. Complete the migration properly and test thoroughly
# B. Rollback to old verticals (use this procedure)
```

### If Error Pattern is "Broken Images"

```bash
# Images are likely still at old paths
# Need to restore image directories or add redirects

# Check if old image directories exist
ls -la public/images/experiences/ticketsCulture/
# If not found, need CDN/backup restoration

# Quick fix: Add image path redirects in next.config.js
# Permanent fix: Rollback or migrate images properly
```

### If Error Pattern is "Data Missing"

```bash
# Check data file integrity
find src/data/catalog -type f -name "*.json" | wc -l
# Should match pre-migration count

# Validate JSON syntax
find src/data/catalog -type f -name "*.json" -exec jsonlint {} \;
```

---

## Post-Rollback Actions

1. **Document Root Cause**
   - What specifically failed?
   - Why wasn't it caught in testing?
   - What's the permanent fix?

2. **Update Migration Plan**
   - Add new test cases based on failure
   - Improve validation procedures
   - Add staging duration (minimum 24 hours)

3. **Team Debrief**
   - Schedule postmortem within 24 hours
   - Discuss what went wrong
   - Assign action items for improvement

4. **Prepare Re-Migration**
   - Fix issues identified in rollback
   - Schedule for non-peak hours
   - Add additional monitoring
   - Extend testing window

---

## Communication Templates

### Internal Slack Notification

```
🚨 INCIDENT: Architecture migration rollback initiated

Rollback: Old vertical slugs (ticketsCulture, marine, etc.)
Rollback Commit: migration-backup-2026-06-17
Status: IN PROGRESS

Estimated Impact:
- 2-5 minute deployment
- Service fully available

Next Steps:
1. Validation (5-10 min)
2. Root cause analysis
3. Schedule re-migration

Progress updates in #incidents
```

### Customer-Facing (If Applicable)

```
We're experiencing a temporary issue and are rolling back recent changes.
Service should be fully restored in 5 minutes.

Thank you for your patience!
```

---

## Automation & Monitoring

### Automated Rollback Trigger

Consider implementing auto-rollback if:
- Error rate > 5% for 2 consecutive minutes
- 404 rate > 10%
- API response time > 5s p95

```bash
# Example monitoring script (pseudo-code)
while true; do
  error_rate=$(check_error_rate)
  if [ "$error_rate" -gt 5 ]; then
    notify_team "High error rate detected: $error_rate%"
    execute_rollback "migration-backup-2026-06-17"
    break
  fi
  sleep 60
done
```

### Monitoring Dashboards

Set up alerts for:
- [ ] 404 rate spike
- [ ] Error rate > 2%
- [ ] Page load time > 3s
- [ ] Conversion rate drop > 5%

---

## Support & Escalation

| Issue | Owner | Contact | Response Time |
|-------|-------|---------|----------------|
| Code issues | Engineering Lead | Slack | 5 min |
| Infrastructure | DevOps | On-call page | 5 min |
| Database issues | Database Admin | On-call page | 10 min |
| Customer impact | Product Lead | Slack | 15 min |

---

## Appendix: Git Commands Reference

```bash
# View migration commits
git log --oneline | grep -i migration

# View migration changes
git diff migration-backup-2026-06-17..HEAD

# Check what changed in specific file
git diff migration-backup-2026-06-17..HEAD -- src/data/

# Revert specific commit (alternative to full rollback)
git revert abc1234def567890 -m 1

# Force rollback (use with caution!)
git reset --hard migration-backup-2026-06-17
git push origin main --force-with-lease
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-17  
**Review Date:** Before every deployment  
**Owner:** DALC Architecture Team
