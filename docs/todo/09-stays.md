# TODO: Stays / Travel — Remaining Work

> Priority: 🟡 MEDIUM — Stays vertical is well-built; flights bug is critical

---

## Current State

| Page | Route | Status |
|------|-------|--------|
| Travel Hub | `/travel` | ✅ Built |
| Hotels | `/travel/hotels` | ✅ Built |
| Villas | `/travel/villas` | ✅ Built |
| Residences | `/travel/residences` | ✅ Built |
| Stay Detail | `/travel/:type/:id` | ✅ Built with `PriceCalculator`, availability calendar |
| Flights | `/travel/flights` | 🔴 BUG — see `docs/todo/03-travel-flights.md` |

---

## Tasks

### Task 1: Fix Flights — See Dedicated File

This is documented separately. See [docs/todo/03-travel-flights.md](./03-travel-flights.md).

**Summary**: `src/pages/travel/Flights.tsx` re-exports `JetsList`. Must be replaced with a real Flights inquiry page.

---

### Task 2: `stays_availability` Calendar Data Seeding

The `StayDetail` page uses a `PriceCalculator` + availability calendar. This depends on `stays_availability` table having real data.

**Action needed**:
- Confirm `stays_availability` table exists (check `supabase/schema.sql` or migrations)
- If missing, create:
  ```sql
  CREATE TABLE stays_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES stays_properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    price_override DECIMAL(10,2),
    min_nights SMALLINT DEFAULT 1,
    UNIQUE(property_id, date)
  );
  ```
- Seed 3-month availability window for each property on loading database

---

### Task 3: Multi-Room / Multi-Unit Booking

For Hotels: allow booking multiple rooms.
For Villas/Residences: entire property only (already 1-unit).

**Hotel booking form upgrade**:
- "Number of rooms" selector (1–5)
- "Room type" selector (Standard, Deluxe, Suite, Penthouse)
- Total price = `rooms * nights * room_rate[type]`

---

### Task 4: Special Requests / Preferences

Add a "Special Requests" section at the end of the booking form:
- Early check-in / Late check-out toggle
- Airport transfer (links to `/transport/chauffeur`)
- Champagne on arrival
- Dietary requirements (for villas with chef service)
- Birthday / anniversary setup
- Baby cot / extra bed

These store in `stays_bookings.special_requests JSONB[]`

---

### Task 5: Property Comparison

Allow users to select 2–3 properties and compare side-by-side:

| Feature | Property A | Property B | Property C |
|---------|-----------|-----------|-----------|
| Price/night | AED 2,400 | AED 3,800 | AED 1,900 |
| Bedrooms | 1 | 3 | 2 |
| Pool | ✅ | ✅ | ❌ |
| Beach access | ❌ | ✅ | ❌ |
| Chef service | ❌ | ✅ | ❌ |

Add a floating comparison bar at the bottom when 2+ properties are selected.

---

### Task 6: Long-Stay / Monthly Rates

Residences are intended for long-stay (1–12 months). Ensure:
- Monthly pricing tier in addition to nightly rate
- "Contact for long-stay pricing" CTA for 30+ day requests
- Submit as `concierge_requests` with `type = 'long_stay_inquiry'`

---

### Task 7: Travel Hub — Trip Builder CTA

Add a section on the Travel Hub: "Build your complete Dubai trip"

This cross-pillar CTA bundles:
- Stay (hotel/villa)
- Transport (airport pickup)
- Experiences (3-day curated itinerary)

Clicking → creates a pre-filled concierge request with `type = 'trip_package'` or navigates to a trip builder wizard.

---

### Task 8: Saved Properties (Wishlist)

Users can save/heart properties:
- Heart icon on property cards
- Saved to `profiles.saved_items JSONB[]` or a dedicated `saved_properties` table
- Accessible via `/profile?tab=saved` or `/my-saves`

```sql
CREATE TABLE saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  entity_type TEXT, -- 'stay' | 'experience' | 'venue' | 'transport'
  entity_id UUID,
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);
```

---

### Task 9: Reviews on Stays

Post-checkout review flow (same pattern as experiences):
- After `status = 'checked_out'`: trigger review invitation
- 1–5 star rating per category: Cleanliness, Location, Service, Value
- Displayed on property detail page with average rating badge

Use the generic `reviews` table from `docs/todo/08-transport.md` with `entity_type = 'stay'`.

---

## Acceptance Criteria

- [ ] `/travel/flights` bug fixed (see 03-travel-flights.md)
- [ ] `stays_availability` table seeded with 90-day window per property
- [ ] Hotel booking form supports room type and count
- [ ] Special requests section in booking form
- [ ] At least 2 properties in each category (Hotels/Villas/Residences) for demo
- [ ] Long-stay monthly pricing option on Residences
- [ ] Trip Builder CTA on Travel Hub
- [ ] Wishlist save icon works and persists to Supabase
