# Execution Plan
> Last updated: 2026-03-20
> Focus: booking flow / data integrity / admin control / revenue logic
> All findings verified against live code

---

## Top 10 Critical Blockers

### 1. No payment processing — zero revenue
**Area**: Revenue logic
No Stripe, no PaymentIntent, no webhook, no `payments` table. Bookings confirm with no financial transaction. The platform cannot charge a customer.
**Blocked until**: Stripe integrated, webhook live, booking confirmation gated on payment.

---

### 2. Availability always returns `true` — double-booking guaranteed
**Area**: Booking flow
`lib/transport.ts` calls `check_transport_availability` + `get_transport_time_slots`.
`lib/experiences.ts` calls `check_experience_capacity` + `get_experience_slots`.
None of these RPCs exist. The catch block returns `{ available: true }`. Every slot on every date shows as open.
**File**: `src/lib/transport.ts`, `src/lib/experiences.ts`
**Blocked until**: Real overlap queries against `transport_bookings` / `experience_bookings` replace the dead RPC calls.

---

### 3. `profiles` vs `users` table split — silent data loss
**Area**: Data integrity
`lib/auth.ts` → reads `profiles`. Auth state, AdminGuard, profile display all source from `profiles`.
`ProfilePage.tsx:180` + `useUser.ts:34` → write/read `users`. These tables are not synced.
Every profile edit the user saves goes to a table the app never reads back from.
**Files**: `src/hooks/useUser.ts`, `src/pages/profile/ProfilePage.tsx`, `src/lib/auth.ts`
**Blocked until**: All reads/writes consolidated to `profiles`. `users` table references removed.

---

### 4. `specialRequests` silently dropped on every transport booking
**Area**: Booking flow / data integrity
`BookingForm.tsx:28` — `specialRequests` collected in state.
`BookingForm.tsx:70–78` — `onSubmit` payload: `service_id`, `user_id`, `pickup_date`, `return_date`, `pickup_location`, `duration_hours`, `quoted_price`. No `special_requests`.
The field is displayed to the user, collected, and silently discarded.
**File**: `src/components/transport/BookingForm.tsx`
**Blocked until**: `special_requests: specialRequests` added to payload + column confirmed in `transport_bookings`.

---

### 5. Request form hardcodes `category: 'dining'` — all requests miscategorized
**Area**: Booking flow / admin control
`Request.tsx:40` — `category: 'dining' as Category` is hardcoded regardless of the venue or user selection.
Admin sees every request as a dining request. Routing, filtering, and supplier assignment are broken at the source.
**File**: `src/pages/Request.tsx`
**Blocked until**: Actual category derived from `searchParams.get('category')` or venue context and passed dynamically.

---

### 6. No booking confirmation notifications — users hear nothing
**Area**: Booking flow
`requestNotifications.ts` and `supplierNotifications.ts` are entirely `console.info`. Zero email, push, or in-app delivery.
A user submits a booking and receives no confirmation. They have no visibility into status changes.
**Files**: `src/platform/notifications/requestNotifications.ts`, `src/platform/notifications/supplierNotifications.ts`
**Blocked until**: Minimum — transactional email on booking create and on status change to `confirmed`.

---

### 7. No server-side price validation — price manipulation is trivial
**Area**: Revenue logic
`BookingForm.tsx:calculatePrice()` runs entirely client-side. The computed `quoted_price` is passed directly in the booking payload. There is no server check that the quoted price matches the service's actual `price_from`.
Any user can modify the payload and submit any price they want.
**Files**: `src/components/transport/BookingForm.tsx`, `src/lib/transport.ts`
**Blocked until**: Price is recomputed server-side (DB function or Edge Function) before the booking record is written, or at minimum verified in the admin confirm step.

---

### 8. `useAuth.ts` dead stub — latent developer trap
**Area**: Data integrity / admin control
`src/features/auth/useAuth.ts` always returns `{ user: null, isAuthenticated: false }`. It is never imported by anything in the codebase. The real auth is wired in `App.tsx → AuthListener → Zustand`.
Any developer who discovers this file and uses it will silently break auth with no error thrown.
**File**: `src/features/auth/useAuth.ts`
**Blocked until**: File deleted. Auth source documented at `src/App.tsx`.

---

### 9. Venue ID generated from name slug — admin data collision
**Area**: Admin control / data integrity
`AdminVenueForm.tsx` generates IDs as `name.toLowerCase().replace(/[^a-z0-9]+/g, '-')`. No UUID.
"Burj Al Arab" and "Burj Al Arab Hotel" produce `burj-al-arab` — the second create silently overwrites the first.
**File**: `src/admin/pages/AdminVenueForm.tsx`
**Blocked until**: `crypto.randomUUID()` used for new venues. Slug kept as a separate display field.

