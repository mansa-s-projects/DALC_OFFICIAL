# TODO: Move to Dubai (Relocation OS) — Remaining Work

> Priority: 🟡 MEDIUM — Core flow is built, several bugs and gaps remain

---

## Current State

| Page | Route | Status |
|------|-------|--------|
| Intake | `/move-to-dubai/intake` | ✅ Built — ⚠️ back button bug |
| Dashboard | `/move-to-dubai/dashboard` | ✅ Built |
| Documents | `/move-to-dubai/documents` | ✅ Built |
| Cost Estimator | `/move-to-dubai/cost-estimator` | ✅ Built |
| Schooling | `/move-to-dubai/schooling` | ⚠️ May be stub |
| Move to Dubai Hub | `/move-to-dubai` | ✅ Built |

---

## Bug Fixes

### Bug 1: Intake Back Button — 404 Link

**File**: `src/features/move-to-dubai/pages/Intake.tsx`

**Issue**: Back button navigates to `/relocation` which doesn't exist. Correct path is `/move-to-dubai`.

**Fix**:
```tsx
// Find this (approx):
navigate('/relocation')
// or
<Link to="/relocation">

// Replace with:
navigate('/move-to-dubai')
// or
<Link to="/move-to-dubai">
```

Also check `Intake.tsx` for any other `/relocation` references and update them.

---

### Bug 2: Audit All `/relocation` References

Run a global search for the string `/relocation` in the codebase. All occurrences should be updated to `/move-to-dubai`.

Files likely affected:
- `src/features/move-to-dubai/pages/Intake.tsx`
- Any breadcrumb navigation components
- Any hub page "Learn more" links

---

## Feature Tasks

### Task 1: Schooling Page — Build or Stub Clearly

**File**: `src/features/move-to-dubai/pages/Schooling.tsx` (or path equivalent)

**If page exists but is empty**: Build it out per the spec below.
**If page doesn't exist**: Create it and wire the route.

**Schooling Page Spec**:
- Header: "International Schools in Dubai"
- Filter: Area, Curriculum (British, American, IB, French, GEMS Network)
- School card list with: name, curriculum badge, area, fees range, website link
- Data: can be hardcoded initially in `src/data/schools.ts` or from Supabase `schools` table
- Section: "Get School Placement Support" → CTA to `/concierge/request?type=schooling`

---

### Task 2: Workflow Step Automation

The relocation dashboard shows a multi-step workflow. Currently steps are likely static.

**Goal**: Steps should have real trigger actions:

| Step | Trigger |
|------|---------|
| Intake complete | Intake form submitted |
| Visa application | User clicks "Start Visa Application" |
| Bank account | User clicks "Setup Banking" → links to Business vertical |
| School search | User navigates to Schooling page |
| Housing search | User views Stays (villas/residences) |
| Supplier onboarded | Assigned by admin |

**Implementation**:
```sql
-- relocation_steps table (if it doesn't exist):
CREATE TABLE relocation_steps (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES relocation_profiles(id),
  step_key TEXT,  -- 'intake' | 'visa' | 'banking' | etc.
  status TEXT,    -- 'pending' | 'in_progress' | 'completed'
  completed_at TIMESTAMPTZ,
  notes TEXT
);
```

---

### Task 3: Document Upload — Supabase Storage Integration

The Documents page (`/move-to-dubai/documents`) likely shows document types but may not have working upload.

**Integration checklist**:
- [ ] Connect upload button to `supabase.storage.from('relocation-docs').upload(...)`
- [ ] Store file metadata in `relocation_documents` table
- [ ] Show upload progress indicator
- [ ] Show uploaded file list with download link
- [ ] File validation: PDF, JPG, PNG only; max 10MB

**Supabase Storage bucket needed**: `relocation-docs` (private, per-user RLS)

---

### Task 4: Cost Estimator — Dynamic Calculation

The Cost Estimator page likely has interactive sliders/inputs. Ensure:
- [ ] All cost categories are editable (rent, school fees, car, groceries, dining)
- [ ] Monthly vs. annual toggle
- [ ] Exchange rate display (AED / USD / EUR / GBP)
- [ ] "Save my estimate" → stores in `profiles.cost_estimate` JSONB or a dedicated table
- [ ] Share estimate: generate a PDF or link

---

### Task 5: Partner/Referral Network

The Move to Dubai hub should display:
- Trusted partner logos: law firms, relocation agents, schools, movers
- "Work with our partners" CTA
- Partners stored in `suppliers` table with `category = 'relocation_partner'`

---

### Task 6: Relocation Timeline Visualization

Add a visual Gantt-style or vertical timeline on the dashboard showing estimated milestones.

```
Week 1: Intake & Documentation
Week 2-4: Visa Application Processing
Week 3: Housing Search
Month 2: Bank Account Setup
Month 2-3: School Enrollment
Month 3: Move & Settle
```

User can drag milestones to reorder/reschedule (optional, phase 2 feature).

---

### Task 7: Progress Percentage & Completion State

The dashboard should show a clear "X% Complete" progress ring or bar.

- Calculated from: `completed_steps / total_steps * 100`
- When 100%: show a "Your Dubai Setup is Complete" celebration state

---

## Acceptance Criteria

- [ ] Intake back button navigates to `/move-to-dubai` (not 404)
- [ ] All `/relocation` path references updated to `/move-to-dubai`
- [ ] Schooling page exists with school listings
- [ ] Document upload works via Supabase Storage
- [ ] Cost Estimator has all interactive sliders and save functionality
- [ ] Workflow steps reflect actual user progress
- [ ] Dashboard shows accurate progress percentage
- [ ] Partner section on hub page
