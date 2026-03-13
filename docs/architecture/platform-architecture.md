# DALC Platform Architecture

## Overview

DALC is a layered full-stack web application. The frontend is a React SPA communicating with Supabase (hosted PostgreSQL + Auth + Storage). All data access is mediated through service functions in `src/lib/` that support both a mock mode and live Supabase mode via an `isMockMode` flag.

---

## Architecture Layers

```
┌────────────────────────────────────────────────────────────┐
│                    USER BROWSER                            │
├────────────────────────────────────────────────────────────┤
│                 PRESENTATION LAYER                         │
│  React 18 + TypeScript                                     │
│  Tailwind CSS + Framer Motion                              │
│  Pages (49 files) → Components → Design System            │
├────────────────────────────────────────────────────────────┤
│                  STATE LAYER                               │
│  Zustand (useAppStore) — auth session, profile, UI         │
│  React Query — server state, caching, background refetch   │
├────────────────────────────────────────────────────────────┤
│                  SERVICE LAYER                             │
│  src/lib/*.ts — one file per vertical                      │
│  Mock mode ↔ Supabase mode (isMockMode toggle)            │
│  Hooks (src/hooks/*.ts) — React Query wrappers             │
├────────────────────────────────────────────────────────────┤
│                  BACKEND LAYER                             │
│  Supabase                                                  │
│  ├── PostgreSQL — all data                                 │
│  ├── Auth — JWT-based user sessions                        │
│  ├── Storage — document uploads                           │
│  ├── RLS — row-level access policies                       │
│  └── Realtime — live request status (planned)             │
└────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Entry Point
```
index.tsx
  └── App.tsx
        ├── QueryClientProvider     ← React Query global client
        ├── BrowserRouter           ← React Router v6
        ├── AuthListener            ← Supabase auth state sync
        └── AppRouter               ← src/app/router.tsx (all routes)
```

### State Management — Zustand (`useAppStore`)

The global store manages:
- `session` — Supabase `Session` object (JWT, user ID)
- `profile` — `Profile` object (name, role, tier, skills, relocation_stage)
- `setSession()`, `setProfile()`, `clearAuth()` — auth state mutations

**Auth Listener Pattern:**
`App.tsx` contains an `<AuthListener />` component that subscribes to `supabase.auth.onAuthStateChange`. On sign-in, it auto-fetches the user's `profiles` record and populates the store.

### Data Fetching — React Query

All server state is fetched through hooks in `src/hooks/`:
```
useVenues()               → venues table (filtered)
useRequests()             → requests table
useExperiences()          → experience_services
useTransport()            → transport_services
useStays()                → stays_properties
useBusiness()             → business_services
useRelocation()           → relocation_profiles
useRelocationDocs()       → user_documents
useRelocationCost()       → relocation_cost_estimates
useConsultation()         → business_consultations
useTransportBooking()     → transport_bookings
useStaysBooking()         → stays_bookings
useExperienceBooking()    → experience_bookings
useBusinessBooking()      → business_bookings
useSuppliers()            → suppliers
useUser()                 → profiles (current user)
useAdmin()                → admin-scoped queries
useVenue()                → single venue by ID
```

Each hook wraps a service function from `src/lib/` with React Query's `useQuery` or `useMutation`.

### Routing — React Router v6

Routes are defined in `src/app/router.tsx`. Two guard components protect private routes:
- `AuthGuard` — redirects to `/login` if no session
- `AdminGuard` — redirects to `/` if role is not `admin` or `concierge`

See [routing-structure.md](routing-structure.md) for the full route tree.

---

## Backend Architecture

### Supabase Project Structure

```
Supabase
├── auth.users                    ← Managed by Supabase Auth
├── public.profiles               ← Extended user profile (main schema.sql)
├── public.suppliers              ← Supplier registry (main schema.sql)
├── public.venues                 ← Venue catalogue (main schema.sql)
├── public.requests               ← Concierge requests (main schema.sql)
├── public.request_status_log     ← Audit trail (auto-trigger)
├── public.experience_services    ← Experiences vertical
├── public.experience_bookings    ← Experiences bookings
├── public.transport_services     ← Transport vertical
├── public.transport_bookings     ← Transport bookings
├── public.stays_properties       ← Stays vertical
├── public.stays_availability     ← Per-date availability calendar
├── public.stays_bookings         ← Stays bookings
├── public.business_services      ← Business vertical
├── public.business_consultations ← Consultation scheduling
├── public.business_bookings      ← Business service bookings
├── public.relocation_profiles    ← Relocation vertical
├── public.user_workflows         ← Multi-step workflow engine
├── public.user_workflow_steps    ← Individual workflow steps
├── public.user_documents         ← Document upload tracking
└── public.relocation_cost_estimates ← Budget breakdown
```

### Row Level Security (RLS) Strategy

| Access Pattern | Policy |
|----------------|--------|
| Public read | `venues` (published), `experience_services` (published), `transport_services`, `stays_properties`, `business_services` |
| User owns row | `profiles`, `requests`, all `*_bookings` tables, `relocation_profiles`, `user_workflows`, `user_documents`, `relocation_cost_estimates` |
| Admin full access | All tables accessible to `role = 'admin'` or `role = 'concierge'` |
| Supplier scoped | Suppliers can only read/write their own services (planned) |

### Auto-Triggers
1. **Profile creation:** `handle_new_user()` — auto-creates a `profiles` record on `auth.users` insert
2. **Timestamp update:** `update_updated_at_column()` — updates `updated_at` on every row mutation
3. **Request audit:** `log_request_status_change()` — writes to `request_status_log` on `requests.status` change

---

## Data Flow Pattern

### Standard Fetch Flow
```
Component renders
  → Hook (useExperiences) calls useQuery
  → React Query checks cache
  → On miss: calls lib function (getExperiences)
  → lib function checks isMockMode
    → true: returns MOCK_EXPERIENCES array
    → false: runs Supabase query with RLS
  → Data returned to component
  → React Query caches + background-refreshes
