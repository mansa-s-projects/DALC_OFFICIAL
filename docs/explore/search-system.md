# Search System

## Overview

The Search system allows users to find venues, experiences, and services across all DALC verticals from a single query interface. Currently implemented as client-side filtering on mock data. Full-text database search is the target architecture.

---

## Current Implementation

### Client-Side Search (Mock Mode)

In mock mode, all search is performed in-memory:

```typescript
// In useVenues, useExperiences, useTransport, etc.:
const filtered = MOCK_DATA.filter(item =>
  item.title.toLowerCase().includes(query.toLowerCase()) ||
  item.description?.toLowerCase().includes(query.toLowerCase()) ||
  item.tags?.some(tag => tag.includes(query.toLowerCase()))
);
```

**Limitation:** Only searches pre-loaded mock data. No pagination. No relevance ranking.

---

## Target Implementation: Supabase Full-Text Search

### Step 1: Add search vectors to each table

```sql
-- experiences
ALTER TABLE experience_services ADD COLUMN search_vector TSVECTOR;
CREATE INDEX experience_services_search_idx ON experience_services USING GIN(search_vector);

CREATE FUNCTION update_experience_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER experience_search_vector_update
  BEFORE INSERT OR UPDATE ON experience_services
  FOR EACH ROW EXECUTE FUNCTION update_experience_search_vector();
```

Repeat for: `venues`, `stays_properties`, `transport_services`, `business_services`.

### Step 2: Supabase query with full-text search

```typescript
// In src/lib/search.ts
const { data } = await supabase
  .from('experience_services')
  .select('*')
  .textSearch('search_vector', query, {
    type: 'websearch',      // handles AND, OR, quoted phrases
    config: 'english'
  })
  .eq('is_published', true)
  .order('trending_score', { ascending: false })
  .limit(20);
```

### Step 3: Cross-table search via RPC

For searching across all verticals in one query, create a PostgreSQL function:

```sql
CREATE FUNCTION search_all(query text)
RETURNS TABLE (
  id UUID, type TEXT, title TEXT, image TEXT,
  subcategory TEXT, price DECIMAL, slug TEXT, tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT id, 'experience'::TEXT, title,
    images[1], subcategory, base_price, slug, tags
  FROM experience_services
  WHERE is_published = true
    AND search_vector @@ websearch_to_tsquery('english', query)
  UNION ALL
  SELECT id, 'venue'::TEXT, name,
    images[1], subcategory, min_spend, slug, tags
  FROM venues
  WHERE is_published = true
    AND search_vector @@ websearch_to_tsquery('english', query)
  -- ... repeat for transport, stays, business
  ORDER BY ts_rank(search_vector, websearch_to_tsquery('english', query)) DESC
  LIMIT 30;
END;
$$ LANGUAGE plpgsql;
```

Called from the frontend:
```typescript
const { data } = await supabase.rpc('search_all', { query: searchTerm });
```

---

## Search UI Components

### Global Search Bar
- Location: Navigation component (sticky header)
- Behavior: Opens a search overlay/modal on focus
- Debounce: 300ms before triggering search call
- Loading: skeleton rows while fetching

### Search Overlay Pattern
```
[Input field] ← focused, full-width on mobile
────────────────────────────────
Recent searches (before typing)
────────────────────────────────
Results:
  [Category badge] Experiences
  - Tresind Studio Dining Experience    AED 950
  - Shark Safari Dubai Aquarium         AED 600

  [Category badge] Venues
  - NYX DIFC
  - Raspoutine Dubai

  [Category badge] Transport
  - Rolls-Royce Ghost 2024              AED 4,500/day
────────────────────────────────
[View all results →] full explore page
```

---

## Search Modes (3)

### 1. Keyword / Natural Language Search
User types: "yacht dinner" or "nightclub with rooftop"

Maps to: full-text search via `WEBSEARCH` mode which handles:
- Multi-word AND queries: `yacht dinner` → must contain both
- Phrase queries: `"rooftop bar"` → exact phrase
- OR queries: `yacht | jet` → either word
- Negation: `nightlife -cheap` → excludes "cheap"

### 2. Category-Scoped Search
User searches while browsing `/explore/nightlife`.

The search is pre-filtered to `category = 'nightlife'` before text matching. Faster and more relevant.

### 3. Location / Area Search
User types: "Palm Jumeirah" or "DIFC"

Implementation:
- **Current:** Simple text match on `address` field
- **Target:** PostGIS `ST_DWithin` query using `coordinates` field for radius search
- Areas mapped to bounding boxes for structured area filtering

---

## Search Filters (Applied Post-search)

After initial search results are returned, filters narrow the result set:

| Filter | Type | Field |
|--------|------|-------|
| Category | Tab/dropdown | `type` in result |
| Price range | Slider | `base_price` |
| Subcategory | Chips | `subcategory` |
| Availability date | Date picker | service-specific |
| Rating | Stars | `rating` (future) |
| Tags | Multi-chip | `tags` |

---

## Relevance Ranking

Current (mock): No ranking — results in data definition order.

Target: PostgreSQL `ts_rank()` applied to search vector results. Higher `trending_score` boosted as tie-breaker.

**Ranking weights:**
- Title match: Weight A (highest)
- Description match: Weight B
- Tags match: Weight C (lowest)

```sql
ORDER BY
  ts_rank(search_vector, query) * 0.7 +
  (trending_score / 100) * 0.3 DESC
```

---

## Recent Searches

Store recent searches in `localStorage` (client-side only — no PII risk):

```typescript
const MAX_RECENT = 5;

function addRecentSearch(term: string) {
  const recent = getRecentSearches();
  const updated = [term, ...recent.filter(r => r !== term)].slice(0, MAX_RECENT);
  localStorage.setItem('dalc_recent_searches', JSON.stringify(updated));
}
```

---

## Search Analytics (Future)

Track popular searches via a `search_events` table:
```sql
CREATE TABLE search_events (
  id UUID PRIMARY KEY,
  user_id UUID,            -- null for anonymous
  search_query TEXT,
  results_count INT,
  result_clicked UUID,     -- item clicked from results
  session_id TEXT,
  created_at TIMESTAMPTZ
);
```

Use this data to:
- Surface "trending searches" on the search overlay
- Identify discovery gaps (searches with 0 results)
- Personalize autocomplete suggestions

---

## Scalability Notes

- **Autocomplete/Suggestions:** Use Supabase Edge Functions + a prefix-search query (`ilike 'query%'`) to serve typeahead suggestions in <100ms.
- **Search-as-you-type:** Debounce at 300ms + cancel previous in-flight request (AbortController) to prevent race conditions.
- **Elasticsearch:** For enterprise-scale, replace Supabase full-text with a dedicated Elasticsearch cluster (index all tables via Supabase webhooks).
- **Semantic search:** Embed service descriptions as vectors (via OpenAI embeddings) stored in `pgvector` extension. Enable semantic similarity search for natural language queries.
