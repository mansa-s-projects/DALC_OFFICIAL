# TODO: Transport — Remaining Work

> Priority: 🟡 MEDIUM — Core is built, several booking flows need refinement

---

## Current State

| Page | Route | Status |
|------|-------|--------|
| Transport Hub | `/transport` | ✅ Built |
| Cars List | `/transport/cars` | ✅ Built |
| Yachts List | `/transport/yachts` | ✅ Built |
| Jets List | `/transport/jets` | ✅ Built |
| Car Detail | `/transport/cars/:id` | ✅ Built with `BookingForm`, `SpecTable` |
| Yacht Detail | `/transport/yachts/:id` | ✅ Built |
| Jet Detail | `/transport/jets/:id` | ✅ Built |

---

## Tasks

### Task 1: Yacht Booking Calendar Polish

The yacht booking currently has a date range picker. Ensure:

- [ ] `stays_availability` or `transport_availability` table is queried
- [ ] Already-booked (confirmed) date ranges are blocked/greyed in the calendar
- [ ] Multi-day charter prices calculate correctly: `daily_rate * number_of_days`
- [ ] Optional half-day rate for yachts < 8 hours
- [ ] "Captain included" vs. "Self-charter" option (if data supports)

```sql
-- Check if transport_availability table exists, if not:
CREATE TABLE transport_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES transport_services(id),
  date DATE,
  is_available BOOLEAN DEFAULT true,
  custom_price DECIMAL(10,2), -- override daily rate on specific dates
  notes TEXT
);
```

---

### Task 2: Jet "By Request" → Concierge Handoff

Jets are classified as `"by_request"` service type. Currently clicking Book on a Jet detail may show a standard form.

**Required flow**:
1. User clicks "Request Charter" on jet detail page
2. Opens a jet-specific inquiry form:
   - Origin airport / FBO
   - Destination airport / FBO
   - Departure date + time
   - Return date (if round-trip)
   - Passenger count
   - Catering preferences
   - Special requests
3. Submits to `concierge_requests` with `type = 'jet_charter'` + structured request details in JSONB
4. Confirmation: "Your charter request has been sent. Our aviation team will contact you within 1 hour."

**Implementation**:
```tsx
// JetDetail.tsx — replace/upgrade BookingForm for jets:
{service.booking_type === 'by_request' ? (
  <JetCharterRequestForm service={service} />
) : (
  <BookingForm service={service} />
)}
```

---

### Task 3: Car Rental — Filter by Availability Date

Add a date availability filter to the Cars list page:

```tsx
// CarsListPage.tsx
<AvailabilityDatePicker 
  onChange={(dates) => setFilterDates(dates)} 
/>
// Then filter services:
const availableCars = cars.filter(car => !hasConflict(car.id, filterDates));
```

This requires querying `transport_bookings` for confirmed bookings matching selected dates.

---

### Task 4: Chauffeur/Driver Service

Add a 4th transport category: **Chauffeur Services**

Route: `/transport/chauffeur`

Spec:
- Hourly chauffeur booking
- Airport transfers (fixed-price)
- Full-day hire
- Monthly driver hire (by_request)

This is distinct from car rental (driver-only, client uses their own time).

**New route needed**:
```tsx
<Route path="/transport/chauffeur" element={<ChauffeurList />} />
<Route path="/transport/chauffeur/:id" element={<ChauffeurDetail />} />
```

**Data**: Add `category = 'chauffeur'` entries to `transport_services` table.

---

### Task 5: Transport Hub — Dynamic Featured Cards

The transport hub likely has hardcoded featured services. Connect to real data:
```tsx
const { data: featured } = useTransportServices({ is_featured: true, limit: 3 });
```

Show animated "Popular Right Now" badge on any service with high recent booking count.

---

### Task 6: Add Reviews / Ratings to Transport

Post-rental reviews for cars and yachts:
- Rating 1–5 stars
- "Would you rent this again?"
- Displayed on service detail page as review strip

Same pattern as `experience_reviews` — create `transport_reviews` table or use a generic `reviews` table:

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  entity_type TEXT, -- 'transport' | 'experience' | 'stay' | 'venue'
  entity_id UUID,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### Task 7: Transport Booking Status Flow

When a user books a car or yacht, they should be able to track the booking status in "My Bookings" (profile section).

Status flow:
```
pending → confirmed → ready_for_pickup → active → completed
                    ↘ cancelled
```

The `BookingForm` confirm button should navigate to `/my-requests` (or a `/my-bookings` section) after submission.

---

## Acceptance Criteria

- [ ] Yacht calendar blocks out confirmed booking dates
- [ ] Multi-day charter price calculates correctly
- [ ] Jet detail shows `JetCharterRequestForm` instead of standard booking
- [ ] Jet charter submits to `concierge_requests` with type `jet_charter`
- [ ] Cars list has availability date filter
- [ ] Chauffeur Services page exists with hourly/transfer/daily options
- [ ] Transport hub uses live featured data
- [ ] Booking confirmation navigates to booking status page
