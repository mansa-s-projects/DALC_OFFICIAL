# Database: Bookings

## Overview

All 5 verticals use a consistent booking model. Each has its own dedicated `*_bookings` table, but they share common patterns: booking references, status state machines, payment tracking, and user ownership.

---

## Common Booking Patterns

### Booking Reference
Every booking gets a unique `booking_reference` string. Format: `DALC-{VERTICAL}-{RANDOM}`:
- Experiences: `DALC-EXP-A3F2K9`
- Transport: `DALC-TRP-B7X1M4`
- Stays: `DALC-STY-C9P5R2`
- Business: `DALC-BIZ-D1N8T6`

### Status State Machine (All Verticals)
```
pending → confirmed → active → completed
              ↓
          cancelled
              ↓
          refunded
```

| Status | Meaning |
|--------|---------|
| `pending` | Booking created, awaiting confirmation |
| `confirmed` | Payment taken or booking approved |
| `active` | Service in progress (for date-range bookings) |
| `completed` | Service delivered |
| `cancelled` | Cancelled by user or admin |
| `refunded` | Full or partial refund processed |

### Payment Status (All Verticals)
```
pending → processing → completed
              ↓
           failed
           refunded
```

---

## Experience Bookings

Table: `experience_bookings`

**Unique fields:**
- `ticket_code` — `DALC-XXXX-XXXX` format, unique per booking
- `quantity` — number of tickets
- `tier_name` / `tier_price` — selected pricing tier
- `slot_date` / `slot_start_time` / `slot_end_time` — time slot

**Key relationships:**
- `experience_id` → `experience_services.id`
- `user_id` → `profiles.id`

**No relocation link** — experience bookings are standalone.

---

## Transport Bookings

Table: `transport_bookings`

**Unique fields:**
- `pickup_location` / `dropoff_location` — text addresses
- `start_date` / `end_date` — booking window
- `duration_hours` — calculated duration
- `passengers` — number of passengers

**Relocation link:**
- `relocation_profile_id` → `relocation_profiles.id` (optional)
- `workflow_step_id` → `user_workflow_steps.id` (optional)

---

## Stays Bookings

Table: `stays_bookings`

**Unique fields:**
- `check_in_date` / `check_out_date` — date range
- `nights` — computed number of nights
- `guests` — number of guests
- `nightly_rate` — rate applied
- `total_nights_cost` — rate × nights
- `service_fee` — percentage-based fee
- `security_deposit` — refundable deposit
- `total_amount` — all-in total
- `booking_type` — `short_term` | `long_term` | `relocation`

**Relocation link:**
- `relocation_profile_id` → `relocation_profiles.id`

---

## Business Bookings

Table: `business_bookings`

**Unique fields:**
- `workflow_id` → `user_workflows.id` — linked compliance workflow
- `workflow_status` — mirrors `user_workflows.status`
- `current_step` / `total_steps` — workflow progress
- `documents_submitted` — boolean
- `compliance_completed` — boolean

**Relocation link:**
- `relocation_profile_id` → `relocation_profiles.id`

---

## Booking Lifecycle Diagrams

### Experience Booking
```
User selects experience + tier + slot
  → POST createExperienceBooking({ experienceId, tierId, slotId, quantity })
  → checkCapacity() validates spots available
  → Create experience_bookings record (status: pending)
  → Generate ticket_code = DALC-XXXX-XXXX
  → Generate booking_reference = DALC-EXP-XXXXXX
  → Increment experience_services.current_bookings
  → Return confirmed booking → status: confirmed
  → Navigate to success page
```

### Stays Booking
```
User selects property + dates + guests
  → checkAvailability(propertyId, checkIn, checkOut)
  → calculatePrice(propertyId, nights) → PriceBreakdown
  → User confirms PriceBreakdown
  → POST createStaysBooking(input)
  → Create stays_bookings record (status: pending)
  → Block dates in stays_availability (is_available: false)
  → Process payment → status: confirmed
  → Link relocation_profile_id if active relocation
```

### Business Booking
```
User selects service → starts booking
  → POST createBusinessBooking(input)
  → Create business_bookings record (status: pending)
  → generateDefaultWorkflow(service.workflow_template)
    → Creates user_workflows record (linked)
    → Creates user_workflow_steps records
  → Admin reviews → confirms booking → status: confirmed
  → User begins compliance checklist
  → Steps completed over time
  → All steps done → status: completed
```

---

## Cross-Table Booking Queries (Admin)

### All bookings by user (admin view)
```sql
SELECT 'experience' as type, b.id, b.booking_reference, b.status, b.total_amount, b.created_at
FROM experience_bookings b WHERE b.user_id = $userId
UNION ALL
SELECT 'transport', b.id, b.booking_reference, b.status, b.total_amount, b.created_at
FROM transport_bookings b WHERE b.user_id = $userId
UNION ALL
SELECT 'stays', b.id, b.booking_reference, b.status, b.total_amount, b.created_at
FROM stays_bookings b WHERE b.user_id = $userId
UNION ALL
SELECT 'business', b.id, b.booking_reference, b.status, b.total_amount, b.created_at
FROM business_bookings b WHERE b.user_id = $userId
ORDER BY created_at DESC;
```

### Booking metrics for admin dashboard
```sql
SELECT
  COUNT(*) FILTER (WHERE status = 'pending')   as pending_count,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_count,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  SUM(total_amount) FILTER (WHERE status IN ('confirmed','completed')) as total_revenue
FROM experience_bookings
WHERE created_at > NOW() - INTERVAL '30 days';
-- Repeat UNION for all other booking tables
```

---

## Cancellation Policy (Future)

No cancellation policy is enforced in code yet. Future implementation:

| Booking Type | Cancellation Window | Refund |
|-------------|---------------------|--------|
| Experience | >24hr before | 100% |
| Experience | <24hr before | 0% |
| Transport — Cars | >4hr before | 100% |
| Transport — Yachts/Jets | >48hr before | 50% |
| Stays — Short-term | >48hr before | 100% |
| Stays — Long-term | >7 days | 50% |
| Business | Before work starts | 100% |

---

## Scalability Notes

- **Unified bookings view:** Consider a `bookings_unified` PostgreSQL view that UNION-selects from all 4 booking tables — simplifies admin dashboards and reporting.
- **Payment integration:** Add `payment_intent_id` (Stripe) or `payment_reference` (Checkout.com) to all booking tables for payment reconciliation.
- **Refund tracking:** Add `refund_amount` and `refund_reason` fields to all booking tables.
- **Booking reminders:** Add a background job (Supabase Edge Function on a cron schedule) that sends reminder notifications 24 hours before experience and transport bookings.
- **Rating/review trigger:** When a booking moves to `completed`, trigger a review request notification.
