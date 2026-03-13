# Explore System

## Overview

The Explore page (`/explore`) is DALC's discovery hub. It allows users to browse all categories, discover trending content, search for specific venues or services, and find personalized recommendations.

---

## Architecture

### Route
`/explore` — `src/pages/Explore.tsx`
`/explore/:category` — `src/pages/Explore.tsx` (category-scoped view)

### Related Components
Located within `src/components/` (various folders):
- `navigation/` — top-level category navigation
- `trending/` — `TrendingStrip` horizontal scroll component
- `cards/` — result card components
- `feed/` — activity feed / discovery grid
- `orbit/` — orbit visualization component

### Hooks Used
- `useVenues` — filtered venue catalogue
- `useExperiences` — experience listings
- `useTransport` — transport services
- `useStays` — stay properties

---

## Explore Page Sections

The Explore page is assembled from 5 content sections:

### Section 1: Category Navigation
A sticky horizontal scroll of category tabs:
```
All | Nightlife | Experiences | Dining | Stays | Transport | Business | Move to Dubai
```
Clicking a tab filters the page to that category. Updates URL to `/explore/:category`.

### Section 2: Featured Grid (Hero)
2–3 featured items in a large card grid. Content sourced from:
- `venues` where `is_featured = true`
- `experience_services` where `is_featured = true`
- Rotated by admin-set priority

### Section 3: Trending Strip
Horizontal scrollable strip of 8–12 trending items. Content sourced from:
- `experience_services` with highest `trending_score` (sorted DESC)
- Filtered by selected category tab

**TrendingStrip component:** `src/components/trending/TrendingStrip.tsx`

### Section 4: Discovery Grid
Masonry or grid layout of all content matching the selected category filter. Supports:
- Infinite scroll (future) or paginated results (current: static mock)
- Mixed content type (venues + experiences + services)
- Sort: trending | newest | price_low | price_high

### Section 5: Orbit Visualization
A unique visual interaction unique to DALC — an `OrbitComponent` in `src/components/orbit/` that displays categories and services in a circular/orbital layout. Clicking brings up detail panel.

---

## 5 Filter Types

### 1. Category Filter
Active category tab on top nav. Passed as URL param: `/explore/nightlife`.

Possible values: `nightlife` | `experiences` | `dining` | `stays` | `transport` | `business`

### 2. Price Range Filter
Slider or input for min/max price (in AED). Filters listings with `base_price` in range.

### 3. Availability Filter
Date picker for date-based services (experiences, stays). Filters to services available on selected date.

### 4. Subcategory Filter
Secondary filter within a category (e.g., `nightlife → beach-club`, `transport → yachts`).

### 5. Tag Filter
Chip-based multi-select for common tags (e.g., `rooftop`, `views`, `private-dining`, `family-friendly`).

---

## 3 Search Modes

### Mode 1: Keyword Search
Free-text search across venue names, experience titles, and service titles.
- Current: client-side filter on mock data using `.includes()` match
- Future: Supabase full-text search via `@@ to_tsquery()` on indexed `search_vector` columns

### Mode 2: Category Search
Pre-filtered by category — activated when user selects a category tab. Restricts all results to that category's content source.

### Mode 3: Location / Area Search
Filter by Dubai area or district:
- Common areas: DIFC, Downtown, Dubai Marina, JBR, Palm Jumeirah, Jumeirah, Business Bay
- Implemented: via `address` text-match filter
- Future: PostGIS bounding box query on `coordinates` JSONB for a "near me" feature

---

## URL-Driven State

Explore page reads filter state from URL params:
```
/explore?category=nightlife&subcategory=beach-club&price_max=1000
```

This enables shareable filtered views and back-button support.

```typescript
// useSearchParams() reads:
const category = params.get('category');
const subcategory = params.get('subcategory');
const priceMin = params.get('price_min');
const priceMax = params.get('price_max');
const query = params.get('q');
```

---

## Data Aggregation

The Explore page queries multiple sources and merges results into a unified `ExploreItem[]` array:

```typescript
interface ExploreItem {
  id: string;
  type: 'venue' | 'experience' | 'transport' | 'stays' | 'business';
  title: string;
  image: string;
  category: string;
  subcategory?: string;
  price?: number;
  currency?: string;
  slug: string;
  href: string;    // computed navigation URL
  tags: string[];
  is_featured: boolean;
  trending_score?: number;
}
```

### `href` generation by type
| Type | href pattern |
|------|-------------|
| `venue` | `/venue/{id}` |
| `experience` | `/experiences/category/{subcategory}/{slug}` |
| `transport` | `/transport/{subcategory}/{slug}` |
| `stays` | `/stays/{subcategory}/{slug}` |
| `business` | `/business/{subcategory}/{slug}` |

---

## Editorial Collections (Future)

Admin-curated collections grouped by theme:
- "Best for Valentine's Day"
- "Top Wellness Experiences"
- "New in Dubai for Spring 2025"
- "Best Views in the City"

Implementation: Add `collections` + `collection_items` tables. Collections surface on Explore as dedicated strips.

---

## Performance

- **Skeleton loaders:** All Explore content uses skeleton components from `src/components/skeletons/` while loading
- **Virtualization:** For paginated grids (future), use `react-virtual` to avoid rendering thousands of cards
- **Search debounce:** Keyword search input debounced 300ms before triggering filter recalculation

---

## Scalability Notes

- **Full-text search:** Add `search_vector TSVECTOR` column to `venues`, `experience_services`, `stays_properties`, `transport_services`. Index with GIN index. Query with Supabase's `textSearch()` method.
- **Personalization:** Use `profiles.skills` array to sort results by user preference affinity (see [Recommendation System](recommendation-system.md)).
- **Saved / Wishlist:** Add a `user_saved_items` table — users can save venues and experiences to revisit.
- **Map View:** Integrate Mapbox GL JS with the `coordinates` data already present on venues and services. Toggle between grid view and map view.
- **Multi-city:** City switcher in header changes active `city_id` context → all explore queries automatically scope to the selected city.