```

### Mock → Live Migration Pattern

All service files in `src/lib/` use this pattern:
```typescript
const isMockMode = !supabase || process.env.NODE_ENV === 'test';

export async function getExperiences(filters?: ExperienceFilters) {
  if (isMockMode) {
    return MOCK_EXPERIENCES.filter(...);
  }
  const { data, error } = await supabase
    .from('experience_services')
    .select('*')
    ...
  if (error) throw error;
  return data;
}
```

To go live: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. The `supabase` client in `src/lib/supabase.ts` will instantiate, and `isMockMode` will become `false`.

---

## Authentication Flow

```
User visits protected route
  → AuthGuard checks useAppStore.session
  → No session → redirect to /login

User submits login form
  → supabase.auth.signInWithPassword()
  → Supabase returns JWT session
  → AuthListener.onAuthStateChange fires
  → setSession(session)
  → getProfile(user.id) fetches profiles row
  → setProfile(profile)
  → AuthGuard re-evaluates → renders protected page

Session persistence
  → Supabase stores JWT in localStorage
  → On app load, supabase.auth.getSession() restores session
  → AuthListener hydrates store from restored session
```

### User Roles
| Role | Access |
|------|--------|
| `user` | Own data, published content, own bookings and requests |
| `concierge` | Own data + all requests + venue/supplier read |
| `admin` | Full access — all tables, admin panel routes |

### User Tiers
`standard` | `gold` | `platinum` | `black`

Tiers unlock access to premium content and priority concierge handling (future feature).

---

## Component Architecture

### Component Hierarchy
```
src/components/
├── auth/            ← AuthGuard, AdminGuard
├── business/        ← ComplianceChecklist, ConsultationScheduler, DocumentRequirements, ProcessTimeline
├── cards/           ← Reusable card components
├── error/           ← Error boundary, error states
├── experiences/     ← Experience-specific components
├── feed/            ← Activity feed components
├── map/             ← Map integration (planned)
├── navigation/      ← Navbar, mobile nav, breadcrumbs
├── orbit/           ← Orbit visualisation component
├── relocation/      ← Relocation-specific components
├── requests/        ← Request form components
├── skeletons/       ← Loading skeleton components
├── stays/           ← Property-specific components
├── transport/       ← Transport-specific components
└── trending/        ← TrendingStrip, trending card
```

### Shared Design Components
All verticals use shared presentational components:
- `TrendingStrip` — horizontal scrollable trending items
- Skeleton components for each card type (loading states)
- Error components with retry actions

---

## Performance Considerations

| Strategy | Implementation |
|----------|---------------|
| Code splitting | Vite automatic chunk splitting per route |
| Image optimization | Unsplash CDN URLs with size params |
| Data caching | React Query `staleTime: 5 * 60 * 1000` (5 minutes) |
| Animation performance | Framer Motion `will-change: transform` on hover states |
| Database indexes | Created on: category, status, user_id, created_at, slug |

---

## Security Architecture

| Layer | Control |
|-------|---------|
| Network | HTTPS only (Supabase enforced) |
| Auth | JWT tokens, auto-refresh, short expiry |
| Database | RLS on every table — no unprotected data |
| Admin routes | `AdminGuard` component + RLS admin check |
| Input validation | TypeScript types + Supabase schema constraints |
| File uploads | Supabase Storage with auth-scoped buckets |

---

## Related Documentation

- [Folder Structure](folder-structure.md)
- [Routing Structure](routing-structure.md)
- [Database Schema](../database/database-schema.md)
- [User Accounts](../platform/user-accounts.md)
- [Request System](../platform/request-system.md)
