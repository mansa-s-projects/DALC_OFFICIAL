# TODO: Notifications System

> Priority: 🟠 HIGH — Currently no notification system exists anywhere

---

## Overview

The platform needs a unified notification system covering:
1. In-app notification bell (real-time)
2. Transactional emails (booking confirmations, status updates)
3. Push notifications (phase 2 — mobile web)

---

## Current State

**No notification system exists in the codebase.** All booking and request status changes are silent from the user's perspective.

---

## Tasks

### Task 1: Notifications Database Table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,           -- 'booking_confirmed' | 'request_update' | 'quote_ready' | 'message_received' | etc.
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,                    -- e.g. '/my-requests/uuid'
  entity_type TEXT,             -- 'booking' | 'request' | 'message'
  entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast user queries:
CREATE INDEX notifications_user_id_idx ON notifications(user_id, created_at DESC);
```

---

### Task 2: Notification Bell Component

**Location**: Navbar, between the search icon and profile avatar.

```tsx
// src/components/notifications/NotificationBell.tsx

// Shows:
// - Bell icon
// - Unread count badge (e.g., red dot with number)
// - Clicking → opens dropdown of recent notifications
// - "Mark all as read" button
// - "View all" link → /notifications
```

**Unread count**:
```tsx
const { data: unreadCount } = useQuery(
  ['notifications-unread', userId],
  () => supabase
    .from('notifications')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_read', false)
);
```

---

### Task 3: Real-Time Notification Delivery

Subscribe to new notifications in the Navbar (or a root-level context):

```tsx
// src/context/NotificationsContext.tsx
useEffect(() => {
  const channel = supabase
    .channel('user-notifications')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      (payload) => {
        // Add to local notifications list
        // Show toast notification
        toast.info(payload.new.title, { description: payload.new.message });
        queryClient.invalidateQueries(['notifications-unread']);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [userId]);
```

---

### Task 4: Notification Types — Trigger Points

Define all notification triggers. These should be created server-side via Supabase database triggers or Edge Functions:

| Event | Type | Title | Link |
|-------|------|-------|------|
| Booking confirmed | `booking_confirmed` | "Your [service] booking is confirmed!" | `/my-bookings/:id` |
| Booking cancelled | `booking_cancelled` | "Booking Cancelled" | `/my-bookings/:id` |
| Request status changed | `request_update` | "Update on your [category] request" | `/my-requests/:id` |
| Quote ready | `quote_ready` | "A quote is ready for your request" | `/my-requests/:id` |
| Admin message | `message_received` | "New message from your concierge" | `/my-requests/:id` |
| Waitlist slot open | `waitlist_available` | "A spot opened for [experience]!" | `/experiences/:id` |
| Document required | `document_required` | "Please upload your [doc type]" | `/move-to-dubai/documents` |
| Consultation reminder | `consultation_reminder` | "Your consultation is tomorrow" | `/business/dashboard` |
| Review invitation | `review_invitation` | "How was [service]? Leave a review" | `/experiences/:id?tab=review` |

**Implementation (Supabase trigger example)**:
```sql
-- Trigger: notify user when concierge_requests status changes
CREATE OR REPLACE FUNCTION notify_request_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO notifications (user_id, type, title, message, link, entity_type, entity_id)
    VALUES (
      NEW.user_id,
      'request_update',
      'Update on your request: ' || COALESCE(NEW.title, 'Concierge Request'),
      'Status changed to: ' || NEW.status,
      '/my-requests/' || NEW.id::TEXT,
      'request',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_request_status_change
AFTER UPDATE ON concierge_requests
FOR EACH ROW EXECUTE FUNCTION notify_request_status_change();
```

---

### Task 5: Full Notifications Page

Route: `/notifications`

Shows paginated list of all notifications:
- Date-grouped (Today, Yesterday, Last Week)
- Read/unread styling
- Filter: All / Unread / Bookings / Requests / System
- "Clear all" option

---

### Task 6: Notification Preferences

In Profile > Settings, allow users to control which notifications they receive:

```
[✅] Booking confirmations     (email + in-app)
[✅] Request updates           (email + in-app)
[✅] Messages from concierge   (email + in-app)
[✅] Waitlist alerts           (in-app only)
[✅] Promotional offers        (email only)
[❌] Marketing newsletters     (email)
```

Store in `profiles.notification_preferences JSONB`.

---

### Task 7: Transactional Emails via Supabase Edge Functions

Use **Resend** (or SendGrid) to send emails when key events occur:

**Setup**:
1. Create Supabase Edge Function: `supabase/functions/send-notification-email/index.ts`
2. Configure Resend API key in Supabase secrets: `supabase secrets set RESEND_API_KEY=re_...`

**Trigger points for emails**:
- Booking confirmed → send booking confirmation email
- Quote ready → send quote email with accept/decline buttons
- Consultation reminder → 24h before scheduled time
- Request status update → when admin changes request status

**Email templates**: Use React Email or Resend's template system.

---

### Task 8: Unread Count in Browser Tab Title

While the page is open, show the unread count in the document title:

```tsx
useEffect(() => {
  if (unreadCount > 0) {
    document.title = `(${unreadCount}) Dubai À La Carte`;
  } else {
    document.title = 'Dubai À La Carte';
  }
}, [unreadCount]);
```

---

## Component Structure

```
src/components/notifications/
  NotificationBell.tsx           ← Navbar bell with badge + dropdown
  NotificationDropdown.tsx       ← dropdown list component
  NotificationItem.tsx           ← single notification row
  NotificationToast.tsx          ← auto-dismiss toast for new notifications

src/pages/notifications/
  NotificationsPage.tsx          ← full /notifications page

src/context/
  NotificationsContext.tsx       ← Realtime subscription + state

src/hooks/
  useNotifications.ts            ← query + realtime hook
  useUnreadCount.ts              ← unread badge count
```

---

## Acceptance Criteria

- [ ] `notifications` table created in Supabase
- [ ] NotificationBell shows in Navbar with unread badge
- [ ] Clicking bell opens dropdown with recent notifications
- [ ] New notifications arrive in real-time (Supabase Realtime)
- [ ] Toast shown when new notification arrives
- [ ] Database triggers fire on: booking confirm, request update, quote ready, message received
- [ ] Full `/notifications` page with filter and pagination
- [ ] Notification preferences in Profile Settings
- [ ] Transactional emails sent via Resend for key events
- [ ] Browser tab title reflects unread count
