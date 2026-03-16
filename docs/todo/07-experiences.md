# TODO: Experiences — Remaining Work

> Priority: 🟡 MEDIUM — Core is solid, polish and content depth needed

---

## Current State

| Page | Route | Status |
|------|-------|--------|
| Experiences Hub | `/experiences` | ✅ Built |
| Adventure | `/experiences/adventure` | ✅ Built |
| Dining Experiences | `/experiences/dining` | ✅ Built |
| Water | `/experiences/water` | ✅ Built |
| Sky | `/experiences/sky` | ✅ Built |
| Wellness | `/experiences/wellness` | ✅ Built |
| Culture | `/experiences/culture` | ✅ Built |
| Experience Detail | `/experiences/:id` | ✅ Built with `TimeSlotPicker`, `TierSelector` |

---

## Tasks

### Task 1: Upcoming Events Calendar on Hub

The Experiences Hub currently shows category tiles. Add a "This Week in Dubai" events section below the main categories.

**Component**: `UpcomingEventsStrip`

- Shows next 5–7 days of experiences with available time slots
- Data: `experience_services` filtered by `next_available_date BETWEEN now() AND now() + interval '7 days'`
- Horizontal scroll on mobile
- Card shows: image, name, date, price, "Book Now" CTA

---

### Task 2: Waitlist on Sold-Out Time Slots

When `capacity_remaining = 0` for a time slot, the "Book" button should change to "Join Waitlist".

**Flow**:
1. User clicks "Join Waitlist"
2. Insert to `waitlist_entries` table: `{ user_id, experience_id, time_slot, created_at }`
3. Show: "You're on the waitlist. We'll notify you if a spot opens."
4. Admin panel / Edge Function: when a booking is cancelled, notify waitlist users

**Migration needed**: Create `waitlist_entries` table.

```sql
CREATE TABLE waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  experience_id UUID REFERENCES experience_services(id) ON DELETE CASCADE,
  time_slot TEXT,
  booking_date DATE,
  status TEXT DEFAULT 'waiting', -- 'waiting' | 'notified' | 'booked' | 'expired'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### Task 3: Wellness & Culture Content Seeding

These subcategories may have very few or no real entries in the database. 

**Seed data needed**:

**Wellness** (`category = 'wellness'`):
- Spa day at Anantara
- Desert yoga + meditation retreat
- Royal hammam experience
- Float therapy at Zero Gravity
- Sound healing session

**Culture** (`category = 'culture'`):
- Dubai Museum of the Future guided tour
- Old Dubai Creek & Gold Souk walking tour
- Getty Images Gallery Dubai
- Alserkal Avenue arts district tour
- Arabic calligraphy workshop
- Desert Bedouin camp overnight

Add these as seed entries to `supabase/seed.sql` or a new `seeds/experiences.sql`.

---

### Task 4: Experience Gift Packages

A "Gift an Experience" flow:

1. On any Experience Detail page: add "Give as a Gift" button
2. Opens a gift flow modal:
   - Recipient name + email
   - Gift message
   - Schedule delivery date
3. Generates a gift code / PDF voucher
4. Insert to `gift_vouchers` table (new)

**Migration needed**:
```sql
CREATE TABLE gift_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchaser_id UUID REFERENCES profiles(id),
  experience_id UUID REFERENCES experience_services(id),
  recipient_email TEXT,
  recipient_name TEXT,
  message TEXT,
  code TEXT UNIQUE DEFAULT substr(md5(random()::text), 0, 12),
  scheduled_delivery TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- 'pending' | 'delivered' | 'redeemed' | 'expired'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### Task 5: Group Booking Flow

Currently booking is for 1 person. Add a Group Booking option:

- "Book for a group of __ people"
- Validates against `capacity_remaining`
- Calculates group discount if `group_discount_threshold` is set on the experience
- Generates one booking record with count, not N individual records

---

### Task 6: Tier Comparison Popup

On the `TierSelector` component, add a "Compare tiers" expandable section showing a feature matrix:

| Feature | Silver | Gold | Platinum |
|---------|--------|------|---------|
| Private guide | ❌ | ❌ | ✅ |
| Transport included | ❌ | ✅ | ✅ |
| Champagne reception | ❌ | ❌ | ✅ |
| Photography session | ❌ | ✅ | ✅ |

---

### Task 7: Review & Rating System

After an experience is completed (`experience_bookings.status = 'completed'`):
- Send a review invitation (email + in-app notification)
- User can leave a 1–5 star rating + text review
- Reviews displayed on Experience Detail page

**Migration needed**:
```sql
CREATE TABLE experience_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES experience_bookings(id),
  user_id UUID REFERENCES profiles(id),
  experience_id UUID REFERENCES experience_services(id),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### Task 8: My Experiences — Profile Section

Add an "Experiences" tab to the user profile page showing:
- Upcoming bookings
- Past experiences (completed)
- Reviews left
- "Rebook" button for past experiences

---

## Acceptance Criteria

- [ ] Hub shows "This Week" upcoming events strip
- [ ] Sold-out time slots show "Join Waitlist" button
- [ ] Waitlist entry saves to Supabase
- [ ] Wellness & Culture have at least 5 seed entries each
- [ ] Gift an Experience modal works end-to-end
- [ ] Group booking calculates correct pricing and capacity
- [ ] Tier comparison matrix visible on detail page
- [ ] Review form appears after completed booking
- [ ] Profile shows experience booking history
