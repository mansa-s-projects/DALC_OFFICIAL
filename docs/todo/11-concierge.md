# TODO: Concierge — Real-Time Updates & Quote Workflow

> Priority: 🟠 HIGH — Core form works but operational workflow is incomplete

---

## Current State

| Feature | Status |
|---------|--------|
| Concierge Hub | ✅ Built |
| 4-step request form | ✅ Built |
| Submit to `concierge_requests` | ✅ Working |
| My Requests page (`/my-requests`) | ✅ Exists |
| Real-time request status updates | ❌ Missing |
| Request chat / thread | ❌ Missing |
| Quote accept/decline flow | ❌ Missing |
| Admin assignment workflow | ❌ Missing (see `04-admin-extensions.md`) |
| Push / email notifications on status change | ❌ Missing |
| Request priority levels | ❌ Missing |

---

## Tasks

### Task 1: Real-Time Status Updates via Supabase Realtime

Currently, `/my-requests` shows a snapshot of requests at load time. There's no live update.

**Implementation**:

```tsx
// In MyRequestsPage.tsx or useMyRequests hook:
useEffect(() => {
  const channel = supabase
    .channel('my-requests')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'concierge_requests',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        // Update the request in local state
        queryClient.invalidateQueries(['my-requests']);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [user.id]);
```

When the admin changes a request status, the client page auto-updates.

---

### Task 2: In-Request Chat Thread

Each concierge request should have a messaging thread between the client and the concierge team.

**UI**: On `/my-requests/:id` (or a detail drawer), show a chat-like thread:

```
[Admin] Your request has been received. We're reviewing your requirements.     2h ago
[You]   Can you confirm the exact time?                                        1h ago
[Admin] The booking is confirmed for 8 PM. Please arrive 10 minutes early.    45m ago
```

**Schema**:
```sql
CREATE TABLE request_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES concierge_requests(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  sender_role TEXT, -- 'user' | 'admin' | 'concierge'
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Real-time**: Subscribe to `request_messages` for the open request.

---

### Task 3: Quote Accept / Decline Flow

When admin sets `status = 'quoted'` and `quote_amount` on a request, the client should see:

**On `/my-requests`** — Request card shows:
```
Status: Quote Ready
Amount: AED 2,500
[Accept Quote]  [Decline Quote]  [Ask a Question]
```

**On Accept**:
- Update `concierge_requests.status = 'accepted'`
- Redirect to payment flow OR create `bookings` record
- Send confirmation email

**On Decline**:
- Update `status = 'declined'`
- Optional: open a reason input or redirect back to request form with pre-filled values

**Schema additions**:
```sql
ALTER TABLE concierge_requests ADD COLUMN IF NOT EXISTS quote_amount DECIMAL(10,2);
ALTER TABLE concierge_requests ADD COLUMN IF NOT EXISTS quote_details TEXT;
ALTER TABLE concierge_requests ADD COLUMN IF NOT EXISTS quote_expires_at TIMESTAMPTZ;
ALTER TABLE concierge_requests ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id);
ALTER TABLE concierge_requests ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal'; -- 'urgent' | 'high' | 'normal' | 'low'
ALTER TABLE concierge_requests ADD COLUMN IF NOT EXISTS estimated_completion TIMESTAMPTZ;
```

---

### Task 4: Request Detail Page

Currently `/my-requests` may show a list only. Add a detail view:

Route: `/my-requests/:id`

Shows:
- Request summary (type, description, created date)
- Current status with progress bar / stepper
- Quote (if any) with accept/decline
- Message thread (Task 2)
- Document attachments (user and admin uploads)
- Estimated completion date (set by admin)

---

### Task 5: Request Type Pre-Fill from Other Verticals

Already partially covered (jets, flights link to concierge). Audit all "By Request" CTAs across the platform to ensure they pre-fill the form.

Pre-fill params via URL query:
```
/concierge/request?type=jet_charter&venue=marina-yacht-club&details=3+nights
```

In the 4-step form, read `useSearchParams()` and pre-populate:
- Step 1: category/type auto-selected
- Step 2: description pre-filled from `?details`
- Step 3: venue linked via `?venue`

---

### Task 6: Request Cancellation by User

Users should be able to cancel a request if it's still `pending`:

Add a "Cancel Request" button on the request detail page.

- Confirmed requests: can't be cancelled by user (must contact concierge team)
- Pending requests: user can cancel freely → `status = 'cancelled_by_user'`

---

### Task 7: My Requests — Filter & Sort

Current list is likely flat. Add:
- Filter by status: All / Active / Pending / Completed / Cancelled
- Sort by: Newest / Oldest / Urgency
- Search by request title/description

---

### Task 8: Request Attachment Uploads

Allow users to attach files when submitting a request:
- Contract to review (PDF)
- Event brief (PDF)
- Venue photos (JPG)

Upload to Supabase Storage `request-attachments` bucket.

Store references in `request_attachments` table:
```sql
CREATE TABLE request_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES concierge_requests(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES profiles(id),
  file_name TEXT,
  file_url TEXT,
  file_size BIGINT,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Acceptance Criteria

- [ ] Status change by admin reflects live on `/my-requests` without page refresh
- [ ] Message thread works between user and concierge team
- [ ] Messages update in real-time via Supabase Realtime
- [ ] When admin sets quote: user sees "Accept / Decline" UI
- [ ] Accept quote → creates booking record or payment intent
- [ ] `/my-requests/:id` detail view exists
- [ ] All "by_request" CTAs across platform pre-fill the concierge form
- [ ] User can cancel pending requests
- [ ] Filter/sort controls on My Requests list
- [ ] File attachments uploadable from request form and detail view
