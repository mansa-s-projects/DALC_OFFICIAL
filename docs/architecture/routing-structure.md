# DALC Routing Structure

## Overview

All routes are defined in `src/app/router.tsx`. The router uses React Router v6 `<Routes>` with nested routes for the admin panel. Route guards wrap protected routes using `AuthGuard` and `AdminGuard` components.

---

## Current Route Tree

### Public Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `Home` | Landing page |
| `/onboarding` | `Onboarding` | User skill/preference setup |
| `/login` | `Login` | Auth |
| `/register` | `Register` | Auth |
| `/explore` | `Explore` | Discovery hub |
| `/explore/:category` | `Explore` | Category-filtered explore |

### Venue / Request Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/venue/:id` | `VenueDetail` | Single venue detail |
| `/request` | `Request` | Concierge request form |
| `/request/success` | `RequestSuccess` | Confirmation page |
| `/my-requests` | `MyRequests` | **Auth required** |

### Admin Routes (nested under AdminGuard)

| Route | Component | Notes |
|-------|-----------|-------|
| `/admin` | `AdminLayout` | Admin shell — redirects to overview |
| `/admin/overview` | `AdminOverview` | Dashboard metrics |
| `/admin/requests` | `AdminRequests` | Request management |
| `/admin/venues` | `AdminVenues` | Venue listing |
| `/admin/venues/new` | `AdminVenueForm` | Create venue |
| `/admin/venues/:id` | `AdminVenueForm` | Edit venue |
| `/admin/suppliers` | `AdminSuppliers` | Supplier listing |
| `/admin/suppliers/new` | `AdminSupplierForm` | Create supplier |
| `/admin/suppliers/:id` | `AdminSupplierForm` | Edit supplier |

### Move to Dubai (Relocation) Routes

| Route | Component | Auth |
|-------|-----------|------|
| `/move-to-dubai` | `MoveToDubai` | Public |
| `/move-to-dubai/intake` | `Intake` | **Required** |
| `/move-to-dubai/dashboard` | `Dashboard` | **Required** |
| `/move-to-dubai/documents` | `Documents` | **Required** |
| `/move-to-dubai/cost` | `CostEstimator` | **Required** |

### Business Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/business` | `BusinessHub` | Hub page |
| `/business/:subcategory` | `SubcategoryList` | e.g. `/business/company-formation` |
| `/business/:subcategory/:slug` | `ServiceDetail` | Service detail |
| `/business/consultation/:id` | `ConsultationPage` | Consultation detail |

### Transport Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/transport` | `TransportHub` | Hub page |
| `/transport/cars` | `CarsList` | Cars listing |
| `/transport/yachts` | `YachtsList` | Yachts listing |
| `/transport/jets` | `JetsList` | Jets listing |
| `/transport/:subcategory/:slug` | `TransportDetail` | Vehicle detail |

### Stays Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/stays` | `StaysHub` | Hub page |
| `/stays/hotels` | `HotelsList` | Hotels listing |
| `/stays/villas` | `VillasList` | Villas listing |
| `/stays/residences` | `ResidencesList` | Residences listing |
| `/stays/:subcategory/:slug` | `PropertyDetail` | Property detail |

### Experiences Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/experiences` | `ExperiencesHub` | Hub |
| `/experiences/:subcategory` | `SubcategoryList` | e.g. `/experiences/water` |
| `/experiences/:subcategory/:slug` | `ExperienceDetail` | Experience detail |

### Nightlife Routes (Pillar 3)

| Route | Component | Notes |
|-------|-----------|-------|
| `/nightlife` | `NightlifeHub` | Nightlife landing page |
| `/nightlife/clubs` | `NightClubs` | Nightclub listing |
| `/nightlife/beach-clubs` | `BeachClubs` | Beach club listing |
| `/nightlife/restaurants` | `Restaurants` | Restaurant listing |
| `/nightlife/dining` | `DiningEntertainment` | Dining entertainment listing |

### Concierge Routes (Pillar 7)

