# Categories & Subcategories

## Overview

DALC organizes all content and services into a **7-pillar hierarchy**. Each pillar maps to a top-level route, a feature slice, and its own data model. Within each pillar, subcategories drive routing and DB filtering.

```
Pillar 1 — Move to Dubai     /move-to-dubai
Pillar 2 — Experiences       /experiences
Pillar 3 — Nightlife         /nightlife
Pillar 4 — Stays             /stays
Pillar 5 — Transport         /transport
Pillar 6 — Business Setup    /business
Pillar 7 — Concierge         /concierge
```

---

## Pillar 1 — Move to Dubai

**Feature slice:** `src/features/move-to-dubai/`  
**DB table:** `relocation_profiles`, `relocation_documents`, `user_workflow_steps`

### Relocation Purpose (`RelocationPurpose`)
```typescript
type RelocationPurpose =
  | 'employment'
  | 'business'
  | 'retirement'
  | 'family'
  | 'investment';
```

### Budget Range (`BudgetRange`)
```typescript
type BudgetRange =
  | 'under_10k'
  | '10k_50k'
  | '50k_200k'
  | '200k_plus';
```

### Routes
| Route | Page |
|-------|------|
| `/move-to-dubai` | Hub |
| `/move-to-dubai/intake` | Intake form (auth required) |
| `/move-to-dubai/dashboard` | Workflow dashboard (auth required) |
| `/move-to-dubai/documents` | Document tracker (auth required) |
| `/move-to-dubai/cost` | Cost estimator (auth required) |

---

## Pillar 2 — Experiences

**Feature slice:** `src/features/experiences/`  
**DB table:** `experience_services`, `experience_bookings`

### Subcategory (`ExperienceSubcategory`)
```typescript
type ExperienceSubcategory =
  | 'adventure'
  | 'dining'
  | 'water'
  | 'sky'
  | 'wellness'
  | 'culture'
  | 'nightlife';  // event-based nightlife packages (distinct from Pillar 3 venues)
```

### Sub-subcategories (from `SUB_SUBCATEGORIES` map)

| Subcategory | Sub-subcategories |
|-------------|-------------------|
| `adventure` | `desert-safari`, `skydiving`, `bungee-jumping`, `off-road` |
| `dining` | `chefs-table`, `tasting-menu`, `dinner-cruise`, `cooking-class` |
| `water` | `scuba-diving`, `jet-ski`, `parasailing`, `kayaking` |
| `sky` | `helicopter-tour`, `hot-air-balloon`, `skydive-palm` |
| `wellness` | `spa-resort`, `yoga-retreat`, `meditation`, `fitness-bootcamp` |
| `culture` | `museum-tour`, `art-gallery`, `heritage-walk`, `traditional-market` |
| `nightlife` | `clubs`, `rooftop-lounges`, `speakeasies`, `live-music` |

### Service Types & Pricing Models
```typescript
type ServiceType   = 'event' | 'recurring' | 'on_demand' | 'seasonal';
type PricingModel  = 'per_person' | 'per_group' | 'fixed' | 'tiered' | 'free';
```

### Routes
| Route | Page |
|-------|------|
| `/experiences` | Hub |
| `/experiences/:subcategory` | Subcategory listing |
| `/experiences/:subcategory/:slug` | Experience detail |

---

## Pillar 3 — Nightlife

**Feature slice:** `src/features/nightlife/`  
**DB table:** `public.venues` (shared) — filtered by `category`

> Nightlife uses the **venue model**, not the service/booking model. It is distinct from the Experiences vertical. CTAs route to `/concierge/request`, not a booking engine.

### `Category` Type (`src/types.ts`) — values used by the `venues` table
```typescript
type Category =
  | 'dining'
  | 'nightlife'
  | 'beach-clubs'
  | 'dining-entertainment'
  | 'yachts'
  | 'travel'
  | 'car-rental'
  | 'experiences'
  | 'wellness'
  | 'shopping'
  | 'business'
  | 'events'
  | 'sports';
```

