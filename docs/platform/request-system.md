# Request System

## Overview

The Request System is the operational backbone of DALC's concierge service. Users submit requests for venue access, experiences, or general concierge assistance. The DALC team manages, tracks, and fulfills these requests through the admin interface.

---

## What is a Request?

A "request" is a user-initiated concierge inquiry that cannot be handled through a standard booking flow. Examples:
- VIP table at a venue that doesn't have self-serve booking
- Custom yacht experience with specific requirements
- Last-minute luxury arrangement
- General "I need help with..." inquiry that requires human assistance

---

## Request Schema

`supabase/schema.sql` — `requests` table:

```sql
CREATE TABLE public.requests (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID REFERENCES public.profiles(id) NOT NULL,
  venue_id            UUID REFERENCES public.venues(id),     -- optional link
  request_type        TEXT,
  description         TEXT NOT NULL,
  preferred_date      DATE,
  preferred_time      TIME,
  party_size          INT,
  budget_range        TEXT,
  status              TEXT DEFAULT 'pending',
  assignee_id         UUID REFERENCES public.profiles(id),   -- concierge assigned
  quote_amount        DECIMAL(10,2),
  quote_details       TEXT,
  special_requirements TEXT,
  internal_notes      TEXT,
  source_pillar       TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Status State Machine

```
submitted
    │
    ▼
 pending ──────────────────────────────────────────────────┐
    │                                                      │
    ▼ (concierge assigns)                                  │
 assigned                                                  │
    │                                                      │
    ▼ (team working on request)                            │
  active                                                   │
    │                                                      │
    ▼ (quote prepared)                                     │
 quoted ─────────────────── user declines ─────────────────┤
    │                                                      │
    ▼ (user accepts)                                       │
confirmed                                                  │
    │                                                      │
    ▼ (service delivered)                                  │
completed                                                  │
                                                           │
cancelled ◄────────────────────────────────────────────────┘
```

All transitions are logged automatically in `request_status_log`.

---

## Request Types

`request_type` field values:

| Type | Description | Source Pillar |
|------|-------------|--------------|
| `table_reservation` | Restaurant / venue table | Nightlife / Dining |
| `venue_access` | VIP entry, club access | Nightlife |
| `experience_custom` | Custom / bespoke experience | Experiences |
| `yacht_charter` | Yacht for private use | Transport |
| `jet_charter` | Private jet booking | Transport |
| `car_rental_custom` | Supercar arrangement | Transport |
| `concierge_general` | Open-ended request | Home / Explore |
| `business_inquiry` | Pre-consultation inquiry | Business |
| `relocation_support` | Relocation coordination | Move to Dubai |

---

## Request Submission Form

`src/pages/Request.tsx`

Form fields:
```
Request Type        [select or inferred from source page]
Description         [textarea — free-form description]  required
Preferred Date      [date picker]
Preferred Time      [time picker]
Party Size          [number input]
Budget Range        [select: <1k|1-5k|5-15k|15-50k|50k+] (AED)
Special Requirements [textarea]
Linked Venue        [pre-filled if accessed from venue page]
```

Pre-fill rules:
- If navigated from `/venue/:id` — `venue_id` pre-filled
- If navigated with `?type=yacht_charter` — `request_type` pre-filled
- If user has active relocation — `source_pillar = 'relocation'`

---

## Request Confirmation Flow

```
User submits form
  ↓
POST to Supabase → create requests row (status: pending)
  ↓
RLS check: user_id must = auth.uid()
  ↓
request_status_log trigger fires → logs initial 'pending' status
  ↓
Navigate to /request-success
  ↓
Email notification to user (Supabase/Resend): "We've received your request"
  ↓
Alert to admin/concierge team (email + in-app)
```

---

## Request Success Page

`src/pages/RequestSuccess.tsx`

Content:
- Confirmation message: "Your request has been received"
- Request reference number (first 8 chars of UUID)
- Summary of what was requested
- "Our team will be in touch within 2 hours" SLA messaging
- CTA: "Track your request" → `/my-requests`
- CTA: "Browse more" → `/explore`

---

## My Requests Page

`src/pages/MyRequests.tsx`

User-facing view of their own requests:

```
My Requests
─────────────────────────────────────────────
ACTIVE
● Request #4a2b3c — Table for 6 at Raspoutine
  Submitted: 12 Jul 2025   Status: assigned ●
  [View Details]

COMPLETED
● Request #7f3d1a — Yacht for 10, Saturday
  Completed: 5 Jul 2025   AED 12,500
  [View Details]
─────────────────────────────────────────────
```

Hook: `useRequests()` filtered by `user_id = current user`.

---

## Request Status Log

The `request_status_log` table records every status change:

```sql
CREATE TABLE public.request_status_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id  UUID REFERENCES public.requests(id),
  old_status  TEXT,
  new_status  TEXT NOT NULL,
  changed_by  UUID REFERENCES public.profiles(id),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**Auto-trigger:**
```sql
CREATE TRIGGER on_request_status_change
  AFTER UPDATE ON public.requests
  FOR EACH ROW EXECUTE PROCEDURE log_request_status_change();
```

This ensures a complete audit trail without manual logging. The history is shown in the admin request detail panel.

---

## Supabase Realtime (Future)

Subscription on `requests` for the user's own requests — auto-updates My Requests page when status changes:

```typescript
useEffect(() => {
  const channel = supabase
    .channel('my-requests')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'requests',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      queryClient.invalidateQueries(['requests', userId]);
      toast(`Your request status updated to: ${payload.new.status}`);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [userId]);
```

---

## SLA Design

| From → To | SLA Target |
|-----------|-----------|
| submitted → assigned | 2 hours |
| assigned → active | 4 hours (business hours) |
| active → quoted | 24 hours |
| quoted → confirmed | User-driven |
| confirmed → completed | Service date |

---

## Hooks

`src/hooks/useRequests.ts`

```typescript
// User: fetch own requests
const { requests } = useRequests({ userId: profile.id });

// Admin: fetch all requests with filters
const { requests } = useRequests({ status: ['pending', 'assigned'] });

// Mutations
const { mutate: createRequest } = useCreateRequest();
const { mutate: updateRequest } = useUpdateRequest();
```
