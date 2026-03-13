# Feature: Nightlife

## Purpose

Nightlife is Pillar #3 in DALC. Dubai's nightlife scene is a primary acquisition channel for the platform — it draws high-net-worth visitors and residents specifically looking for access to exclusive clubs, rooftops, and entertainment dining. Despite being an `experience subcategory` in the database, Nightlife is elevated to a standalone first-class pillar in the UI for navigation and marketing prominence.

---

## Architecture Note: Dual Database Presence

Nightlife content exists in two places in the DALC database:

### 1. `venues` table (category: `nightlife`)
The original DALC venue catalogue. These are curated venue profiles — not bookable items but discovery + request touchpoints. Seeded examples:
- `nc-nyx` — NYX DIFC (exclusive hidden nightclub)
- `nc-raspoutine` — Raspoutine (Parisian cabaret-club)
- `nc-soho-meydan` — Soho Meydan (massive complex)
- `r-ling-ling` — Ling Ling at Atlantis Royal
- `r-hakkasan` — Hakkasan (Michelin-starred)

### 2. `experience_services` table (subcategory: `nightlife`)
Bookable nightlife experiences — White Dubai Friday night, Aura Skypool, etc. These use the full experience booking system (ticket codes, capacity, tiers).

**Recommended architecture:** The `venues` table is the source of truth for venue profiles. `experience_services` handles bookable events/nights at those venues. Venues and experiences should be cross-linked via `venue_id` on `experience_services`.

---

## Venue Types

| Type | DB Tag | Examples |
|------|--------|---------|
| Nightclub | `nightclub` | NYX DIFC, Raspoutine, White Dubai |
| Rooftop Bar | `rooftop-bar` | Aura Skypool (Burj Khalifa), Level 43, Zero Gravity |
| Beach Club | `beach-club` | Nikki Beach, Cove Beach, White Beach Atlantis |
| Supper Club | `supper-club` | Caviar & Champagne experiences |
| Cabaret | `cabaret` | Raspoutine, Cipriani |
| Entertainment Dining | `entertainment-dining` | Ling Ling, Hakkasan late night |

---

## User Flows

### Flow 1: Explore Nightlife

```
User navigates to /nightlife (or clicks Nightlife in nav)
  → NightlifeHub renders ExperiencesHub pre-filtered to subcategory='nightlife'
  → Hero: Dubai skyline at night
  → Venue types grid: Nightclub, Rooftop, Beach Club, Supper Club, Cabaret
  → Featured experiences loaded: getFeaturedExperiences({ subcategory: 'nightlife' })
  → Trending venues loaded: useVenues({ category: 'nightlife' })
  → User clicks venue → VenueDetail (/venue/:id)
  → User clicks experience → ExperienceDetail (`/experiences/nightlife/:slug`)
```

### Flow 2: VIP Table Request

```
User on venue detail page
  → Sees "Request VIP Table" CTA
  → Clicks → /request (concierge request form)
  → Form pre-populated with venue info
  → User fills: date, party size, occasion, budget
  → Submits → creates requests record with venue_id
  → DALC concierge handles the VIP table arrangement
```

### Flow 3: Event Booking (experience-based)

```
User finds "WHITE Dubai Friday Night" on /nightlife
  → ExperienceDetail page
  → Selects tier: Standard (AED 500) / VIP (AED 1,200) / Ultra VIP (AED 3,500)
  → Selects date (Friday nights)
  → Books: createExperienceBooking()
  → Receives ticket code: DALC-WXYZ-1234
```

---

## Current Routes

| Route | Component | Location |
|-------|-----------|----------|
| `/nightlife` | `NightlifeHub` | `src/features/nightlife/pages/NightlifeHub.tsx` |
| `/nightlife/clubs` | `NightClubs` | `src/features/nightlife/pages/NightClubs.tsx` |
| `/nightlife/beach-clubs` | `BeachClubs` | `src/features/nightlife/pages/BeachClubs.tsx` |
| `/nightlife/restaurants` | `Restaurants` | `src/features/nightlife/pages/Restaurants.tsx` |
| `/nightlife/dining` | `DiningEntertainment` | `src/features/nightlife/pages/DiningEntertainment.tsx` |
| `/venue/:id` | `VenueDetail` | `src/features/nightlife/pages/VenueDetail.tsx` |

### Hooks
| Hook | File | Purpose |
|------|------|---------|
| `useVenues` | `src/features/nightlife/hooks/useVenues.ts` | Fetch + filter venue listings |
| `useVenue` | `src/features/nightlife/hooks/useVenue.ts` | Single venue by slug or ID |

---

## Feature Slice Location

Nightlife is a first-class feature slice at `src/features/nightlife/` with its own pages, hooks, and components. The venue catalogue uses the `venues` table (not `experience_services`).

---

## Database Relationships

```
venues (category='nightlife')
  └── requests (via venue_id) — VIP table requests

experience_services (subcategory='nightlife')
  └── experience_bookings (ticket-based booking)
```

Planned junction:
```
experience_services.venue_id → venues.id (add foreign key)
```

---

## Content Strategy

### Venue Profile Data (`venues` table)
Each nightlife venue profile should contain:
- `name`, `slug`, `description`
- `images[]` — hero image + gallery
- `tags[]` — music genre, vibe, crowd type
- `price_tier` — `$` `$$` `$$$` `$$$$`
- `open_days` — array of days open
- `opening_time`, `closing_time`
- `coordinates` — for map integration
- `website`, `instagram_handle`
- `dress_code`
- `reservation_required` boolean

### Experience Listings (`experience_services` table)
Bookable events at those venues:
- Themed nights (Friday nights, NYE, Eid specials)
- Table packages with bottle service included
- Guest DJ / artist nights

---

## Scalability Notes

- **Venue + Experience unification:** Long-term, move toward a single `listings` table that unifies venues and bookable experiences. Use a `listing_type` field to distinguish.
- **Partnership events:** Allow venues to post their own events via the supplier dashboard — populates `experience_services` directly.
- **Table reservation system:** Integrate OpenTable or proprietary reservation API for real-time table availability at nightlife venues.
- **Guest list feature:** Allow users to add themselves to a venue guest list — creates a `request` of type `guest_list` automatically.
- **Multi-city:** Abu Dhabi, Riyadh, and other MENA cities have vibrant nightlife scenes — same data model applies with `city_id` scoping.
