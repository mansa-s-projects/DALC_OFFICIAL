# TODO: Live Map — `/live-map`

> Priority: 🔴 CRITICAL — Navbar link leads to empty placeholder

---

## Current State

```tsx
// src/app/router.tsx
<Route path="/live-map" element={<div className="pt-40 text-center text-white">Live Map Coming Soon</div>} />
```

The Navbar shows "Live Map" as a primary nav item. Clicking it renders a single line of text.

---

## What Needs to Be Built

### Page: `/live-map`
New file: `src/pages/live-map/LiveMapPage.tsx`

---

## Full Feature Spec

### 1. Map Integration
- Integrate **Mapbox GL JS** or **Google Maps JavaScript API** (or keep existing `PremiumMap` component if Mapbox is wired)
- Check `src/components/map/PremiumMap.tsx` — determine if it uses real or simulated map, upgrade if stub
- Center on Dubai by default: `{ lng: 55.2708, lat: 25.2048, zoom: 11 }`
- Map style: dark luxury theme (Mapbox `mapbox://styles/mapbox/dark-v11` or custom)

### 2. Venue Pins / Markers
- Load all venues from `venues` table via `useVenues()` hook
- Plot each venue as a custom gold pin marker
- Group pins by category: Nightlife (purple), Dining (amber), Beach Clubs (blue), etc.
- On marker click: open side panel or popup card with venue summary

### 3. Service Overlays (Optional Phase 2)
- Toggle layer for experience services (`experience_services` table)
- Toggle layer for transport pickup locations
- Toggle layer for stays properties

### 4. Category Filter Bar
- Horizontal filter strip above map: `All | Nightlife | Beach Clubs | Restaurants | Dining | Experiences`
- Toggling a category shows/hides the relevant pin layer

### 5. Side Panel / Drawer
- When a pin is clicked, a slide-in panel shows:
  - Venue hero image
  - Name, category badge
  - Short description
  - "View Details" button → `/venue/:id`
  - "Request" button → `/concierge/request?venue=:id`

### 6. Search on Map
- Search input overlaid on map (top left)
- As user types: filters visible pins to matching venues
- Similar to existing `SearchResults` but overlaid on map

### 7. Location-Based "Near Me" (Phase 2)
- "Near Me" button: requests browser geolocation
- Recenters map on user's location
- Shows venues within configurable km radius

---

## Component Structure

```
src/pages/live-map/
  LiveMapPage.tsx          ← main page (Navbar + MapView + side panel)
  
src/components/map/
  PremiumMap.tsx           ← upgrade to real Mapbox/Google integration
  MapVenuePin.tsx          ← custom styled marker component
  MapSidePanel.tsx         ← slide-in venue detail panel
  MapCategoryFilter.tsx    ← filter bar component
  MapSearchOverlay.tsx     ← search overlay input
```

---

## Router Change Required

```tsx
// src/app/router.tsx — REMOVE:
<Route path="/live-map" element={<div className="pt-40 text-center text-white">Live Map Coming Soon</div>} />

// ADD:
const LiveMapPage = lazy(() => import('../pages/live-map/LiveMapPage'));
<Route path="/live-map" element={<LiveMapPage />} />
```

---

## Data Requirements

- `venues` table: needs `latitude`, `longitude` columns (or parse from existing `coordinates` / `location` fields)
- If coordinates are stored in `location TEXT` as "lat,lng" string → parse on client
- If using Mapbox: add `VITE_MAPBOX_TOKEN` to `.env.local`
- If using Google Maps: add `VITE_GOOGLE_MAPS_KEY` to `.env.local`

---

## Environment Variables Needed

```env
VITE_MAPBOX_TOKEN=pk.eyJ1...
# OR
VITE_GOOGLE_MAPS_KEY=AIza...
```

---

## Dependencies to Install

```bash
# Mapbox option
npm install mapbox-gl @types/mapbox-gl react-map-gl

# Google Maps option
npm install @vis.gl/react-google-maps
```

---

## Acceptance Criteria

- [ ] `/live-map` loads a real interactive map centered on Dubai
- [ ] All venues from the `venues` table have visible pins
- [ ] Pins are color-coded by category
- [ ] Clicking a pin opens a side panel with venue info
- [ ] Side panel "View Details" navigates to venue detail page
- [ ] Category filter bar shows/hides relevant pin layers
- [ ] Map is responsive (works on mobile with appropriate touch events)
- [ ] Navbar "Live Map" link works and loads within 2s
