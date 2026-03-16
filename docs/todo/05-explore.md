# TODO: Explore Page — Improvements & Cross-Vertical Discovery

> Priority: 🟡 MEDIUM — Core page exists, needs deepening

---

## Current State

`src/pages/explore/ExplorePage.tsx`

Already built with:
- `ExploreGrid` — card grid of featured content
- `ExploreMap` — venue pin map
- `ExploreFilters` — category filter strip
- `CollectionStrip` — curated horizontal rails
- `LocationDrawer` — area-based browsing

---

## Tasks

### Task 1: Cross-Vertical Content Grid

Currently `ExploreGrid` probably shows only one content type (venues or experiences).

**Goal**: A single discovery grid that mixes content from all verticals:
- Venues (nightlife)
- Experience services
- Transport (featured cars/yachts)
- Stays (featured hotels)
- Business services (featured packages)

Each card type uses its own template but renders in the same grid.

**Implementation**:
```tsx
// ExploreGrid should accept mixed content array:
type ExploreItem = 
  | { type: 'venue'; data: Venue }
  | { type: 'experience'; data: ExperienceService }
  | { type: 'transport'; data: TransportService }
  | { type: 'stay'; data: StayProperty }
  | { type: 'business'; data: BusinessService }

// Render switch renders the correct card component per item type
```

**Query**: 
```sql
-- Parallel queries on load, merge client-side:
SELECT 'venue' as type, id, name, image, category FROM venues WHERE is_featured = true LIMIT 4
UNION ALL
SELECT 'experience' as type, id, name, image, category FROM experience_services WHERE is_featured = true LIMIT 4
UNION ALL
SELECT 'transport' as type, id, name, image, category FROM transport_services WHERE is_featured = true LIMIT 2
```

---

### Task 2: URL Param Filtering — `/explore/:filter`

Currently the Explore page does not respond to URL params. Adding `?filter=nightlife` should pre-apply the nightlife filter.

```tsx
// In ExplorePage.tsx
const [searchParams] = useSearchParams();
const initialFilter = searchParams.get('filter') ?? 'all';
```

Also handle `/explore?area=dubai-marina` for area-based pre-filtering.

**Navbar "Explore" link**: Change from `/explore` → keep as `/explore` but ensure filter chips reset on load.

---

### Task 3: Trending / Personalized Rail

Above the main grid, add a "Trending Now" horizontal rail:

```tsx
<CollectionStrip 
  title="Trending Now"
  items={trendingItems}  // ordered by booking_count DESC
/>
```

If user is logged in and has a `profiles.interests` array, show a personalized rail:
```tsx
<CollectionStrip
  title={`Picked for ${user.firstName}`}
  items={personalizedItems}
/>
```

Personalization logic: match `experience_services.category` against `profiles.interests[]`

---

### Task 4: Area-Based Discovery

Upgrade `LocationDrawer` to be a full "Browse by area" experience:

Areas to include:
- Dubai Marina
- JBR (Jumeirah Beach Residence)
- Downtown Dubai
- DIFC
- Palm Jumeirah
- Dubai Hills
- Business Bay
- Jumeirah

Each area shows a card with banner image and count of available services.

Clicking an area → `/explore?area=dubai-marina` → grid filters to that area.

---

### Task 5: Collections / Curated Lists

Add an editorial section: "Curated by DALC team"

Collections are named curated lists stored either in a new `collections` table or hardcoded:
- "Perfect Honeymoon Package"
- "Dubai in 48 Hours"
- "The Business Owner's Collection"
- "Family Weekend Escape"

Each collection is a list of `{ type, id }` references.

**Implementation options**:
- Store in a `collections` Supabase table (recommended for CMS control)
- Hardcode in `src/data/collections.ts` (simpler for MVP)

---

### Task 6: Search Integration on Explore

The Explore page should have a prominent search bar at the top (not just the global `SearchPage` at `/search`).

```tsx
// Quick search bar that filters the visible grid
// Debounced input → re-queries grid data with search parameter
// Does NOT navigate away (unlike the global search icon)
```

---

### Task 7: "For You" Tab (Requires Auth)

Add a tab system on Explore: `For You | All | Nightlife | Experiences | Stays | Transport`

"For You" tab:
- If user is not logged in: prompt "Create a free account to get personalized recommendations"
- If user is logged in: show recommendations based on `profiles.interests`, past bookings

---

### Task 8: Performance — Infinite Scroll or Pagination

Current grid likely loads all items on mount. For production:
- Default: load 12 items
- "Load more" button → append next 12
- Or implement `useInfiniteQuery` with intersection observer

---

## New Component: `ExploreItemCard`

Create a unified card that handles all content types:

```
src/components/explore/
  ExploreItemCard.tsx     ← renders correct card based on .type
  ExploreItemCardSkeleton.tsx
  TrendingRail.tsx
  PersonalizedRail.tsx
  AreaBrowserPanel.tsx
  CollectionsSection.tsx
```

---

## Acceptance Criteria

- [ ] Explore grid shows mixed content from multiple verticals  
- [ ] `/explore?filter=nightlife` pre-applies nightlife filter
- [ ] Trending Now rail displays most booked items
- [ ] Logged-in users see a personalized rail
- [ ] Area browser shows 8 Dubai areas with counts
- [ ] Collections section shows at least 3 curated lists
- [ ] In-page search bar filters grid without navigation
- [ ] Grid implements pagination or load-more
