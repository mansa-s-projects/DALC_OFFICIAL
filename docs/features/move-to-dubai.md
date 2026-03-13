# Feature: Move to Dubai

## Purpose

The Move to Dubai feature is Pillar #1 of DALC. It guides individuals through the entire relocation lifecycle — from initial intent through to full settlement in Dubai. The platform provides personalized relocation roadmaps, document management, cost estimation, and real-time workflow tracking.

This is DALC's core differentiator: no other luxury platform provides an end-to-end relocation operating system.

---

## Architecture

### Pages
| Page | Route | Component | Auth |
|------|-------|-----------|------|
| Hub | `/move-to-dubai` | `src/features/move-to-dubai/pages/MoveToDubai.tsx` | Public |
| Intake | `/move-to-dubai/intake` | `src/features/move-to-dubai/pages/Intake.tsx` | Required |
| Dashboard | `/move-to-dubai/dashboard` | `src/features/move-to-dubai/pages/Dashboard.tsx` | Required |
| Documents | `/move-to-dubai/documents` | `src/features/move-to-dubai/pages/Documents.tsx` | Required |
| Cost Estimator | `/move-to-dubai/cost` | `src/features/move-to-dubai/pages/CostEstimator.tsx` | Required |

### Hooks
| Hook | File | Purpose |
|------|------|---------|
| `useRelocation` | `src/features/move-to-dubai/hooks/useRelocation.ts` | Profile CRUD, workflow management |
| `useRelocationDocs` | `src/features/move-to-dubai/hooks/useRelocationDocs.ts` | Document uploads and status |
| `useRelocationCost` | `src/features/move-to-dubai/hooks/useRelocationCost.ts` | Cost estimates and breakdowns |

### Service Library
`src/lib/relocation.ts` — All Supabase + mock data functions for the relocation vertical.

### Types
`src/features/move-to-dubai/types.ts` — Full TypeScript definitions for all relocation entities. Re-exported via shim at `src/types/relocation.ts`.

---

## User Flows

### Flow 1: New User — Intake & Profile Creation

```
User lands on /move-to-dubai (hub)
  → Reads overview: features, stats, how it works
  → Clicks "Start Your Journey"
  → Redirected to /login if not authenticated
  → Post-login: lands on /move-to-dubai/intake

Intake Form (/move-to-dubai/intake):
  Step 1: Relocation purpose
    Options: Employment | Business | Retirement | Family | Investment
  Step 2: Current country + target move date
  Step 3: Family size + budget range
  Step 4: Property preference (buy/rent/flexible)
  Step 5: Visa status (not_started | in_progress | approved)

On submit:
  → createRelocationProfile(formData)
  → generateDefaultWorkflow(purpose) creates workflow + steps
  → Redirect to /move-to-dubai/dashboard
```

### Flow 2: Workflow Dashboard

```
User visits /move-to-dubai/dashboard
  → Loads relocation_profiles for current user
  → Loads user_workflows + user_workflow_steps
  → Displays progress tracker (completed / in_progress / pending steps)
  → Each step shows: title, description, due date, status
  → User marks steps as completed: updateWorkflowStep()
  → Completed steps trigger next step activation
```

### Flow 3: Document Management

```
User visits /move-to-dubai/documents
  → Loads user_documents for current user
  → Shows documents by status:
    pending    → grey (not uploaded)
    uploaded   → yellow (awaiting verification)
    verified   → green (approved)
    rejected   → red (needs resubmission)
    expired    → orange (requires renewal)
  → User uploads document: uploadDocument()
  → Admin/concierge updates status to verified/rejected
```

### Flow 4: Cost Estimator

```
User visits /move-to-dubai/cost
  → System loads relocation_cost_estimates for current user
  → Displays breakdown by category:
    visa           → Government fees, processing
    housing        → Rent deposit, agency fees, first month
    education      → School admission, books, uniforms
    healthcare     → Insurance premiums, registration
    business_setup → Trade license, bank opening, legal
    transport      → Car lease, insurance, Salik
    other          → Moving costs, misc
  → User can add custom cost estimates: addCostEstimate()
  → Platform displays total min/max/estimated budget
```

