# Admin: Requests

## Overview

The Admin Requests section is the concierge team's command centre. It displays all incoming user requests, allows assignment and status management, and tracks resolution history.

---

## Route

| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin/requests` | `AdminRequests.tsx` | Full request queue management |

---

## Request Queue (`AdminRequests.tsx`)

### Table Columns
| Column | DB Field | Notes |
|--------|----------|-------|
| Reference | `id` (truncated) | Unique request ID |
| User | `profiles.full_name` via join | Requestor name |
| Type | `request_type` | Badge |
| Description | `description` | Truncated, expand on click |
| Venue | `venues.name` via join | Optional venue link |
| Status | `status` | Colored status badge |
| Assignee | `profiles.full_name` via assignee join | Concierge assigned |
| Submitted | `created_at` | Relative date + absolute on hover |
| Actions | — | View detail \| Assign \| Update status |

---

## Request Detail Panel

Clicking a request row opens a side panel or full-page detail view:

```
┌──────────────────────────────────────────────────────────┐
│ Request #4a2b3c                          [Close ✕]       │
├──────────────────────────────────────────────────────────┤
│ User: John Smith                                         │
│ Requested: Table for 6 at Raspoutine, Saturday 9pm       │
│ Party Size: 6        Budget: AED 5,000+                  │
│ Preferred Date: Sat 12 Jul 2025                          │
│                                                          │
│ Special Requirements:                                    │
│ "Birthday surprise, need a cake and roses on arrival"    │
├──────────────────────────────────────────────────────────┤
│ INTERNAL NOTES                                           │
│ [textarea for admin notes]          [Save Notes]         │
├──────────────────────────────────────────────────────────┤
│ STATUS                                                   │
│ Current: pending → [select new status] [Update]          │
│                                                          │
│ ASSIGN TO                                                │
│ [select concierge team member] [Assign]                  │
├──────────────────────────────────────────────────────────┤
│ STATUS HISTORY                                           │
│ pending        submitted  12 Jul 12:30                   │
│ assigned       by Sarah   12 Jul 14:15                   │
│ quoted         by Sarah   13 Jul 10:00                   │
└──────────────────────────────────────────────────────────┘
```

---

## Status Management

Admin/Concierge can update request status via dropdown:

```
pending → assigned → active → quoted → confirmed → completed
                                                  ↘ cancelled
```

| Status | Who Sets It | Meaning |
|--------|-------------|---------|
| `pending` | System (auto) | Just submitted |
| `assigned` | Concierge | Team member assigned |
| `active` | Concierge | Working on request |
| `quoted` | Concierge | Quote sent to user |
| `confirmed` | System / Admin | User confirmed quote |
| `completed` | Admin | Request fulfilled |
| `cancelled` | User or Admin | Request cancelled |

All status changes are automatically logged to `request_status_log` via the database trigger.

---

## Assignment Flow

1. Admin/Concierge views request queue
2. Clicks "Assign" → opens a dropdown of staff members with `role = 'concierge'` or `role = 'admin'`
3. Selects team member → fires:
   ```typescript
   await supabase.from('requests')
     .update({ assignee_id: staffId, status: 'assigned' })
     .eq('id', requestId);
   ```
4. `request_status_log` trigger auto-logs `pending → assigned`
5. Concierge assigned sees the request in their filtered view

---

## Filters

| Filter | Type | Options |
|--------|------|---------|
| Status | Multi-select chips | pending \| assigned \| active \| quoted \| confirmed \| completed \| cancelled |
| Assignee | Dropdown | All \| Unassigned \| [team member name] |
| Date range | Date picker | Submitted between dates |
| Venue | Search | Filter by linked venue name |
| Search | Text | Keyword in description |

Default view: All non-completed, non-cancelled requests, sorted by `created_at DESC`.

---

## Concierge-Only View

Users with `role = 'concierge'` see a filtered version:
- Only see requests assigned to themselves + unassigned requests
- Cannot access `/admin/venues` or `/admin/suppliers`
- CAN assign themselves to unassigned requests
- CAN update status of their assigned requests
- CAN add internal notes

Concierge sidebar nav:
```
Requests
  ├── My Requests     (assignee_id = me)
  └── Queue           (unassigned)
```

---

## Quote Flow

When admin/concierge is ready to quote:

1. Opens request detail panel
2. Fills in:
   - `quote_amount`: AED value
   - `quote_details`: text description of what's included
3. Sets status to `quoted`
4. System sends quote notification to user (email + in-app)
5. User accepts or declines
6. On acceptance: status → `confirmed`

---

## Request Analytics (Future)

Metrics to track on the AdminOverview page:
- Average time from `pending` to `confirmed` (resolution SLA)
- Number of requests per concierge team member
- Most requested venue / type
- Conversion rate: quote sent → confirmed
- Monthly request volume trend

---

## Realtime Updates

Target: Use Supabase Realtime to auto-refresh the request queue when new requests come in, without page reload:

```typescript
useEffect(() => {
  const channel = supabase
    .channel('admin-requests')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'requests'
    }, (payload) => {
      queryClient.invalidateQueries(['admin', 'requests']);
      // Optional: play notification sound
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

---

## Hook

`src/hooks/useRequests.ts`

```typescript
// Admin: fetch all requests with filters
const { requests, isLoading } = useRequests({
  status: ['pending', 'assigned'],
  assignee_id: null  // all unassigned
});

// Update request
const { mutate: updateRequest } = useUpdateRequest();
updateRequest({ id, status: 'assigned', assignee_id: staffId });
```
