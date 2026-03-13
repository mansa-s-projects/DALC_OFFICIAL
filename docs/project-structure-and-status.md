# DALC Project Structure and Status

## Full Project Structure

```text
dalc_new/
.env.example
.env.local
.gitignore
index.html
index.tsx
metadata.json
package.json
README.md
tailwind.config.js
tsconfig.json
vite.config.ts
src/
  App.tsx
  types.ts
  app/
    router.tsx
  components/
    cards/
      EditorialCard.tsx
      VenueCard.tsx
    map/
      PremiumMap.tsx
    navigation/
      Footer.tsx
      Navbar.tsx
    orbit/
      FloatingOrbit.tsx
  data/
    mockData.ts
  lib/
    motion.ts
    supabase.ts
  pages/
    AdminDashboard.tsx
    BeachClubs.tsx
    DiningEntertainment.tsx
    Experiences.tsx
    Explore.tsx
    Home.tsx
    NightClubs.tsx
    Nightlife.tsx
    Request.tsx
    Restaurants.tsx
    VenueDetail.tsx
  styles/
    index.css
  utils/
    cn.ts
```

## What's Implemented

1. App shell and routing are in place with all main pages wired in `src/app/router.tsx`.
2. Main UX pages are built with real React UI flows: `src/pages/Home.tsx`, `src/pages/Explore.tsx`, `src/pages/VenueDetail.tsx`, `src/pages/Request.tsx`, category/editorial pages, and `src/pages/AdminDashboard.tsx`.
3. Reusable design system components are implemented: `src/components/navigation/*`, `src/components/cards/*`, `src/components/orbit/FloatingOrbit.tsx`, `src/components/map/PremiumMap.tsx`.
4. Animation and UI polish are implemented with `framer-motion` and Tailwind custom theme: `src/lib/motion.ts`, `tailwind.config.js`, `src/styles/index.css`.
5. Data model and seeded mock content are substantial: `src/types.ts`, `src/data/mockData.ts` (categories, many venues, mock requests).
6. React Query provider is initialized in `src/App.tsx` (infrastructure is there).

## What's Left / Not Fully Implemented

1. Backend/data persistence is not connected. `src/lib/supabase.ts` exists, but no page/service consumes it.
2. React Query is not used for fetching/mutations yet. Only provider setup in `src/App.tsx`.
3. Auth and user features are placeholders: `/auth`, `/my-requests`, `/live-map` are "Coming Soon" in `src/app/router.tsx`.
4. Forms are UI-only. Reservation/request flows in `src/pages/Request.tsx` and `src/pages/VenueDetail.tsx` end in local success states, no API call.
5. Premium map is simulated, not real map integration. `src/components/map/PremiumMap.tsx` uses static imagery and visual controls.
6. Route/category behavior has gaps. `/explore/:category` route exists, but `src/pages/Explore.tsx` does not read URL params; it always starts from local state.
7. Some navigation targets lead to thin/empty experiences. Orbit links include categories like `/explore/sports`, but category handling/data is incomplete compared to the full type union in `src/types.ts`.
8. Admin dashboard is mock analytics only. `src/pages/AdminDashboard.tsx` uses `MOCK_REQUESTS` plus static chart data.
9. No tests are present. No `*.test.*` or `*.spec.*` files found.
10. Config/docs drift exists. `README.md` and `.env.local` focus on `GEMINI_API_KEY`, while runtime data layer expects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `src/lib/supabase.ts`.
11. `index.html` includes extra CDN Tailwind/importmap scaffolding that appears legacy compared to Vite bundling (`index.tsx`, `src/styles/index.css`).
