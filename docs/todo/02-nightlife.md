# TODO: Nightlife — Mock Data Migration & Feature Completion

> Priority: 🟠 HIGH — All 4 listing pages use static `MOCK_VENUES`

---

## Current State

| Page | File | Data Source | Issue |
|------|------|-------------|-------|
| `/nightlife` | `NightlifeHub.tsx` | `MOCK_VENUES` filter | Static mock array |
| `/nightlife/clubs` | `NightClubs.tsx` | `MOCK_VENUES.filter(v => v.category === 'nightlife')` | Static mock |
| `/nightlife/beach-clubs` | `BeachClubs.tsx` | `MOCK_VENUES.filter(v => v.category === 'beach-clubs')` | Static mock |
| `/nightlife/restaurants` | `Restaurants.tsx` | `MOCK_VENUES.filter(v => v.category === 'dining')` | Static mock |
| `/nightlife/dining` | `DiningEntertainment.tsx` | `MOCK_VENUES.filter(v => v.category === 'dining-entertainment')` | Static mock |
| `/venue/:id` | `VenueDetail.tsx` | `useVenue(id)` ← live Supabase | ✅ Already correct |

The hooks `useVenues` and `useVenue` at `src/features/nightlife/hooks/` already exist and query Supabase. The listing pages just don't use them.

---

## Tasks

### Task 1: Migrate `NightClubs.tsx` to live data

**Remove:**
```tsx
import { MOCK_VENUES } from '../../../data/mockData';
const clubs = MOCK_VENUES.filter(v => v.category === 'nightlife');
```

**Add:**
```tsx
import { useVenues } from '../hooks/useVenues';
const { data: clubs = [], isLoading } = useVenues({ category: 'nightlife' });
```

Add loading skeleton (use existing `VenueCardSkeleton` or equivalent).

---

### Task 2: Migrate `BeachClubs.tsx` to live data

```tsx
// Remove MOCK_VENUES usage
// Add:
const { data: beachClubs = [], isLoading } = useVenues({ category: 'beach-clubs' });
```

---

### Task 3: Migrate `Restaurants.tsx` to live data

```tsx
// Remove MOCK_VENUES usage
// Add:
const { data: restaurants = [], isLoading } = useVenues({ category: 'dining' });
```

---

### Task 4: Migrate `DiningEntertainment.tsx` to live data

```tsx
// Remove MOCK_VENUES usage
// Add:
const { data: venues = [], isLoading } = useVenues({ category: 'dining-entertainment' });
```

---

### Task 5: Migrate `NightlifeHub.tsx` dining-entertainment section

The Hub page renders a small preview of DiningEntertainment venues:
```tsx
// Remove:
const diningEntertainmentVenues = MOCK_VENUES.filter(v => v.category === 'dining-entertainment').slice(0, 2);

// Replace with:
const { data: diningEntertainmentVenues = [] } = useVenues({ category: 'dining-entertainment', limit: 2 });
```

---

### Task 6: Add Filters to Nightlife Listing Pages

Each listing page should have a basic filter bar (currently none exist):

| Filter | Options |
|--------|---------|
| Sub-type | Beach-side, Rooftop, Indoor, Open-air |
| Price tier | $ / $$ / $$$ / $$$$ |
| Area | Dubai Marina, JBR, DIFC, Downtown, Palm Jumeirah |
| Opens Today | toggle |

---

### Task 7: Add Loading States

All 4 listing pages show empty state while data loads. Add:
- 6-card skeleton grid during `isLoading`
- `ErrorState` component on query error
- "No venues found" empty state when array is empty

---

### Task 8: Add Pagination or Load-More

Currently the pages load all venues. For production:
- Add `limit: 12` default
- Add a "Load More" button that fetches next page
- Or implement virtual scroll for large datasets

---

### Task 9: VenueDetail — Add Related Experiences

The `/venue/:id` page currently shows similar venues but not related bookable experiences.

Add a section: "Book an Experience Here" that loads `experience_services` where `venue_id = currentVenueId`

```tsx
// In VenueDetail.tsx
const { data: linkedExperiences } = useExperiences({ venue_id: venue.id });
```

---

### Task 10: Cross-link Nightlife ↔ Experiences

Architecture note from docs: `experience_services.venue_id → venues.id` foreign key is planned.

- [ ] Add `venue_id UUID REFERENCES venues(id)` to `experience_services` table (migration needed)
- [ ] Update `ExperienceDetail` routing to cross-link back to parent venue

---

## `useVenues` Hook — Verify Filter Interface

Check `src/features/nightlife/hooks/useVenues.ts` supports these params:
```typescript
interface VenueFilters {
  category?: string;
  area?: string;
  price_tier?: number;
  is_featured?: boolean;
  limit?: number;
  search?: string;
}
```

If `limit` param is missing, add it.

---

## Acceptance Criteria

- [ ] All 4 nightlife listing pages pull live data from Supabase `venues` table
- [ ] No `MOCK_VENUES` imports remain in nightlife pages
- [ ] Loading skeleton shown during data fetch
- [ ] Error state shown when Supabase query fails
- [ ] Empty state shown when no venues match category
- [ ] Filter bar present on each listing page
- [ ] NightlifeHub dining-entertainment preview uses live data