---

### 10. Google Maps API key committed to git
**Area**: Security
`VITE_GOOGLE_MAPS_API_KEY` is in `.env` (root level). This file is not in `.gitignore`. The key is also embedded in the client Vite bundle at build time — it is publicly accessible regardless.
**Files**: `.env`, `.gitignore`
**Blocked until**: Key rotated in Google Cloud Console. `.env` added to `.gitignore`. Key restricted to `VITE_*` use only in a fresh `.env.local`.

---

## Top 10 Fastest Wins

Each verified against actual code. No new features — targeted fixes only.

| # | Task | File | Effort | Impact |
|---|---|---|---|---|
| 1 | Delete `useAuth.ts` — dead stub, developer trap | `src/features/auth/useAuth.ts` | 2 min | Removes silent auth breakage risk |
| 2 | Add `special_requests: specialRequests` to `onSubmit` payload | `src/components/transport/BookingForm.tsx:70` | 5 min | Stops data loss on every transport booking |
| 3 | Replace `category: 'dining'` with `searchParams.get('category')` | `src/pages/Request.tsx:40` | 10 min | Fixes request categorization in DB |
| 4 | Replace name-slug ID with `crypto.randomUUID()` | `src/admin/pages/AdminVenueForm.tsx` | 5 min | Prevents venue record overwrites |
| 5 | Add `.env` to `.gitignore` + rotate Google Maps key | `.gitignore`, Google Cloud Console | 10 min | Stops key exposure going forward |
| 6 | Remove dead links (`/profile/security`, `/profile/settings`) | `src/pages/profile/ProfilePage.tsx:194–195` | 10 min | Removes broken navigation in production |
| 7 | Remove dead `/contact` links from transport pages | Transport listing pages | 10 min | Same |
| 8 | Delete 6 dead files: `CarFleet.tsx`, `ChauffeurFleet.tsx`, `JetFleet.tsx` + 3 data files | `src/components/transport/`, `src/data/transport/` | 5 min | Removes dead code from bundle |
| 9 | Delete 5 root-level duplicate pages (`Home.tsx`, `Login.tsx`, `Register.tsx`, `Onboarding.tsx`, `MyRequests.tsx`) | `src/pages/` | 5 min | Eliminates confusion about which file is active |
| 10 | Delete 3 empty barrel exports | `src/features/booking/index.ts`, `concierge-request/index.ts`, `relocation-intake/index.ts` | 2 min | Removes noise |

**Total estimated time: ~64 minutes for all 10.**

---

## Exact Build Order to Production

### Phase 1 — Data Integrity (do before anything else)
Nothing built on top of corrupted data survives.

1. **Consolidate user tables** — migrate `useUser.ts` and `ProfilePage.handleEditSave` to `profiles`. Verify with a real login + profile edit.
2. **Fix `specialRequests`** — add to `BookingForm.onSubmit`. Confirm `transport_bookings.special_requests` column exists in schema.
3. **Fix request category** — read from `searchParams.get('category')` or a passed prop. Add `category` to the URL when linking to `/request`.
4. **Fix venue ID** — `crypto.randomUUID()` for new venues. Keep slug as display-only `slug` field.

**Gate**: All four data writes land in the correct table with correct values. Verified via Supabase table editor.

---

### Phase 2 — Security
5. **Rotate Google Maps key** → restrict to current domain in Google Cloud Console.
6. **Add `.env` to `.gitignore`** → move `VITE_GOOGLE_MAPS_API_KEY` to `.env.local`.
7. **Audit Supabase RLS** in dashboard → confirm: users read only own `profiles`, `requests`, `bookings`. Confirm: `admin` role is enforced at DB level, not just client-side guard.

**Gate**: Direct Supabase API call without auth token returns 0 rows on protected tables.

---

### Phase 3 — Booking Flow (core user path)
8. **Implement real availability checking** — replace dead RPC calls in `lib/transport.ts` and `lib/experiences.ts` with inline date-range overlap queries:
   ```sql
   SELECT id FROM transport_bookings
   WHERE service_id = $1
     AND status NOT IN ('cancelled')
     AND pickup_date < $3
     AND return_date > $2
   ```
   If any row returned → unavailable.
9. **Wire availability to booking form** — disable date/time slots that return unavailable. Show "Unavailable" vs "Available" on the calendar.
10. **Add `special_requests` column to `transport_bookings`** if missing → new migration.
11. **End-to-end booking test** — log in, select service, pick date, submit → verify row in `transport_bookings` with correct `user_id`, `service_id`, `pickup_date`, `special_requests`.

