# Notifications

## Overview

The notification system informs users about booking confirmations, status changes, request updates, and important workflow events. Notifications are delivered through in-app messaging and email.

---

## Notification Types

### Booking Notifications
| Event | Recipient | Channel |
|-------|-----------|---------|
| Booking created (pending) | User | Email + in-app |
| Booking confirmed | User | Email + in-app |
| Booking cancelled | User | Email + in-app |
| Booking completed | User | Email + in-app |
| Booking refund processed | User | Email |
| New booking received | Supplier (future) | Email + in-app |

### Request Notifications
| Event | Recipient | Channel |
|-------|-----------|---------|
| Request submitted | User | Email + in-app |
| Request assigned | User | In-app |
| Quote received | User | Email + in-app |
| Request confirmed | User | Email + in-app |
| Request completed | User | Email + in-app |
| New request submitted | Admin/Concierge | Email + in-app |

### Relocation Workflow Notifications
| Event | Recipient | Channel |
|-------|-----------|---------|
| Workflow step due soon | User | Email + in-app |
| Workflow step overdue | User | Email + in-app |
| Document verified | User | Email + in-app |
| Document rejected | User | Email + in-app |
| Workflow completed | User | Email + in-app |

### System Notifications
| Event | Recipient | Channel |
|-------|-----------|---------|
| Account created | User | Email (welcome) |
| Password reset | User | Email |
| Supplier approved | Supplier | Email |
| Supplier listing approved | Supplier | Email |

---

## Email Notifications

### Provider
**Supabase + Resend** (or SendGrid as alternative)

Supabase handles built-in auth emails (confirm signup, reset password). Custom transactional emails use Resend:
```typescript
// In Supabase Edge Function
import { Resend } from 'resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

await resend.emails.send({
  from: 'DALC <hello@dalc.ae>',
  to: user.email,
  subject: 'Your booking is confirmed',
  html: bookingConfirmationTemplate({ booking, user })
});
```

### Trigger Points (via Supabase Database Webhooks or Edge Functions)

```
bookings INSERT (status='confirmed') → booking_confirmed email
bookings UPDATE (status='cancelled') → booking_cancelled email
requests INSERT → request_received email
requests UPDATE (status='quoted')   → quote_ready email
user_workflow_steps UPDATE (status='overdue') → step_overdue email
```

---

## In-App Notifications

### Current State
No in-app notification system exists yet. Notification badge shows 0.

### Target Implementation

#### Data Model
```sql
CREATE TABLE notifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) NOT NULL,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  href        TEXT,            -- Navigation link on click
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_unread_idx  ON notifications(user_id, is_read) WHERE NOT is_read;
```

#### Notification Component
Placed in the navigation header:

```typescript
// NotificationBell component
function NotificationBell() {
  const { count, notifications } = useNotifications();
  return (
    <div>
      <BellIcon />
      {count > 0 && <Badge>{count}</Badge>}
      <DropdownMenu>
        {notifications.map(n => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </DropdownMenu>
    </div>
  );
}
```

#### Realtime Badge Update
```typescript
// Subscribe to own new notifications
const channel = supabase
  .channel('user-notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    queryClient.invalidateQueries(['notifications', userId]);
    showToast(payload.new.title);
  })
  .subscribe();
```

---

## useNotifications Hook (Future)

`src/hooks/useNotifications.ts`

```typescript
interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

function useNotifications(): UseNotificationsResult {
  const { profile } = useAppStore();
  // Fetch from notifications table
  // Filter: user_id = profile.id
  // Order: created_at DESC
  // Limit: 20 most recent
}
```

---

## Notification Templates (Email)

### Booking Confirmed
```
Subject: Your DALC booking is confirmed ✓

Dear {full_name},

Your booking has been confirmed.

Service:     {experience_title}
Date:        {slot_date} at {slot_start_time}
Reference:   {booking_reference}
Ticket:      {ticket_code}
Total:       AED {total_amount}

Your experience awaits. Questions? Contact us at concierge@dalc.ae.

The DALC Team
```

### Quote Ready
```
Subject: Your DALC concierge quote is ready

Dear {full_name},

Our team has prepared a quote for your request.

Request:     {description_truncated}
Amount:      AED {quote_amount}
Details:     {quote_details}

To confirm: [Accept Quote]   [View in My Requests]

This quote is valid for 48 hours.

The DALC Team
```

---

## Push Notifications (Future)

When DALC is built as a PWA (Progressive Web App):

1. Register service worker in `index.tsx`
2. Request notification permission from user
3. Subscribe to Web Push via Supabase Edge Function
4. Store push subscription on the `profiles` record
5. Edge Functions send Web Push on critical events (same trigger points as email)

**Use case:** Time-sensitive reminders — "Your experience starts in 2 hours", "Your yacht departs in 1 hour".

---

## Scalability Notes

- **Notification preferences:** Add a `notification_preferences` table — users control which notification types they receive per channel (email/push/in-app).
- **Digest emails:** Instead of per-event transactional emails, offer a "weekly digest" preference for lower-priority notifications.
- **WhatsApp notifications:** Many UAE users prefer WhatsApp. Integrate Twilio WhatsApp API or Meta's Cloud API for high-value notifications (booking confirmed, concierge message).
- **Translation:** Notifications in Arabic for Arabic-speaking users based on `profiles.nationality` — major unlock for UAE user retention.
