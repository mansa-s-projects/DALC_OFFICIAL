# DALC Phase 1: Emergency Swarm Deploy Prompt

**Copy this entire prompt into Claude Code and execute.**

---

## **YOU ARE NOW A SWARM TEAM LEAD**

Your mission: Fix DALC project in parallel across 5 teams.

**Teams:**
1. **BACKEND TEAM** — API routes, Supabase integration
2. **FRONTEND TEAM** — Pages, real-time subscriptions
3. **STATE TEAM** — Zustand stores, type definitions
4. **DATABASE TEAM** — Migrations, schema, RLS policies
5. **CONFIG TEAM** — env vars, build config, dependencies

Each team works in parallel. Report status after each step.

---

## **PHASE 0: ENVIRONMENT SETUP**

```bash
# First, run these commands:
pwd
ls -la
node --version
npm --version
git status
```

Then report:
- Current directory ✓/✗
- Project root visible ✓/✗
- Node/npm installed ✓/✗
- Git repo initialized ✓/✗

---

## **PHASE 1: PARALLEL TEAM DEPLOYMENT**

### **TEAM 1: BACKEND (API Routes)**

```bash
# Step 1: Create backend folder structure
mkdir -p src/app/api/requests/\[id\]

# Step 2: Check if route.ts exists
ls -la src/app/api/requests/route.ts
ls -la src/app/api/requests/\[id\]/

# Step 3: List what's in requests API folder
find src/app/api/requests -type f -name "*.ts"

# Step 4: Show current requests POST endpoint
cat src/app/api/requests/route.ts | head -50

# REPORT BACK:
# - Does [id]/route.ts exist? Y/N
# - Does existing POST route.ts work? Y/N
# - Any TypeScript errors in requests API? List them
```

### **TEAM 2: FRONTEND (Pages)**

```bash
# Step 1: Create frontend folder structure
mkdir -p src/app/my-requests/\[id\]

# Step 2: Check existing pages
ls -la src/app/my-requests/
ls -la src/app/my-requests/\[id\]/

# Step 3: List all files in my-requests
find src/app/my-requests -type f

# Step 4: Check if page.tsx exists (the request detail page)
test -f src/app/my-requests/\[id\]/page.tsx && echo "EXISTS" || echo "MISSING"

# REPORT BACK:
# - Does [id]/page.tsx exist? Y/N
# - Is src/app/my-requests/page.tsx (list) working? Y/N
# - Any import errors? List them
```

### **TEAM 3: STATE (Zustand Store)**

```bash
# Step 1: Check store structure
ls -la src/store/

# Step 2: Verify useAppStore.ts exists
cat src/store/useAppStore.ts | head -100

# Step 3: Check if RequestsSlice is already imported
grep -n "RequestsSlice" src/store/useAppStore.ts || echo "NOT FOUND"

# Step 4: Check if requests.ts exists
test -f src/store/requests.ts && echo "requests.ts EXISTS" || echo "requests.ts MISSING"

# REPORT BACK:
# - Does useAppStore.ts import RequestsSlice? Y/N
# - Does requests.ts exist? Y/N
# - Any Zustand version issues? List them
```

### **TEAM 4: DATABASE (Migrations)**

```bash
# Step 1: Check migrations folder
ls -la supabase/migrations/

# Step 2: List all SQL files
find supabase/migrations -name "*.sql" -type f

# Step 3: Check if mission control migration exists
test -f supabase/migrations/add_mission_control_tables.sql && echo "EXISTS" || echo "MISSING"

# Step 4: Verify Supabase config
test -f supabase/config.toml && echo "config.toml EXISTS" || echo "config.toml MISSING"

# REPORT BACK:
# - Is add_mission_control_tables.sql in migrations? Y/N
# - Has migration been applied? (check db status)
```

### **TEAM 5: CONFIG (Dependencies & Env)**

```bash
# Step 1: Check package.json for required deps
grep -E "supabase|zustand|next" package.json

# Step 2: Check if .env.local exists
test -f .env.local && echo ".env.local EXISTS" || echo ".env.local MISSING"

# Step 3: Show required env vars
cat .env.local 2>/dev/null || echo "FILE MISSING"

# Step 4: Check Node modules
test -d node_modules && echo "node_modules EXISTS" || echo "node_modules MISSING"

# REPORT BACK:
# - Is @supabase/supabase-js installed? Y/N
# - Is zustand installed? Y/N
# - Does .env.local have SUPABASE vars? Y/N
```

---

## **PHASE 2: INTEGRATION FIXES (Sequential)**

