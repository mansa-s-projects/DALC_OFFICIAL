# Feature: Experiences

## Purpose

The Experiences feature covers all curated activities and leisure experiences across Dubai. It is the platform's largest content catalogue, spanning 7 distinct subcategories from adrenaline adventures to cultural tours to Michelin-star dining. Experiences are not mobility services (those live under Transport).

---

## Architecture

### Pages
| Page | Route | Component |
|------|-------|-----------|
| Hub | `/experiences` | `src/features/experiences/pages/ExperiencesHub.tsx` |
| Subcategory List | `/experiences/:subcategory` | `src/features/experiences/pages/SubcategoryList.tsx` |
| Experience Detail | `/experiences/:subcategory/:slug` | `src/features/experiences/pages/ExperienceDetail.tsx` |

> **Note:** The redundant `/category` segment in older routes has been removed. Legacy URL `/experiences/category` redirects to `/experiences`.

### Hooks
| Hook | File | Purpose |
|------|------|---------|
| `useExperiences` | `src/features/experiences/hooks/useExperiences.ts` | Fetch and filter experience listings |
| `useExperienceBooking` | `src/features/experiences/hooks/useExperienceBooking.ts` | Create + manage bookings |

### Service Library
`src/lib/experiences.ts` — Contains `MOCK_EXPERIENCES` (10 seeded experiences), `getExperiences()`, `getFeaturedExperiences()`, `getTrendingExperiences()`, `getUpcomingEvents()`, `checkCapacity()`, `createExperienceBooking()`.

### Types
`src/features/experiences/types.ts` — Full TypeScript definitions for all experience entities. Re-exported via shim at `src/types/experiences.ts`.

---

## Subcategories (7)

| Subcategory | DB Value | Sub-types | Key Examples |
|-------------|----------|-----------|--------------|
| Nightlife | `nightlife` | nightclub, rooftop-bar, beach-club, supper-club, cabaret | White Dubai, Aura Skypool |

> **Architecture note:** Nightlife is elevated to **Pillar 3** as a standalone feature (`src/features/nightlife/`). It has its own hub at `/nightlife` and its own hooks (`useVenues`, `useVenue`). The Nightlife subcategory within `experience_services` is accessible via `/experiences/nightlife` but the primary UX entry point is `/nightlife`.
| Adventure | `adventure` | desert-safari, dune-bashing, indoor-skydiving, quad-biking, rock-climbing | Desert dune bashing |
| Dining | `dining` | chefs-table, tasting-menu, private-dining, celebrity-chef, cooking-class | Tresind Studio, Hakkasan |
| Water | `water` | scuba-diving, snorkeling, wakeboarding, jet-ski, flyboard, boat-cruise, shark-safari | Shark Safari, flyboarding |
| Sky | `sky` | helicopter-tour, skydiving, paragliding, hot-air-balloon | Helicopter tour, skydiving at SkyDive Dubai |
| Wellness | `wellness` | spa-resort, hammam, yoga-retreat, cryotherapy, meditation, sound-healing | Anantara Spa hammam |
| Culture | `culture` | heritage-walk, museum-tour, art-season, cultural-dinner, cooking-class | Dubai Art Season, Al Fahidi walk |

---

## User Flows

### Flow 1: Discovery → Booking

```
User lands on /experiences (hub)
  → Auto-advancing hero carousel (3 slides, 5s interval)
  → 7 category cards displayed
  → Trending strip + Featured grid loaded from useFeaturedExperiences()
  → Upcoming events calendar with date badges

User clicks category card (e.g., "Water Activities")
  → Navigates to /experiences/category/water
  → SubcategoryList loads getExperiences({ subcategory: 'water' })
  → Results filtered + displayed as cards
  → User can apply filters: price range, date, availability

User clicks experience card (e.g., "Shark Safari")
  → Navigates to /experiences/category/water/shark-safari-dubai
  → ExperienceDetail loads getExperienceBySlug('shark-safari-dubai')
  → Shows: description, images, pricing tiers, time slots, capacity
  → User selects tier + time slot → "Book Now" button
```

### Flow 2: Ticket Booking

```
User selects experience + tier + time slot
  → createExperienceBooking(bookingInput)
  → Validates capacity: checkCapacity(experienceId, slotId) → { available, remaining }
  → If available:
    → Creates experience_bookings record
    → Generates ticket code: DALC-XXXX-XXXX
    → Confirms booking + sends confirmation
  → If at capacity:
    → Shows "Waitlist" or "Sold Out" state
```

### Flow 3: Upcoming Events

