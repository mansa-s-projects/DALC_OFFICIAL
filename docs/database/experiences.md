# Database: Experiences

## Overview

The experiences vertical uses two tables: `experience_services` (the catalogue) and `experience_bookings` (booking records). These tables power the Experiences feature (Pillar #2) and the Nightlife sub-feature.

---

## `experience_services`

The catalogue of all bookable experiences.

### Full Schema
```sql
CREATE TABLE public.experience_services (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id         UUID REFERENCES public.suppliers(id),
  subcategory         TEXT NOT NULL, -- nightlife|adventure|dining|water|sky|wellness|culture
  service_type        TEXT NOT NULL, -- event|recurring|on_demand|seasonal
  title               TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  short_description   TEXT,
  images              TEXT[],

  -- Pricing
  base_price          DECIMAL(10,2),
  pricing_model       TEXT NOT NULL, -- per_person|per_group|fixed|tiered|free
  currency            TEXT DEFAULT 'AED',
  tiers               JSONB,         -- PricingTier[] for tiered model

  -- Availability
  time_slots          JSONB,         -- TimeSlotConfig[]
  max_capacity        INT,
  current_bookings    INT DEFAULT 0,
  availability_type   TEXT,          -- on_demand|scheduled|seasonal|by_request
  recurrence_pattern  TEXT,          -- null or "weekly/friday"

  -- Location
  location            TEXT,
  address             TEXT,
  coordinates         JSONB,         -- { lat, lng }

  -- Details
  duration_hours      DECIMAL(4,2),
  min_participants    INT DEFAULT 1,
  max_participants    INT,
  includes            TEXT[],
  excludes            TEXT[],
  requirements        TEXT[],

  -- Catalogue flags
  is_published        BOOLEAN DEFAULT false,
  is_featured         BOOLEAN DEFAULT false,
  is_trending         BOOLEAN DEFAULT false,
  trending_score      DECIMAL(5,2) DEFAULT 0,
  tags                TEXT[],

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes
```sql
CREATE INDEX experience_services_subcategory_idx ON public.experience_services(subcategory);
CREATE INDEX experience_services_published_idx ON public.experience_services(is_published);
CREATE INDEX experience_services_trending_idx ON public.experience_services(trending_score DESC);
CREATE INDEX experience_services_slug_idx ON public.experience_services(slug);
```

---

## `experience_bookings`

Booking records for purchased experiences.

### Full Schema
```sql
CREATE TABLE public.experience_bookings (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id       UUID REFERENCES public.experience_services(id) NOT NULL,
  user_id             UUID REFERENCES public.profiles(id) NOT NULL,
  booking_reference   TEXT UNIQUE NOT NULL,
  ticket_code         TEXT UNIQUE NOT NULL,  -- Format: DALC-XXXX-XXXX

  -- Booking details
  tier_name           TEXT,
  tier_price          DECIMAL(10,2),
  quantity            INT NOT NULL DEFAULT 1,
  total_amount        DECIMAL(10,2) NOT NULL,
  slot_date           DATE,
  slot_start_time     TIME,
  slot_end_time       TIME,

  -- Status
  status              TEXT DEFAULT 'pending',
                      -- pending|confirmed|active|completed|cancelled|refunded

  -- Payment
  payment_status      TEXT DEFAULT 'pending',
                      -- pending|processing|completed|failed|refunded
  payment_method      TEXT,

  special_requests    TEXT,
  notes               TEXT,

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes
```sql
CREATE INDEX experience_bookings_user_id_idx ON public.experience_bookings(user_id);
CREATE INDEX experience_bookings_experience_id_idx ON public.experience_bookings(experience_id);
CREATE INDEX experience_bookings_status_idx ON public.experience_bookings(status);
CREATE INDEX experience_bookings_slot_date_idx ON public.experience_bookings(slot_date);
```

---

## JSONB Fields

### `tiers` (experience_services)
Used only when `pricing_model = 'tiered'`:
```typescript
tiers: {
  name: string;           // "Standard" | "VIP" | "Ultra VIP"
  price: number;          // e.g. 500
  currency: string;       // "AED"
  description: string;    // "Open floor access + 1 drink"
  max_capacity?: number;  // optional per-tier capacity
}[]
```

### `time_slots` (experience_services)
```typescript
time_slots: {
  id: string;             // UUID
  day_of_week?: number;   // 0=Sunday ... 6=Saturday (for recurring)
  start_time: string;     // "20:00"
  end_time: string;       // "23:00"
  max_capacity: number;
  current_bookings: number;
  date?: string;          // ISO date (for one-time events)
}[]
```

---

## Ticket Code Generation

```typescript
// Generates codes in format DALC-XXXX-XXXX
// where XXXX is 4 random uppercase alphanumeric chars
function generateTicketCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const random4 = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `DALC-${random4()}-${random4()}`;
}
```

---

## Capacity Management

The `checkCapacity()` function checks remaining spots before booking:

```typescript
async function checkCapacity(experienceId: string, slotId: string): Promise<{
  available: boolean;
  remaining: number;
  totalCapacity: number;
  currentBookings: number;
}>
```

On booking confirmation, `current_bookings` is incremented via DB trigger or application logic.

---

## Service Type Logic

| Type | Slot Behaviour | Date Required |
|------|---------------|---------------|
| `event` | Fixed date + time | Yes |
| `recurring` | Repeats on `day_of_week` | User picks next occurrence |
| `on_demand` | User picks any date | Yes (24hr advance) |
| `seasonal` | Available within date range | Yes |

---

## RLS Policies

```sql
-- Read: published experiences visible to all authenticated users
"Experience services viewable when published"
  FOR SELECT USING (is_published = true OR auth.role() = 'authenticated')

-- Bookings: user sees only own bookings
"Users can view own experience bookings"
  FOR SELECT USING (user_id = auth.uid())

"Users can create own bookings"
  FOR INSERT WITH CHECK (user_id = auth.uid())

-- Admin full access
"Admins have full access"
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
```

---

## Mock Data Summary

10 seeded experiences in `src/lib/experiences.ts` (`MOCK_EXPERIENCES`):

| Slug | Subcategory | Price Model | Price |
|------|-------------|-------------|-------|
| `aura-skypool-experience` | nightlife | per_person | AED 800 |
| `white-dubai-friday-night` | nightlife | tiered | AED 500–3,500 |
| `desert-dune-bashing-bbq` | adventure | per_person | AED 350 |
| `skydive-dubai` | adventure | per_person | AED 2,200 |
| `tresind-studio-dining` | dining | per_person | AED 950 |
| `shark-safari-dubai-aquarium` | water | per_person | AED 600 |
| `dubai-helicopter-tour` | sky | per_person | AED 1,100 |
| `anantara-spa-hammam` | wellness | per_person | AED 850 |
| `al-fahidi-heritage-walk-dinner` | culture | per_person | AED 280 |
| `dubai-art-season-opening` | culture | free | Free |

---

## Scalability Notes

- **Capacity realtime sync:** Use Supabase Realtime to subscribe to `current_bookings` changes on a specific experience, so multiple concurrent users see live availability.
- **Waitlist:** Add a `experience_waitlist` table — when capacity is full, users can join a waitlist and are notified if a spot opens.
- **Multi-session events:** Add a `parent_experience_id` FK to group multiple sessions of the same recurring event.
- **Supplier self-publishing:** When supplier marketplace is live, suppliers create and manage their own listings with admin approval before `is_published = true`.