After all teams report, run these fixes in order:

### **FIX 1: Backend Integration**

```bash
# Check if GET/PATCH endpoints need to be added
echo "Checking API route completeness..."

# Verify /api/requests/[id]/route.ts exists and has GET + PATCH
test -f src/app/api/requests/\[id\]/route.ts && cat src/app/api/requests/\[id\]/route.ts | grep "export async function GET" && echo "✓ GET exists" || echo "✗ GET missing"

test -f src/app/api/requests/\[id\]/route.ts && cat src/app/api/requests/\[id\]/route.ts | grep "export async function PATCH" && echo "✓ PATCH exists" || echo "✗ PATCH missing"

# Check for import errors
npx tsc --noEmit src/app/api/requests/\[id\]/route.ts 2>&1 || echo "TypeScript errors found"
```

### **FIX 2: Frontend Integration**

```bash
# Verify real-time page imports
echo "Checking frontend imports..."

grep -n "from '@/lib/supabase'" src/app/my-requests/\[id\]/page.tsx && echo "✓ Supabase imported" || echo "✗ Missing import"
grep -n "from '@/types'" src/app/my-requests/\[id\]/page.tsx && echo "✓ Types imported" || echo "✗ Missing import"
grep -n "useEffect" src/app/my-requests/\[id\]/page.tsx && echo "✓ Real-time hooks present" || echo "✗ Missing hooks"

# Check for TypeScript errors
npx tsc --noEmit src/app/my-requests/\[id\]/page.tsx 2>&1 || echo "TypeScript errors found"
```

### **FIX 3: Store Integration**

```bash
# Verify RequestsSlice is properly exported
echo "Checking store exports..."

grep -n "export interface RequestsSlice" src/store/requests.ts && echo "✓ Interface exported" || echo "✗ Missing export"
grep -n "export const createRequestsSlice" src/store/requests.ts && echo "✓ Creator exported" || echo "✗ Missing export"

# Check useAppStore imports it
grep -n "RequestsSlice" src/store/useAppStore.ts && echo "✓ Imported in main store" || echo "✗ Not imported"

# Verify no type conflicts
npx tsc --noEmit src/store/*.ts 2>&1 || true
```

### **FIX 4: Database Readiness**

```bash
# Check Supabase CLI is installed
which supabase || echo "Supabase CLI not installed - run: npm install -g supabase"

# Show migration status
echo "Migration files:"
ls -lh supabase/migrations/*.sql

# Show Supabase config
echo "Supabase project:"
grep -A 2 "^\[project\]" supabase/config.toml || echo "config.toml not configured"
```

### **FIX 5: Build Check**

```bash
# Run full build to catch all errors
echo "Running Next.js build check..."
npm run build 2>&1 | tee build.log

# Show any errors
grep -i "error" build.log || echo "✓ No build errors found"

# Show warnings
grep -i "warning" build.log | head -10 || echo "✓ No warnings"
```

---

## **PHASE 3: AUTO-FIX SCRIPT**

If any team reports missing files, run this:

```bash
# AUTO-FIX: Copy files from outputs to correct locations
echo "Downloading files from outputs..."

# Download and place backend route
curl -s https://mnt/user-data/outputs/route.ts -o src/app/api/requests/\[id\]/route.ts 2>/dev/null || echo "⚠ Manual copy needed: route.ts"

# Download and place frontend page
curl -s https://mnt/user-data/outputs/page.tsx -o src/app/my-requests/\[id\]/page.tsx 2>/dev/null || echo "⚠ Manual copy needed: page.tsx"

# Download and place store
curl -s https://mnt/user-data/outputs/requests.ts -o src/store/requests.ts 2>/dev/null || echo "⚠ Manual copy needed: requests.ts"

# Download and place notifications
curl -s https://mnt/user-data/outputs/notifications.ts -o src/lib/notifications.ts 2>/dev/null || echo "⚠ Manual copy needed: notifications.ts"

# Download migration
curl -s https://mnt/user-data/outputs/add_mission_control_tables.sql -o supabase/migrations/add_mission_control_tables.sql 2>/dev/null || echo "⚠ Manual copy needed: add_mission_control_tables.sql"

echo "Files placed. Verify:"
find src -path "*requests*" -name "*.ts" | grep -E "(route|page|store)" | sort
```

---

## **PHASE 4: VALIDATION & TEST**

