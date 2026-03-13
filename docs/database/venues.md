# Venues

## Purpose

The `venues` table is the DALC discovery catalogue — curated venue profiles that serve as touchpoints for concierge requests. Venues are not directly bookable through the standard booking system (those live in vertical service tables). Instead, they are discoverable on the Explore page, in search, and linked to concierge requests.

---

## Venues vs Services

| Type | Table | Bookable | Purpose |
|------|-------|---------|---------|
| Venue Profile | `venues` | ❌ (via request) | Discovery + concierge touchpoint |
| Experience Service | `experience_services` | ✅ | Ticket-based experiences |
| Stays Property | `stays_properties` | ✅ | Date-range accommodation |
| Transport Service | `transport_services` | ✅ | Time-based mobility |
| Business Service | `business_services` | ✅ | Professional service |

**Bridge:** `experience_services.venue_id` should link to `venues.id` — if an experience takes place at a specific venue, they are cross-linked. This FK is recommended but not yet in the current migration.

---

## Schema

```sql
CREATE TABLE public.venues (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id     UUID REFERENCES public.suppliers(id),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  category        TEXT NOT NULL,         -- nightlife|dining|experiences|stays|transport|business
  subcategory     TEXT,
  description     TEXT,
  short_description TEXT,
  images          TEXT[],
  price_tier      TEXT,                  -- $|$$|$$$|$$$$
  min_spend       DECIMAL(10,2),
  tags            TEXT[],
  coordinates     JSONB,                 -- { "lat": 25.1972, "lng": 55.2744 }
  address         TEXT,
  website         TEXT,
  phone           TEXT,
  open_days       TEXT[],               -- ["Monday","Tuesday","Wednesday",...]
  opening_time    TIME,
  closing_time    TIME,
  is_published    BOOLEAN DEFAULT false,
  is_featured     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Seeded Venues

The `supabase/seed.sql` file contains the following venues:

### Nightlife Venues
| ID | Name | Slug | Category |
|----|------|------|---------|
| `nc-nyx` | NYX DIFC | `nyx-difc` | nightlife |
| `nc-raspoutine` | Raspoutine Dubai | `raspoutine-dubai` | nightlife |
| `nc-soho-meydan` | Soho Meydan | `soho-meydan` | nightlife |

### Restaurant / Dining Venues
| ID | Name | Slug | Category |
|----|------|------|---------|
| `r-ling-ling` | Ling Ling at Atlantis Royal | `ling-ling-atlantis-royal` | dining |
| `r-hakkasan` | Hakkasan Dubai | `hakkasan-dubai` | dining |

---

## Venue Categories

Current seeded categories:

| Category | Description |
|----------|-------------|
| `nightlife` | Clubs, rooftop bars, beach clubs |
| `dining` | Restaurants, cafes, food experiences |
| `experiences` | Activities and leisure (for venues that host activities) |
| `stays` | Hotels and villas in the venue catalogue |
| `transport` | Marina berths, airport lounges |
| `business` | Business centres, co-working |
| `wellness` | Spas, wellness centres |

---

## Tags

Venues use a `tags TEXT[]` array for flexible tagging. Common tags:

**Nightlife:** `vip`, `rooftop`, `beachclub`, `bottle-service`, `dress-code`, `celebrity`, `views`, `electronic-music`, `hip-hop`, `house-music`

**Dining:** `michelin`, `tasting-menu`, `private-dining`, `chef-table`, `brunch`, `views`, `outdoor`, `celebrity-chef`

**Experiences:** `family-friendly`, `thrill-seeking`, `romantic`, `group`, `corporate`, `unique`, `exclusive`

---

## RLS Policies

```sql
-- Read: any user can see published venues
CREATE POLICY "Venues are viewable by authenticated users"
  ON public.venues FOR SELECT USING (
    auth.role() = 'authenticated' OR is_published = true
  );

-- Write: admin only
CREATE POLICY "Venues can be modified by admins"
  ON public.venues FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin')
    )
  );
```

---

## Hooks

```typescript
// useVenues — filter by category, featured, search query
const { venues, isLoading } = useVenues({ category: 'nightlife', featured: true });

// useVenue — single venue by ID
const { venue, isLoading } = useVenue(venueId);
```

### `useVenues` Filters
```typescript
interface VenueFilters {
  category?: string;
  subcategory?: string;
  tags?: string[];
  featured?: boolean;
  searchQuery?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
}
```

---

## Venue Detail Page

Route: `/venue/:id`
Component: `src/pages/VenueDetail.tsx`

Content:
- Hero image + venue name, category badge
- Description + highlights
- Image gallery
- Location map (when map feature is live)
- Tags + price tier
- "Request a Table / Access" CTA → `/request?venue_id={id}`
- Related experiences at this venue (future: via `experience_services.venue_id`)

---

## Admin Venue Management

Admin routes:
- `/admin/venues` — `AdminVenues.tsx` — paginated venue list
- `/admin/venues/new` — `AdminVenueForm.tsx` — create form
- `/admin/venues/:id` — `AdminVenueForm.tsx` — edit form

Fields managed by admin:
- All venue fields
- `is_published` toggle — controls public visibility
- `is_featured` toggle — controls featured listings on home + explore

---

## Scalability Notes

- **Venue ↔ Experience link:** Add `venue_id` FK to `experience_services` and `transport_services` (yachts often operate from a marina venue).
- **Venue ratings:** Add a `venue_reviews` table for user-submitted ratings and reviews.
- **Map integration:** `coordinates` JSONB is already in place. Wire up to a map provider (Google Maps, Mapbox) for the `/live-map` route.
- **Venue hours:** The current `open_days` + `opening_time` + `closing_time` model is basic. A future `venue_hours` table would handle per-day hour variations and holiday closures.
- **Multi-city:** Add `city_id` to `venues`. Explore and search filter by active city.
