# Feature: Concierge

## Purpose

The Concierge feature is Pillar #7 — DALC's white-glove service layer. When a user's need cannot be fulfilled by the platform's pre-listed services, they submit a concierge request and a DALC team member takes full ownership: sourcing, quoting, and delivering the outcome.

This feature is **partially built** (the `/request` form exists) but lacks a dedicated hub page, real-time status updates, and the concierge-assignment workflow.

---

## Current State vs Target

| Component | Current State | Target State |
|-----------|---------------|--------------|
| Concierge hub | ✅ `/concierge` — `ConciergeHub.tsx` built | Enhance with testimonials + service showcase |
| Request form (new) | ✅ `/concierge/request` — `ConciergeRequest.tsx` built (4-step form) | Add more request type flows |
| Request form (legacy) | ✅ `/request` page exists | Keep as alias / redirect to `/concierge/request` |
| Request confirmation | ✅ `/request/success` | Add request ID + tracking link |
| My Requests | ✅ `/my-requests` (auth) | Add real-time status updates |
| Status notifications | ❌ Not implemented | In-app + email notifications on status change |
| Concierge assignment (admin) | ❌ Admin panel lacks assignment UI | Add assignment flow to admin requests |
| Real-time updates | ❌ Not implemented | Supabase Realtime on requests table |

---

## Architecture

### Existing Components
| File | Route | Purpose |
|------|-------|---------|
| `src/pages/concierge/ConciergeHub.tsx` | `/concierge` | Concierge landing page |
| `src/pages/concierge/ConciergeRequest.tsx` | `/concierge/request` | 4-step request submission form |
| `src/pages/Request.tsx` | `/request` | Legacy request form (kept as fallback) |
| `src/pages/RequestSuccess.tsx` | `/request/success` | Submission confirmation |
| `src/pages/MyRequests.tsx` | `/my-requests` | User's request history (auth) |
| `src/admin/pages/AdminRequests.tsx` | `/admin/requests` | Admin request queue |

### To Be Built
| File | Route | Purpose |
|------|-------|---------|
| `src/features/concierge/pages/RequestDetail.tsx` | `/my-requests/:id` | Individual request detail + chat |

### Hook
`src/hooks/useRequests.ts` — Fetch user's requests (`requests` table). Also see `src/features/concierge/hooks/useConcierge.ts` and `src/features/concierge/api.ts`.

### Database
`requests` table and `request_status_log` audit table (defined in `supabase/schema.sql`).

---

## User Flows

### Flow 1: Submit Concierge Request

```
User arrives at /concierge (hub — to be built)
  → ConciergeHub showcases:
    - What concierge handles (any Dubai need)
    - Recent concierge fulfillments (anonymized testimonials)
    - "Make a Request" CTA

User clicks "Make a Request"
  → /request (Request.tsx form)
  → Form fields:
    - Request type (dropdown): Experience | Venue | Transport | Business | Other
    - Linked pillar context (optional venue/experience selection)
    - Description (free text) — what do you need?
    - Date + time preference
    - Budget range
    - Party size
    - Special requirements
  → Submit → creates requests record
  → Redirect to /request/success
  → Email notification sent to user (confirmation) + DALC team (new request alert)
```

### Flow 2: Concierge Handles Request (Admin Side)

```
New request lands in /admin/requests queue
  → Status: pending
  → Admin assigns to a concierge team member (assignment adds assignee_id)
  → Status updates to: assigned
  → Concierge begins sourcing

Concierge updates status to:
  → active (working on it)
  → Adds internal notes + quote details

Concierge creates quote:
  → Updates request with: quote_amount, quote_details
  → Status: quoted
  → User receives notification: "Your request has a quote"

User reviews quote at /my-requests/:id
  → Accepts or declines
  → If accepted: status → confirmed
  → Payment initiated (future)
  → Concierge fulfills request
  → Status: completed
```

### Flow 3: My Requests (User Dashboard)