```
ExperiencesHub displays upcoming events
  → getUpcomingEvents() fetches experiences with service_type = 'event'
    filtered to future dates, sorted ascending
  → Displayed with date badge (day + month)
  → Each links to its ExperienceDetail page
```

---

## Pricing System

### Pricing Models
| Model | Description |
|-------|-------------|
| `per_person` | Fixed price per ticket (most common) |
| `per_group` | Fixed price for a group (regardless of size) |
| `fixed` | Flat fee for the experience |
| `tiered` | Multiple tiers with different prices (VIP, Standard, etc.) |
| `free` | No charge (e.g., gallery openings) |

### Tiered Pricing Structure
```typescript
tiers: PricingTier[] = [
  { name: 'Standard', price: 500, currency: 'AED', description: 'Open floor access' },
  { name: 'VIP', price: 1200, currency: 'AED', description: 'VIP section + bottle' },
  { name: 'Ultra VIP', price: 3500, currency: 'AED', description: 'Private area + premium bottles' }
]
```

---

## Capacity Management

Each experience has:
- `max_capacity` — total tickets/spots available
- `current_bookings` — auto-incremented on booking creation
- `time_slots` — array of `TimeSlotConfig` objects defining available windows

`checkCapacity(experienceId, slotId)` returns:
```typescript
{
  available: boolean;
  remaining: number;
  totalCapacity: number;
  currentBookings: number;
}
```

---

## Service Types

| Type | Description | Example |
|------|-------------|---------|
| `event` | One-time dated event | Dubai Art Season opening |
| `recurring` | Repeatable on a schedule (e.g., weekly) | Friday night at White Dubai |
| `on_demand` | Available on request, flexible timing | Desert safari (any day) |
| `seasonal` | Only available certain times of year | Ski Dubai experience (always open but themed) |

---

## Database Schema

### `experience_services`
```sql
id, supplier_id, subcategory, service_type, title, slug,
description, short_description, images, base_price, pricing_model,
currency, tiers (JSONB), time_slots (JSONB), max_capacity,
current_bookings, availability_type, recurrence_pattern,
location, address, coordinates, duration_hours, min_participants,
max_participants, includes (text[]), excludes (text[]),
requirements (text[]), is_published, is_featured, is_trending,
trending_score, tags (text[]), created_at, updated_at
```

### `experience_bookings`
```sql
id, experience_id, user_id, booking_reference, ticket_code,
tier_name, tier_price, quantity, total_amount, slot_date,
slot_start_time, slot_end_time, status, payment_status,
payment_method, special_requests, notes,
created_at, updated_at
```

**Ticket Code Format:** `DALC-XXXX-XXXX` (uppercase alphanumeric, generated by `generateTicketCode()`)

---

## Filtering

`ExperienceFilters` type:
```typescript
{
  subcategory?: ExperienceSubcategory;
  serviceType?: ServiceType;
  minPrice?: number;
  maxPrice?: number;
  availabilityType?: AvailabilityType;
  isFeatured?: boolean;
  isTrending?: boolean;
  tags?: string[];
  searchQuery?: string;
}
```

---

## Mock Data (10 seeded experiences)

| Title | Subcategory | Price |
|-------|-------------|-------|
| Aura Skypool Experience | nightlife | AED 800 per person |
| WHITE Dubai Friday Night | nightlife | AED 500 per person (tiered) |
| Desert Dune Bashing & Barbecue | adventure | AED 350 per person |
| SkyDive Dubai | adventure | AED 2,200 per person |
| Tresind Studio Dining Experience | dining | AED 950 per person |
| Shark Safari (Dubai Aquarium) | water | AED 600 per person |
| Dubai Helicopter Tour | sky | AED 1,100 per person |
| Anantara Spa Hammam & Treatment | wellness | AED 850 per person |
| Al Fahidi Heritage Walk & Dinner | culture | AED 280 per person |
| Dubai Art Season Opening (event) | culture | Free |

---

## Scalability Notes

- **Supplier marketplace:** Each `experience_services` record links to a `supplier_id`. When the supplier marketplace goes live, suppliers will create and manage their own experience listings.
- **AI itinerary generator:** User's skills profile (`ADVENTURE`, `FOODIE`, `NIGHTLIFE`, etc.) can be used to auto-generate a personalized Dubai itinerary.
- **Real-time availability:** Upgrade `checkCapacity()` to use Supabase Realtime subscriptions on `experience_bookings` for live availability updates.
- **Multi-city expansion:** Add `city_id` to `experience_services`. City-scoped queries filter all listings automatically.
- **Recommendation engine:** trending_score field enables ranking. Future: ML scoring based on booking velocity, ratings, and user preference matching.