---

## Workflow Engine

### Default Workflows by Purpose

#### Business Relocation (8 steps)
1. Gather Required Documents
2. Apply for Business Visa / Free Zone License
3. Company Formation
4. Open Corporate Bank Account
5. Secure Accommodation
6. Register Children at School (if applicable)
7. Register for Health Insurance
8. Obtain Emirates ID

#### Employment Relocation (7 steps)
1. Gather Required Documents
2. Apply for Work Permit / Employment Visa
3. Secure Accommodation
4. Register Children at School (if applicable)
5. Register for Healthcare
6. Open Personal Bank Account
7. Obtain Emirates ID

#### Investment / Retirement (6 steps)
1. Gather Required Documents
2. Apply for Investor / Retirement Visa
3. Secure Accommodation
4. Open Personal Bank Account
5. Register for Health Insurance
6. Obtain Emirates ID

### Step Status Machine
```
pending → in_progress → completed
pending → skipped (optional steps)
```

Each step has:
- `title`, `description` — display text
- `due_date` — target completion date
- `status` — `pending | in_progress | completed | skipped`
- `completed_at` — timestamp when marked complete
- `step_number` — ordering (1-based)

---

## Database Relationships

```
profiles (auth.users)
  └── relocation_profiles (1:1 per user)
        ├── user_workflows (1:many per profile)
        │     └── user_workflow_steps (1:many per workflow)
        ├── user_documents (1:many per profile)
        └── relocation_cost_estimates (1:many per profile)
```

### Key Tables

**`relocation_profiles`**
```sql
id, user_id, purpose, current_country, target_date,
family_size, budget_range, property_preference,
visa_status, status, created_at, updated_at
```

**`user_workflows`**
```sql
id, user_id, relocation_profile_id, title, description,
status (active|paused|completed), total_steps, completed_steps,
created_at, updated_at
```

**`user_workflow_steps`**
```sql
id, workflow_id, user_id, step_number, title, description,
status (pending|in_progress|completed|skipped), due_date,
completed_at, created_at, updated_at
```

**`user_documents`**
```sql
id, user_id, relocation_profile_id, document_type,
document_name, status (pending|uploaded|verified|rejected|expired),
file_url, notes, expiry_date, uploaded_at, verified_at,
created_at, updated_at
```

**`relocation_cost_estimates`**
```sql
id, user_id, relocation_profile_id, category,
item_name, estimated_min, estimated_max, currency,
is_recurring, recurring_period, notes, created_at
```

---

## RLS Policy Summary

| Operation | Who Can Do It |
|-----------|---------------|
| Read relocation profile | Profile owner |
| Create/update profile | Profile owner |
| Read/manage workflows & steps | Workflow owner |
| Read/manage documents | Document owner |
| Update document status to verified/rejected | admin or concierge |
| Read cost estimates | Estimate owner |
| Read all relocation data | admin or concierge |

---

## Integration Points

- **Stays:** A long-term booking can be linked to a relocation profile (`relocation_profile_id` on `stays_bookings`)
- **Business:** A business formation booking links back to relocation via the `relocation_profile_id` field
- **Transport:** Transport bookings can be flagged as `relocation` type

---

## Scalability Notes

- **Multi-city:** Replace all "Dubai" hardcoding with a `city_id` reference on `relocation_profiles`. Generate city-specific default workflows from a `workflow_templates` table.
- **AI Roadmap:** Feed the intake profile into an AI model to generate a customized timeline with risk flags and recommendations.
- **Partner Integration:** Connect workflow steps to bookable DALC services — e.g., "Company Formation" step links directly to the Business Setup pillar.
- **Progress Notifications:** Trigger email/in-app notifications when workflow steps are due or overdue.
- **Visa Status Tracking:** Integrate with official UAE government APIs (future) to show real-time visa application status.