**Gate**: A complete booking round-trip works in the live environment. Double-booking same slot is prevented.

---

### Phase 4 — Admin Control
12. **Verify all admin routes** — open each admin page, confirm data loads. The `src/pages/admin/` files are re-export shims (confirmed) — no action needed there.
13. **Fix venue form** — UUID on create, keep slug for display.
14. **Add create/edit for transport services** — `AdminTransport` currently list-only. Add `AdminTransportForm` mirroring `AdminVenueForm` pattern.
15. **Add create/edit for experience services** — same pattern.
16. **Admin request workflow** — confirm status transitions work end-to-end: `pending → acknowledged → assigned → confirmed`. Verify each step writes to `request_status_log`.

**Gate**: Admin can create a venue, a transport service, and an experience. Admin can move a request through full lifecycle.

---

### Phase 5 — Revenue (payments gate)
This is the only phase that makes the platform generate money.

17. **Add `payments` table** — new migration:
    ```sql
    CREATE TABLE payments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id uuid REFERENCES requests(id),
      booking_type text, -- 'transport' | 'experience' | 'stays' | 'concierge'
      stripe_payment_intent_id text,
      amount_aed numeric(10,2),
      currency text DEFAULT 'AED',
      status text DEFAULT 'pending', -- pending | paid | refunded | failed
      created_at timestamptz DEFAULT now()
    );
    ```
18. **Stripe integration** — `src/lib/payments.ts`:
    - `createPaymentIntent(amount, bookingId)` → calls Stripe API via Edge Function (keep secret key server-side)
    - Return `client_secret` to client
    - Client uses Stripe Elements to collect card
19. **Stripe webhook** — Supabase Edge Function handles `payment_intent.succeeded` → sets `payments.status = 'paid'`
20. **Gate booking confirmation on payment** — booking status stays `pending` until webhook fires. Admin sees `unpaid` flag. Confirmation email only sends after `paid`.
21. **Add checkout page** — `src/pages/checkout/CheckoutPage.tsx` — Stripe Elements form, order summary, price breakdown.

**Gate**: Complete purchase flow: browse → book → pay → receive confirmation email → booking shows `confirmed` + `paid` in admin.

---

### Phase 6 — Notifications
22. **Choose provider** — Resend (simplest API, free tier covers early usage).
23. **Install and configure** — `RESEND_API_KEY` in Supabase Edge Function secrets (never in client env).
24. **Replace `console.info` in `requestNotifications.ts`**:
    - Booking created → email to user with details + reference number
    - Status changed to `confirmed` → email to user with final confirmation
    - Status changed to any → email to user with update
25. **Replace `console.info` in `supplierNotifications.ts`**:
    - New assignment → email to supplier with booking details
26. **Admin new-request alert** — email or Slack webhook when a new request enters `pending`.

**Gate**: Submit a booking, receive email within 60 seconds. Admin receives alert.

---

### Phase 7 — Missing Routes
27. `/profile/security` — password change form (Supabase `updateUser`)
28. `/profile/settings` — notification preference toggles, stored in `profiles.preferences jsonb`
29. `/contact` — contact form or remove links from transport pages

---

### Phase 8 — Performance & Scale
30. **Pagination on all admin list views** — currently fetches all records. Add `range(offset, limit)` to all admin queries.
31. **`ErrorBoundary` on all route-level pages** — currently partial coverage.
32. **`React.memo` on card components** — `VenueCard`, `PropertyCard`, `ServiceCard` re-render on every list scroll.
33. **Real data in DB** — seed `transport_services`, `experience_services` with actual inventory. Remove mock fallback arrays from `lib/transport.ts` and `lib/experiences.ts` once data exists.

---

## Production Readiness Checklist

```
Data Integrity
  [ ] All user data writes to one table (profiles)
  [ ] All booking fields reach the database
  [ ] All requests have correct category
  [ ] All venue IDs are UUIDs

Security
  [ ] API keys not in git
  [ ] RLS confirmed on all user-facing tables
  [ ] Stripe secret key never exposed to client

Booking Flow
  [ ] Availability check prevents double-booking
  [ ] Complete booking round-trip verified in production
  [ ] Booking confirmation gated on payment

Revenue
  [ ] Stripe payment flow end-to-end
  [ ] Webhook updates booking status
  [ ] Admin can see paid / unpaid bookings

Notifications
  [ ] Booking confirmation email sends
  [ ] Status change email sends
  [ ] Admin receives new-request alert

Admin
  [ ] All entities manageable from admin panel
  [ ] Request lifecycle works end-to-end
  [ ] No broken routes in admin sidebar
```