### Nightlife Category → Route Mapping
| `venues.category` value | Route | Page |
|-------------------------|-------|------|
| `'nightlife'` | `/nightlife/clubs` | `NightClubs.tsx` |
| `'beach-clubs'` | `/nightlife/beach-clubs` | `BeachClubs.tsx` |
| `'dining'` | `/nightlife/restaurants` | `Restaurants.tsx` |
| `'dining-entertainment'` | `/nightlife/dining` | `DiningEntertainment.tsx` |

### Venue `price_tier` Values
| Value | Display | Meaning |
|-------|---------|---------|
| `1` | `$` | Budget-friendly |
| `2` | `$$` | Mid-range |
| `3` | `$$$` | Premium |
| `4` | `$$$$` | Ultra-luxury |

### Routes
| Route | Page |
|-------|------|
| `/nightlife` | Hub (featured + trending + category grid) |
| `/nightlife/clubs` | Night clubs listing |
| `/nightlife/beach-clubs` | Beach clubs listing |
| `/nightlife/restaurants` | Restaurants listing |
| `/nightlife/dining` | Dining entertainment listing |
| `/venue/:id` | Venue detail (owned by nightlife vertical) |

---

## Pillar 4 — Stays

**Feature slice:** `src/features/stays/`  
**DB table:** `stays_properties`, `stays_bookings`, `seasonal_pricing`

### Subcategory (`StaysSubcategory`)
```typescript
type StaysSubcategory = 'hotels' | 'villas' | 'residences';
```

### Pricing Models
```typescript
type PricingModel = 'per_night' | 'per_week' | 'per_month' | 'fixed';
```

### Routes
| Route | Page |
|-------|------|
| `/stays` | Hub |
| `/stays/hotels` | Hotels listing |
| `/stays/villas` | Villas listing |
| `/stays/residences` | Residences listing |
| `/stays/:subcategory/:slug` | Property detail |

---

## Pillar 5 — Transport

**Feature slice:** `src/features/transport/`  
**DB table:** `transport_services`, `transport_bookings`

### Subcategory (`TransportSubcategory`)
```typescript
type TransportSubcategory = 'cars' | 'yachts' | 'jets';
```

### Sub-subcategories

| Subcategory | Sub-subcategories |
|-------------|-------------------|
| `cars` | `luxury-sedans`, `sports-cars`, `suvs`, `chauffeur-service`, `long-term-rental` |
| `yachts` | `day-cruises`, `overnight-charters`, `fishing-trips`, `party-yachts` |
| `jets` | `private-charter`, `shared-flights`, `helicopter-tours` |

### Pricing & Availability Models
```typescript
type PricingModel      = 'hourly' | 'daily' | 'fixed' | 'per_trip' | 'custom';
type AvailabilityType  = 'on_demand' | 'scheduled' | 'seasonal' | 'by_request';
```

### Routes
| Route | Page |
|-------|------|
| `/transport` | Hub |
| `/transport/cars` | Cars listing |
| `/transport/yachts` | Yachts listing |
| `/transport/jets` | Jets listing |
| `/transport/:subcategory/:slug` | Service detail |

---

## Pillar 6 — Business Setup

**Feature slice:** `src/features/business/`  
**DB table:** `business_services`, `business_bookings`, `consultation_slots`

### Subcategory (`BusinessSubcategory`)
```typescript
type BusinessSubcategory =
  | 'company-formation'
  | 'licensing'
  | 'banking'
  | 'tax'
  | 'residency-investment';
```

### Service & Pricing Models
```typescript
type ServiceType  = 'package' | 'consultation' | 'advisory' | 'filing';
type PricingModel = 'fixed' | 'starting_from' | 'custom_quote' | 'hourly';
```

### Routes
| Route | Page |
|-------|------|
| `/business` | Hub |
| `/business/:subcategory` | Subcategory listing |
| `/business/:subcategory/:slug` | Service detail |
| `/business/consultation/:id` | Consultation booking |

---

## Pillar 7 — Concierge

**Feature slice:** `src/features/concierge/`  
**DB table:** `public.requests` (shared) — filtered by `source = 'concierge'`

