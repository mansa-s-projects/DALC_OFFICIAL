# TODO: Search — Cross-Vertical Indexing & Faceted Filters

> Priority: 🟡 MEDIUM — Page exists, needs depth across all content types

---

## Current State

`src/pages/search/SearchPage.tsx` exists at `/search`.

Current likely state: searches `venues` table or a subset of content. Does NOT search across all verticals.

---

## Tasks

### Task 1: Unified Search Index

Create a single search function that queries all relevant tables and merges results:

```tsx
// src/hooks/useGlobalSearch.ts
export function useGlobalSearch(query: string) {
  return useQueries({
    queries: [
      {
        queryKey: ['search-venues', query],
        queryFn: () => supabase
          .from('venues')
          .select('id, name, category, image, description')
          .ilike('name', `%${query}%`)
          .limit(5),
        enabled: query.length >= 2
      },
      {
        queryKey: ['search-experiences', query],
        queryFn: () => supabase
          .from('experience_services')
          .select('id, name, category, image, description, price')
          .ilike('name', `%${query}%`)
          .limit(5),
        enabled: query.length >= 2
      },
      {
        queryKey: ['search-transport', query],
        queryFn: () => supabase
          .from('transport_services')
          .select('id, name, category, image, price_from')
          .ilike('name', `%${query}%`)
          .limit(3),
        enabled: query.length >= 2
      },
      {
        queryKey: ['search-stays', query],
        queryFn: () => supabase
          .from('stays_properties')
          .select('id, name, type, image, price_per_night')
          .ilike('name', `%${query}%`)
          .limit(3),
        enabled: query.length >= 2
      },
    ]
  });
}
```

Merge results client-side into a unified array with `{ type, data }` shape.

---

### Task 2: Full-Text Search with PostgreSQL

For better search quality, use PostgreSQL `tsvector` / `tsquery` instead of `ilike`:

```sql
-- Add full-text search vector to venues:
ALTER TABLE venues ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, ''))
  ) STORED;

CREATE INDEX venues_fts_idx ON venues USING GIN(fts);

-- Query:
SELECT * FROM venues WHERE fts @@ websearch_to_tsquery('english', 'rooftop bar marina');
```

Apply same pattern to `experience_services`, `transport_services`, `stays_properties`, `business_services`.

---

### Task 3: Search Result Card Types

In `SearchPage.tsx`, render different card layouts per result type:

```tsx
function SearchResult({ item }: { item: SearchItem }) {
  switch (item.type) {
    case 'venue': return <VenueSearchCard venue={item.data} />;
    case 'experience': return <ExperienceSearchCard experience={item.data} />;
    case 'transport': return <TransportSearchCard transport={item.data} />;
    case 'stay': return <StaySearchCard stay={item.data} />;
    default: return null;
  }
}
```

Each card shows: image thumbnail, name, category badge, price indicator, quick action ("View", "Book").

---

### Task 4: Category Facets / Filters

Add a left-side or top filter panel on SearchPage:

**Filter by category group**:
- [ ] Nightlife & Venues
- [ ] Experiences
- [ ] Transport
- [ ] Stays
- [ ] Business Services

**Filter by price range**: AED slider from 0 to 50,000+

**Filter by area**: dropdown of Dubai areas

Filters narrow which table-results are shown.

---

### Task 5: Global Search in Navbar

The Navbar has a search icon (magnifier). Clicking it navigates to `/search`.

**Upgrade to instant search overlay**:

1. Click search icon → search overlay expands (not new page)
2. Full-screen or slide-down overlay with input
3. As user types (debounced 300ms) → show instant results
4. Results grouped by type: Venues, Experiences, Transport, Stays
5. Press Enter → navigate to `/search?q=...` for full results
6. Press Escape → close overlay

**Component**: `src/components/search/GlobalSearchOverlay.tsx`

---

### Task 6: Recent Searches

Store last 5 search queries in `localStorage`:

```tsx
// On search:
const recent = JSON.parse(localStorage.getItem('dalc_recent_searches') || '[]');
const updated = [query, ...recent.filter(q => q !== query)].slice(0, 5);
localStorage.setItem('dalc_recent_searches', JSON.stringify(updated));
```

Show recent searches in the overlay before user starts typing:
```
Recent searches: rooftop bar  |  yacht charter  |  company formation
```

---

### Task 7: Trending Searches

Show a "Popular right now" section in empty search state:
- Fetch from a cached/manually-curated set
- Or derive from most common queries (requires storing search analytics)

Static initial version:
```ts
const TRENDING_SEARCHES = [
  'Desert safari', 'Yacht rental', 'Beach club', 
  'Company formation', 'Villa Palm Jumeirah', 'Private jet'
];
```

---

### Task 8: Search Analytics

Track user searches to improve recommendations:

```sql
CREATE TABLE search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),   -- nullable for anonymous
  query TEXT,
  result_count SMALLINT,
  clicked_result_id UUID,
  clicked_result_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Insert on each search (throttled / debounced). This powers future trending logic.

---

## Component Structure

```
src/pages/search/
  SearchPage.tsx               ← full results page
  
src/components/search/
  GlobalSearchOverlay.tsx      ← instant overlay
  SearchResultCard.tsx         ← unified result card
  SearchCategoryFilter.tsx     ← facet panel
  RecentSearches.tsx           ← recent history strip
  TrendingSearches.tsx         ← trending strip
```

---

## Acceptance Criteria

- [ ] Search queries venues, experiences, transport, stays, business simultaneously
- [ ] Results grouped and labeled by content type
- [ ] Category filter panel narrows result types
- [ ] Price range and area filters work
- [ ] Global search overlay opens from Navbar icon
- [ ] Overlay shows instant results as user types (300ms debounce)
- [ ] Recent searches stored in localStorage and shown in overlay
- [ ] Trending searches shown in empty state
- [ ] Full-text search (tsvector) implemented for at least `venues` and `experience_services`