| Route | Component | Notes |
|-------|-----------|-------|
| `/concierge` | `ConciergeHub` | Concierge landing page |
| `/concierge/request` | `ConciergeRequest` | 4-step request submission form |

### Legacy / Redirect Routes

| Route | Redirects To | Notes |
|-------|-------------|-------|
| `/restaurants` | `/nightlife/restaurants` | Old root-level routes |
| `/beach-clubs` | `/nightlife/beach-clubs` | Old root-level routes |
| `/dining-entertainment` | `/nightlife/dining` | Old root-level routes |
| `/explore/dining` | `/nightlife/restaurants` | Old editorial hubs |
| `/explore/beach-clubs` | `/nightlife/beach-clubs` | Old editorial hubs |
| `/explore/nightlife` | `/nightlife` | Old editorial hubs |
| `/explore/dining-entertainment` | `/nightlife/dining` | Old editorial hubs |
| `/explore/experiences` | `/experiences` | Old editorial hub |
| `/experiences/category` | `/experiences` | Old redundant segment |
| `/auth` | `/login` | Auth alias |
| `/live-map` | — | Placeholder "Coming Soon" div |

---

## Component Import Paths

All imports in `router.tsx` use these canonical paths:

| Pillar | Component Path |
|--------|---------------|
| Move to Dubai | `src/features/move-to-dubai/pages/` |
| Experiences | `src/features/experiences/pages/` |
| Nightlife | `src/features/nightlife/pages/` |
| Stays | `src/features/stays/pages/` |
| Transport | `src/features/transport/pages/` |
| Business | `src/features/business/pages/` |
| Concierge (hub + form) | `src/pages/concierge/` |
| Admin | `src/admin/pages/` |
| Shell pages | `src/pages/` |

---

## Route Guard Strategy

### AuthGuard
Located: `src/components/auth/AuthGuard.tsx`

Behavior:
- Reads `session` from `useAppStore`
- If no session: renders `<Navigate to="/login" replace />`
- If session exists: renders `children`

Protected routes:
- `/my-requests`
- `/move-to-dubai/intake`
- `/move-to-dubai/dashboard`
- `/move-to-dubai/documents`
- `/move-to-dubai/cost`

### AdminGuard
Located: `src/components/auth/AdminGuard.tsx`

Behavior:
- Reads `profile.role` from `useAppStore`
- If role is not `admin` or `concierge`: renders `<Navigate to="/" replace />`
- If authorized: renders `children`

Protected routes:
- All `/admin/*` routes

---

## URL Parameter Conventions

| Pattern | Example | Used for |
|---------|---------|---------|
| `:id` (UUID) | `/venue/abc-123` | Database record IDs |
| `:slug` (kebab-case) | `/transport/cars/rolls-royce-ghost` | SEO-friendly URLs, generated by `generateTransportSlug()` |
| `:subcategory` | `/business/company-formation` | Enum values from DB |
| `?category=` | `/explore?category=nightlife` | Filter params |
| `?type=` | `/transport/cars?type=chauffeur` | Sub-type filter |

### Slug Generation
Transport slugs are generated by `generateTransportSlug()` in `src/lib/transport.ts`:
```typescript
// Format: {make}-{model}-{year} or {name}-{type}
// e.g., "rolls-royce-ghost-2024", "85ft-luxury-yacht"
```

---

## Scalability Notes

- **Multi-city prefix:** For multi-city, prefix all pillar routes with `/:city` (e.g., `/dubai/experiences`). Implement a city resolver that reads from URL and provides a `CityContext` to all vertical components.
- **Canonical routes:** All legacy routes should use `<Navigate replace>` so search engines receive proper 301-equivalent signals
- **Lazy loading:** Wrap each vertical hub import in `React.lazy()` + `Suspense` to split the bundle by pillar
- **Breadcrumbs:** Route structure maps naturally to breadcrumb trail — implement a breadcrumb component that parses `useLocation()` segments