> Concierge is the human-touch fallback layer. It does NOT have its own DB table — requests are stored in the shared `requests` table with `source = 'concierge'`.

### Request Type (`ConciergeRequestType`)
```typescript
type ConciergeRequestType =
  | 'travel_arrival'        // Airport VIP, private transfers, travel planning
  | 'property_stay'         // Hotel suites, villas, serviced apartments
  | 'transport_lifestyle'   // Supercars, yachts, jets, chauffeur services
  | 'business_support'      // Company setup, compliance, banking, office space
  | 'event_reservation'     // Table reservations, event tickets, venue hire
  | 'personal_request';     // Anything else — shopping, gifting, lifestyle
```

### Status Flow (`ConciergeStatus`)
```typescript
type ConciergeStatus =
  | 'pending'        // Just submitted
  | 'acknowledged'   // Team has seen it
  | 'assigned'       // Assigned to a concierge
  | 'in_progress'    // Being fulfilled
  | 'completed'
  | 'cancelled';
```

### Urgency (`ConciergeUrgency`)
```typescript
type ConciergeUrgency = 'standard' | 'urgent' | 'asap';
```

### Routes
| Route | Page |
|-------|------|
| `/concierge` | Hub (auth required) |
| `/concierge/request` | 4-step submission form |

---

## DB Constraint Strategy

Subcategory values are validated at the TypeScript layer via union types. The following `CHECK` constraints are recommended for the next schema migration:

```sql
ALTER TABLE experience_services
  ADD CONSTRAINT valid_exp_subcategory
  CHECK (subcategory IN ('nightlife','adventure','dining','water','sky','wellness','culture'));

ALTER TABLE transport_services
  ADD CONSTRAINT valid_transport_subcategory
  CHECK (subcategory IN ('cars','yachts','jets'));

ALTER TABLE stays_properties
  ADD CONSTRAINT valid_stays_subcategory
  CHECK (subcategory IN ('hotels','villas','residences'));

ALTER TABLE business_services
  ADD CONSTRAINT valid_business_subcategory
  CHECK (subcategory IN ('company-formation','licensing','banking','tax','residency-investment'));
```

---

## Full Route Map

| Pillar | Route | Auth |
|--------|-------|------|
| Move to Dubai | `/move-to-dubai` | Public |
| Move to Dubai | `/move-to-dubai/intake` | Required |
| Move to Dubai | `/move-to-dubai/dashboard` | Required |
| Move to Dubai | `/move-to-dubai/documents` | Required |
| Move to Dubai | `/move-to-dubai/cost` | Required |
| Experiences | `/experiences` | Public |
| Experiences | `/experiences/:subcategory` | Public |
| Experiences | `/experiences/:subcategory/:slug` | Public |
| Nightlife | `/nightlife` | Public |
| Nightlife | `/nightlife/clubs` | Public |
| Nightlife | `/nightlife/beach-clubs` | Public |
| Nightlife | `/nightlife/restaurants` | Public |
| Nightlife | `/nightlife/dining` | Public |
| Nightlife | `/venue/:id` | Public |
| Stays | `/stays` | Public |
| Stays | `/stays/hotels` | Public |
| Stays | `/stays/villas` | Public |
| Stays | `/stays/residences` | Public |
| Stays | `/stays/:subcategory/:slug` | Public |
| Transport | `/transport` | Public |
| Transport | `/transport/cars` | Public |
| Transport | `/transport/yachts` | Public |
| Transport | `/transport/jets` | Public |
| Transport | `/transport/:subcategory/:slug` | Public |
| Business | `/business` | Public |
| Business | `/business/:subcategory` | Public |
| Business | `/business/:subcategory/:slug` | Public |
| Business | `/business/consultation/:id` | Public |
| Concierge | `/concierge` | Required |
| Concierge | `/concierge/request` | Required |

---

## Scalability: Multi-City

Categories and pillar structure remain consistent across cities. Content is scoped by `city_id` on each service table.

Future `cities` table:
```sql
id, name, slug, country, is_active, launched_at
```
