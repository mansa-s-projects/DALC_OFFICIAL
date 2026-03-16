# TODO: Business — Remaining Work

> Priority: 🟡 MEDIUM — Core pages built, needs live scheduling and admin integration

---

## Current State

| Page | Route | Status |
|------|-------|--------|
| Business Hub | `/business` | ✅ Built |
| Company Formation | `/business/company-formation` | ✅ Built — `ProcessTimeline`, `DocumentRequirements` |
| Licensing | `/business/licensing` | ✅ Built — `ComplianceChecklist` |
| Banking | `/business/banking` | ✅ Built |
| Tax | `/business/tax` | ✅ Built |
| Residency by Investment | `/business/residency` | ✅ Built |
| Consultation Scheduler | Used across all service pages | ✅ Built — ⚠️ slots may be hardcoded |

---

## Tasks

### Task 1: Live Consultation Slots

The `ConsultationScheduler` component currently likely shows hardcoded time slots.

**Goal**: Pull available slots from Supabase.

**Migration needed**:
```sql
CREATE TABLE consultation_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID,                      -- future: references team members
  service_type TEXT,                       -- 'company_formation' | 'licensing' | 'banking' | 'tax' | 'residency'
  slot_date DATE,
  slot_time TIME,
  duration_minutes SMALLINT DEFAULT 60,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Hook**:
```tsx
// useConsultationSlots(serviceType, date)
const { data: slots } = useQuery(
  ['consultation-slots', serviceType, date],
  () => supabase
    .from('consultation_slots')
    .select('*')
    .eq('service_type', serviceType)
    .eq('slot_date', date)
    .eq('is_available', true)
);
```

When a user books a slot → set `is_available = false` and insert to `business_consultations`.

---

### Task 2: `business_consultations` Admin View

This is covered in `docs/todo/04-admin-extensions.md` (Task 4) but the data table needs creating too:

```sql
CREATE TABLE business_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  slot_id UUID REFERENCES consultation_slots(id),
  consultant_name TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'
  consultation_date DATE,
  consultation_time TIME,
  meeting_link TEXT,              -- Zoom/Google Meet for virtual
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### Task 3: Compliance Checklist Persistence

The `ComplianceChecklist` component shows a list of items the user needs to check off. Currently may reset on page reload.

**Fix**: Save checked state to Supabase.

```sql
CREATE TABLE compliance_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_type TEXT,
  checklist_key TEXT,   -- unique identifier for each checklist item
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, service_type, checklist_key)
);
```

On mount: load saved state. On toggle: upsert to table.

---

### Task 4: Document Upload for Business Services

Each service page (Company Formation, Licensing, etc.) shows a `DocumentRequirements` list. Add actual upload functionality:

- Passport scan upload
- Proof of address upload
- Business plan upload (for company formation)
- Source of funds document (for banking)

Files upload to Supabase Storage bucket: `business-docs`

```tsx
// Per service page, add:
<DocumentUploadSection 
  serviceType="company_formation"
  requiredDocs={COMPANY_FORMATION_DOCS}
/>
```

---

### Task 5: Service Package Pricing Display

Each business service page should show a clear pricing breakdown:

**Company Formation packages**:
| Package | Price | Includes |
|---------|-------|---------|
| Starter | AED 8,500 | Free zone license + 1 visa |
| Growth | AED 15,000 | Mainland DED + 3 visas + office |
| Enterprise | From AED 25,000 | Custom structure |

Currently pricing may be shown as static text. Ideally stored in `business_services` table with price tiers as JSONB.

---

### Task 6: Business Services as Bookable Products

Currently business services lead to a consultation flow, but they're not in the main `experience_services` or a `business_services` table.

**Create `business_services` table**:
```sql
CREATE TABLE business_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT,  -- 'company_formation' | 'licensing' | 'banking' | 'tax' | 'residency'
  name TEXT,
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'AED',
  price_type TEXT, -- 'fixed' | 'from' | 'custom'
  duration_days SMALLINT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  requirements JSONB,  -- document requirements array
  process_steps JSONB  -- step-by-step process array
);
```

This allows the admin to manage business service offerings from the admin panel.

---

### Task 7: Referral / Partnership Integration

Company Formation and Banking pages should show partner firm tiles:
- Law firms: Al Tamimi & Company, Habib Al Mulla, etc.
- Accounting firms: Big4 presence in Dubai
- Banks: Emirates NBD, ADCB, Mashreq Business Banking

These are stored in `suppliers` table with `category = 'business_partner'`

CTA: "Connect with this firm via DALC" → creates a concierge request

---

### Task 8: Business Profile Dashboard

Create a dedicated dashboard for business clients: `/business/dashboard`

Shows:
- Active services (company formation status, license renewal date)
- Upcoming consultations
- Documents pending upload
- Compliance checklist progress (%)
- Contacts: assigned consultant name + contact info

Accessible from Business Hub via "My Business Profile" CTA (requires auth).

---

## Acceptance Criteria

- [ ] Consultation Scheduler loads real slots from `consultation_slots` table
- [ ] Booking a slot inserts to `business_consultations` and blocks the slot
- [ ] Compliance checklist saves state to Supabase on toggle
- [ ] Document uploads work for each service type
- [ ] `business_services` table created with seed data for all 5 categories
- [ ] Admin can view and manage consultations (see `04-admin-extensions.md`)
- [ ] Business partner firms displayed on relevant pages
- [ ] `/business/dashboard` shows client's active services and consultations