```
User visits /my-requests
  → useRequests() loads all requests for current user
  → Requests listed with status badges:
    pending    → clock icon, "DALC reviewing your request"
    assigned   → team icon, "Concierge assigned"
    active     → progress icon, "We're working on it"
    quoted     → AED icon, "Quote ready — review now"
    confirmed  → check icon, "Confirmed"
    completed  → star icon, "Completed"
    cancelled  → x icon, "Cancelled"
  → Click request → /my-requests/:id → RequestDetail
  → RequestDetail: full history, status timeline, messages
```

---

## Request Status Machine

```
          ┌──────────────┐
          │   pending    │ ← User submits
          └──────┬───────┘
                 │ Admin assigns team member
          ┌──────▼───────┐
          │   assigned   │
          └──────┬───────┘
                 │ Concierge begins work
          ┌──────▼───────┐
          │    active    │
          └──────┬───────┘
                 │ Quote prepared
          ┌──────▼───────┐
          │    quoted    │
          └──────┬───────┘
                 │ User approves
          ┌──────▼───────┐
          │  confirmed   │
          └──────┬───────┘
                 │ Service delivered
          ┌──────▼───────┐
          │  completed   │
          └──────────────┘

Any state → cancelled (user or admin)
```

---

## Database Schema

### `requests` table (in `supabase/schema.sql`)
```sql
id, user_id, venue_id, request_type, description,
preferred_date, preferred_time, party_size, budget_range,
status, assignee_id, quote_amount, quote_details,
special_requirements, internal_notes, source_pillar,
created_at, updated_at
```

### `request_status_log` table (auto-trigger)
```sql
id, request_id, old_status, new_status, changed_by, notes, created_at
```

The trigger `log_request_status_change()` fires on every update to `requests.status` and writes an audit entry automatically.

---

## What Needs To Be Built

### 1. ConciergeHub Page (`/concierge`)
```typescript
// src/features/concierge/pages/ConciergeHub.tsx
// Contents:
// - Hero: "Dubai's most personal service"
// - What we handle (grid of use cases)
// - How it works (3 steps: submit → concierge → delivered)
// - Recent testimonials
// - "Make a Request" CTA → /request
```

### 2. RequestDetail Page (`/my-requests/:id`)
```typescript
// src/features/concierge/pages/RequestDetail.tsx
// Contents:
// - Request summary card
// - Status timeline (visual stepper)
// - Quote display (if quoted/confirmed)
// - Message thread (concierge ↔ user)
// - Action buttons: Accept quote / Cancel request
```

### 3. Enhanced Request Form
```typescript
// Enhance src/pages/Request.tsx with:
// - `request_type` dropdown (experience, venue, transport, business, other)
// - `source_pillar` auto-detection from referrer
// - Budget range selector (AED ranges)
// - Rich description with character counter
```

### 4. Concierge Service Library
```typescript
// src/features/concierge/lib/concierge.ts
// Functions:
// - getRequests(userId) → requests[]
// - getRequestById(id) → request + status_log[]
// - createRequest(input) → request
// - updateRequestStatus(id, status, notes)
// - addRequestNote(id, note)
```

### 5. Supabase Realtime Integration
```typescript
// In RequestDetail.tsx:
supabase
  .channel('request-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'requests',
    filter: `id=eq.${requestId}`
  }, (payload) => {
    // Update request status in UI
  })
  .subscribe();
```

---

## SLA Design (Future)

| Request Type | Target Response | Target Fulfillment |
|-------------|----------------|-------------------|
| Same-day restaurant reservation | 30 minutes | 2 hours |
| Yacht charter (next day) | 2 hours | 6 hours |
| VIP table arrangement | 1 hour | 4 hours |
| Company formation inquiry | 4 hours | Quote within 24 hours |
| Bespoke event planning | 12 hours | Proposal within 48 hours |

---

## Scalability Notes

- **AI pre-qualification:** Before assigning a human concierge, use an AI model to classify the request type, estimate complexity, and auto-populate common fields.
- **Concierge tiers:** Match request to concierge based on user tier (platinum/black users get senior concierge).
- **Partner routing:** Auto-assign certain request types to approved partner suppliers (e.g., restaurant booking requests go to a restaurant partnerships manager).
- **Marketplace integration:** Fulfilled concierge requests become candidate additions to the platform's pre-listed services catalogue.
- **SLA enforcement:** Set due-date timestamps at each status transition; trigger escalation alerts if SLAs are breached.
