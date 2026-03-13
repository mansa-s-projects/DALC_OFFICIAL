# Future Expansion

## Overview

DALC is designed from the ground up for multi-city and multi-pillar expansion. This document outlines the technical architecture for scaling beyond Dubai, adding new service verticals, and evolving the platform towards an AI-powered concierge experience.

---

## Multi-City Architecture

### Core Principle
Every service table gains a `city_id` column. All queries are scoped to the active city. The platform URL structure uses a city prefix.

### `cities` Master Table

```sql
CREATE TABLE cities (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,          -- "Dubai"
  slug        TEXT UNIQUE NOT NULL,   -- "dubai"
  country     TEXT NOT NULL,          -- "UAE"
  timezone    TEXT NOT NULL,          -- "Asia/Dubai"
  currency    TEXT NOT NULL,          -- "AED"
  currency_symbol TEXT,               -- "د.إ"
  is_active   BOOLEAN DEFAULT false,
  launched_at DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

Initial data:
```sql
INSERT INTO cities (name, slug, country, timezone, currency, is_active, launched_at)
VALUES ('Dubai', 'dubai', 'UAE', 'Asia/Dubai', 'AED', true, '2025-01-01');
```

### Adding `city_id` to Service Tables

```sql
-- Migration: add city_id to all service tables
ALTER TABLE experience_services ADD COLUMN city_id UUID REFERENCES cities(id);
ALTER TABLE transport_services ADD COLUMN city_id UUID REFERENCES cities(id);
ALTER TABLE stays_properties ADD COLUMN city_id UUID REFERENCES cities(id);
ALTER TABLE business_services ADD COLUMN city_id UUID REFERENCES cities(id);
ALTER TABLE venues ADD COLUMN city_id UUID REFERENCES cities(id);
ALTER TABLE suppliers ADD COLUMN city_id UUID REFERENCES cities(id);

-- Backfill: assign all existing records to Dubai
UPDATE experience_services SET city_id = (SELECT id FROM cities WHERE slug = 'dubai');
-- (repeat for all tables)
```

### CityProvider Context (React)

```typescript
// src/contexts/CityContext.tsx
const CityContext = createContext<{ city: City; setCity: (c: City) => void } | null>(null);

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<City>(DUBAI);
  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>;
}

export const useCity = () => useContext(CityContext)!;
```

All hooks use `const { city } = useCity()` and pass `city.id` as a filter to Supabase queries.

### URL Strategy

Option A — City prefix (recommended):
```
/dubai/experiences/category/nightlife
/riyadh/transport/yachts
/london/stays/hotels
```

Option B — Subdomain:
```
dubai.dalc.ae/experiences/category/nightlife
riyadh.dalc.ae/transport/yachts
```

**Recommendation:** Start with URL prefix (Option A). Easier to deploy on a single domain without complex DNS setup.

### City Switcher UI

City selector in the header (nav component):

```
[Dubai ▾]  ← dropdown
  ● Dubai  (active)
  ○ Riyadh  (coming soon)
  ○ London  (coming soon)
  ○ Miami   (coming soon)
