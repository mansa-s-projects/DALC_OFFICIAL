# TODO: Travel — Flights Bug Fix & Flights Page Build

> Priority: 🔴 CRITICAL — `/travel/flights` currently displays the Jet charter page

---

## The Bug

```tsx
// src/pages/travel/Flights.tsx — CURRENT (WRONG):
export { default } from '../../features/transport/pages/JetsList';
```

Navigating to `/travel/flights` shows the Transport Jets page. This is a critical content mismatch.

---

## Fix — Step 1: Remove Re-Export

Delete the accidental re-export and build the actual Flights page.

**File**: `src/pages/travel/Flights.tsx`

Replace entire file content with a proper Flights page (see spec below).

---

## Flights Page Spec

Flights is a **high-touch inquiry page**, not a self-serve booking engine. DALC does not manage flight inventory. Flights should route to a concierge-driven inquiry OR a partner redirect.

### Approach A (Recommended): Concierge Inquiry Flow

```
/travel/flights
  → "Tell us about your trip" form
  → Submitted as a concierge_requests record with type = 'flight_inquiry'
  → Admin/concierge team handles manually or via partner API
```

### Approach B: Partner API / iframe embed

```
/travel/flights
  → Embed partner: Amadeus, Skyscanner affiliate, etc.
  → Requires partner agreement
```

---

## Approach A — Implementation Plan

### New Page: `src/pages/travel/Flights.tsx`

```tsx
// FlightsPage component
// Shows:
// 1. Hero banner: "Private & Commercial Flights"
// 2. Two-option selector: "Commercial Flights" | "Private Charter"
// 3. For Commercial: redirect to partner or concierge inquiry form
// 4. For Private: soft redirect to /transport/jets
```

### Flight Inquiry Form Fields

| Field | Type | Notes |
|-------|------|-------|
| Trip type | Radio | One-way / Round-trip |
| From | Text | Origin city/airport |
| To | Text | Destination city/airport |
| Departure date | Date picker | min: today |
| Return date | Date picker | conditional on round-trip |
| Passengers | Number | 1–10 |
| Class | Select | Economy / Business / First |
| Additional notes | Textarea | optional |

### On Submit
- Insert to `concierge_requests` table:
  ```sql
  INSERT INTO concierge_requests (
    user_id, type, title, description, status
  ) VALUES (
    :userId, 'flight_inquiry', 'Flight Request: :origin → :destination', :formSummary, 'pending'
  )
  ```
- Show confirmation: "Your flight request has been received. Our team will contact you within 2 hours."
- Link to `/my-requests` to track status

---

## Additional Travel Hub Tasks

### Fix Travel Hub Flights Tile

In `src/pages/travel/TravelHub.tsx` (or wherever the hub is), ensure the "Flights" tile navigates to `/travel/flights` and not `/transport/jets`.

### Add Stays & Flights Context

The Travel vertical should feel unified. The hub shows: Hotels, Villas, Residences, Flights.

Ensure the hub card types and descriptions reflect each correctly.

---

## Acceptance Criteria

- [ ] `src/pages/travel/Flights.tsx` no longer re-exports `JetsList`
- [ ] `/travel/flights` shows a dedicated Flights inquiry page
- [ ] Page has commercial vs. private charter options
- [ ] Flight inquiry form submits to `concierge_requests`
- [ ] Confirmation shown after submission
- [ ] "View request" links to `/my-requests`
- [ ] Private charter option links to `/transport/jets`
- [ ] Travel Hub flights tile navigates correctly