```bash
# Step 1: Verify all files in place
echo "=== FILE VALIDATION ==="
test -f src/app/api/requests/\[id\]/route.ts && echo "✓ API route" || echo "✗ MISSING API route"
test -f src/app/my-requests/\[id\]/page.tsx && echo "✓ Frontend page" || echo "✗ MISSING Frontend page"
test -f src/lib/notifications.ts && echo "✓ Notifications" || echo "✗ MISSING Notifications"
test -f src/store/requests.ts && echo "✓ Store" || echo "✗ MISSING Store"
test -f supabase/migrations/add_mission_control_tables.sql && echo "✓ Migration" || echo "✗ MISSING Migration"

# Step 2: Type check
echo -e "\n=== TYPE CHECK ==="
npx tsc --noEmit 2>&1 | grep -i error | head -20 || echo "✓ No TypeScript errors"

# Step 3: Lint check
echo -e "\n=== LINT CHECK ==="
npm run lint 2>&1 | grep -i error | head -10 || echo "✓ No lint errors"

# Step 4: Build test
echo -e "\n=== BUILD TEST ==="
npm run build 2>&1 | tail -5

echo -e "\n✅ VALIDATION COMPLETE"
```

---

## **PHASE 5: DEPLOYMENT READINESS**

```bash
# Step 1: Create git commit
git add -A
git commit -m "Phase 1: Mission Control - Real-time Request Tracking"

# Step 2: Show what's staged
git status

# Step 3: Show changes
git diff HEAD~1 --stat || git log --oneline -1

# Step 4: Environment check for deployment
echo "Ready to deploy? Check:"
test -f .env.local && echo "✓ .env.local exists" || echo "✗ Need .env.local"
test -f .env.example && echo "✓ .env.example exists (for reference)" || echo "ℹ Can create .env.example"

# Step 5: Next steps
echo -e "\n=== NEXT STEPS ==="
echo "1. Run Supabase migration: supabase db push"
echo "2. Test locally: npm run dev"
echo "3. Visit: http://localhost:3000/my-requests/[test-id]"
echo "4. Deploy to production when ready"
```

---

## **EMERGENCY OVERRIDE: FULL RESET & REBUILD**

If everything is broken, run this:

```bash
# Nuclear option - start fresh
echo "WARNING: This will reset local changes"
read -p "Continue? (y/n)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Clean install
  rm -rf node_modules
  npm install
  
  # Verify structure
  mkdir -p src/app/api/requests/\[id\]
  mkdir -p src/app/my-requests/\[id\]
  mkdir -p src/lib
  mkdir -p src/store
  mkdir -p supabase/migrations
  
  # Reset build
  npm run build
  
  echo "✓ Project reset. Now copy files manually."
fi
```

---

## **FINAL CHECKLIST**

```bash
# Run this to verify everything is ready:
echo "=== DALC PHASE 1 READINESS CHECK ==="
echo ""
echo "Backend:"
test -f src/app/api/requests/\[id\]/route.ts && echo "  ✓ API route" || echo "  ✗ API route"
echo ""
echo "Frontend:"
test -f src/app/my-requests/\[id\]/page.tsx && echo "  ✓ Detail page" || echo "  ✗ Detail page"
echo ""
echo "State:"
test -f src/store/requests.ts && echo "  ✓ Requests store" || echo "  ✗ Requests store"
grep "RequestsSlice" src/store/useAppStore.ts >/dev/null && echo "  ✓ Store integrated" || echo "  ✗ Store not integrated"
echo ""
echo "Services:"
test -f src/lib/notifications.ts && echo "  ✓ Notifications" || echo "  ✗ Notifications"
echo ""
echo "Database:"
test -f supabase/migrations/add_mission_control_tables.sql && echo "  ✓ Migration ready" || echo "  ✗ Migration missing"
echo ""
echo "Build:"
npm run build 2>&1 | grep -q "compiled" && echo "  ✓ Build success" || echo "  ✗ Build failed"
echo ""
echo "=== END CHECK ==="
```

---

## **WHEN YOU RUN THIS:**

1. **Copy the entire prompt**
2. **Open Claude Code**
3. **Open terminal**
4. **cd into your DALC project root**
5. **Paste prompt as instructions**
6. **Claude will execute all phases in parallel/sequence**
7. **Report back any blockers**

**Expected output: All 5 teams report status, then automated fixes run, then validation passes.**

---

## **GO CODE MODE: MASTER CONTROL SEQUENCE**

Once you paste this, follow up with:

> "Execute full swarm deployment. Run all 5 teams in parallel first (Phases 0-1), then sequential fixes (Phase 2), then validation (Phase 4), then ready check. Show me status after each phase. Auto-fix any missing files. Tell me when Phase 1 is complete and ready to test."