```

---

## Adding a New City

### Checklist
- [ ] Insert city record into `cities` table (admin)
- [ ] Onboard local suppliers for each active vertical
- [ ] Create city-specific venue catalogue
- [ ] Add city content to CMS/admin (name, description, imagery)
- [ ] Set `cities.is_active = true`
- [ ] Test all pillar flows for new city

**Zero code changes required** once `city_id` is present on all tables. The data layer handles city scoping automatically.

---

## Adding a New Pillar

Current 7 pillars: Move to Dubai, Experiences, Nightlife, Stays, Transport, Business, Concierge.

### Checklist for New Pillar (e.g. "Education")
1. Create the vertical type file: `src/types/education.ts`
2. Create the DB migration: `supabase/migrations/education_001_schema.sql`
3. Create the lib service file: `src/lib/education.ts` (mock-first)
4. Create hooks: `useEducation.ts`, `useEducationBooking.ts`
5. Create components folder: `src/components/education/`
6. Create pages: `src/pages/education/EducationHub.tsx`, subcategory pages
7. Add routes to `src/app/router.tsx`
8. Add nav entry to navigation component
9. Add pillar card to `src/pages/Home.tsx`
10. Update `00-overview.md` with new pillar entry

---

## Supplier Marketplace Expansion

Current: ~5–20 manually onboarded suppliers.

Target at scale:
- **50–200 suppliers per city** across all verticals
- Self-service supplier portal (see [supplier-dashboard.md](../suppliers/supplier-dashboard.md))
- Automated KYC and approval
- Supplier rating and review system
- Supplier performance analytics

### Supplier Discovery

Add a public-facing supplier directory:
```
/suppliers           → Directory of active suppliers (B2B page)
/suppliers/:slug     → Supplier profile page
```

---

## AI Concierge Roadmap

### Phase 1: Intelligent Recommendations (current target)
- Skills-based personalization (built — see [recommendation-system.md](../explore/recommendation-system.md))
- `trending_score` surfacing trending items
- Skills declared on onboarding used to personalize home feed

### Phase 2: Natural Language Search
- Semantic search using `pgvector` (OpenAI embeddings stored in DB)
- "I want a romantic dinner with views" maps to relevant venues + experiences
- Supabase Edge Function handles embedding + vector similarity query

### Phase 3: Chat-Based Concierge
- Floating chat interface accessible from all pages
- Powered by GPT-4o
- Context: user profile, skills, active relocation status, browsing history
- Can: recommend venues, check availability, create bookings (tool use)
- Escalates to human concierge when agent confidence is low
- All chat sessions logged to `concierge_sessions` table

### Phase 4: Autonomous Concierge
- Proactive notifications: "Your favourite DJ is playing this Friday at White Dubai"
- Anticipatory suggestions based on calendar events (future calendar integration)
- Automated request handling for common booking types

---

## Platform Expansion Opportunities

| Opportunity | Description | Priority |
|------------|-------------|---------|
| Mobile App | React Native app for iOS + Android | High |
| B2B Corporate Accounts | Companies book experiences for employees/clients | High |
| Gifting | Purchase experience gifts for others | Medium |
| Loyalty Programme | Points system across all verticals | Medium |
| Affiliate / Referral | Users refer friends, earn credit | Medium |
| Content / Editorial | DALC magazine, city guides, curated lists | Low |
| Co-branding Partnerships | Co-branded experiences with luxury brands | Low |
| NFT Memberships | Blockchain-backed exclusive tier memberships | Future |

---

## Infrastructure Scalability

### Database
- **Current:** Single Supabase project (Dubai). Adequate to ~1M rows per table.
- **Multi-city scale:** One Supabase project with `city_id` partitioning OR one project per city (simpler multi-tenant isolation).

### CDN / Images
- **Current:** Images stored as URLs (ad-hoc hosting).
- **Target:** Supabase Storage buckets + Cloudflare R2 CDN for all images and assets.

### Edge Functions
- Supabase Edge Functions (Deno) for: email sending, webhook handling, recommendation scoring, trending score calculation.
- Add Supabase CRON (pg_cron) for daily trending score updates.

### Auth at Scale
- Rate limiting on auth endpoints (Supabase configurable)
- Consider Supabase enterprise plan at 100k+ MAU for dedicated DB + higher limits
- Session management: JWT expiry set to 1 hour, refresh tokens 7 days

---

## Development Priorities (Next 90 Days)

1. **Concierge Hub** — Build the missing `/concierge` page and request flow (see [features/concierge.md](../features/concierge.md))
2. **Live Supabase Integration** — Flip `isMockMode = false` vertically, starting with Experiences
3. **Notifications** — In-app notification system + email via Resend
4. **Supplier self-serve** — Phase 1: supplier portal for managing own service listings
5. **Search** — Full-text search via Supabase `textSearch()` on published services
6. **Multi-city schema migration** — Add `city_id` to all tables, backfill Dubai
