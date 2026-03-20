# Architecture Overview
> Last updated: 2026-03-20

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React 18 + Vite | SPA only |
| Language | TypeScript | `@/*` alias → `./src` |
| Styling | Tailwind CSS 3.4 | Custom tokens: `luxury-gold`, `luxury-black` |
| UI Components | Shadcn / Radix UI | 30 primitives in `src/components/ui/` |
| State | Zustand v5 | `persist` middleware for onboarding, savedVenues |
| Data Fetching | TanStack Query v5 | All remote data — optimistic updates on mutations |
| Routing | React Router v6 | 60+ routes, all lazy-loaded via `React.lazy` |
| Animation | Framer Motion | Shared variants in `src/lib/motion.ts` |
| Maps | `@vis.gl/react-google-maps` + Mapbox GL | Live map feature uses Google Maps 3D |
| Backend | Supabase | Postgres + Auth + Storage |
| Migrations | Supabase CLI | `supabase/migrations/` — 9 migration files |

---

## Environment Mode

```ts
// src/lib/supabase.ts
const hasValidConfig =
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder');

export const supabase = hasValidConfig ? createClient(...) : null;
export const isMockMode = !supabase;
```

- When env vars are absent or placeholder → `supabase = null` → all service functions return hardcoded mock data
- `.env.local` has real credentials → Supabase IS live in the current environment
- `.env` has `VITE_GOOGLE_MAPS_API_KEY` — this file is likely git-tracked (**security issue**)

---

## Auth Flow

```
App.tsx → <AuthListener> (inline component, mounts once)
  └── supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)                        → Zustand
        if (session) {
          getProfile(session.user.id)              → supabase.from('profiles')
            └── setProfile(profile)               → Zustand
        } else {
          clearAuth()                              → Zustand
        }
      })

<AuthGuard>   → reads session from Zustand → redirects to /login (with state.from)
<AdminGuard>  → reads profile.role from Zustand → redirects if not 'admin' or 'concierge'
```

**Real auth wiring**: `src/App.tsx`
**Dead stub**: `src/features/auth/useAuth.ts` — always returns `null`, never imported, delete it

---

## Data Flow

```
Page Component
  └── useXxx()                           src/features/[vertical]/hooks/
        └── useQuery / useMutation       TanStack Query
              └── lib/[vertical].ts      service layer
                    ├── if isMockMode → return MOCK_DATA[]
                    └── supabase!.from('table').select / insert / update
```

Service functions are the single location where the mock/live decision happens.
React Query handles caching, background refetch, and optimistic updates.
Zustand holds auth state, onboarding progress, saved venues, and active filters.

---

## Folder Structure

```
src/
├── App.tsx                         AuthListener + provider tree + <AppRouter />
├── app/
│   ├── router.tsx                  All routes (React Router v6, lazy)
│   └── providers/index.tsx         QueryClient, TooltipProvider
│
├── lib/                            Service layer — all Supabase calls live here
│   ├── supabase.ts                 Client + isMockMode export
│   ├── auth.ts                     getProfile() → 'profiles' table
│   ├── transport.ts                Transport CRUD + mock fallback + broken RPC calls
│   ├── experiences.ts              Experience CRUD + mock fallback + broken RPC calls
│   ├── stays.ts                    Stays CRUD + calculatePrice() (real pricing engine)
│   ├── business.ts                 Business service CRUD
│   └── relocation.ts              Move-to-Dubai CRUD
│
├── platform/                       Cross-cutting business logic
│   ├── requests/lifecycle.ts       Request state machine (11 statuses, transitions, audit log)
│   ├── requests/suppliers.ts       Supplier CRUD (createWithVenues, update, bulkUpsert)
│   ├── requests/timeline.ts        Timeline display helpers
│   └── notifications/              Placeholder only — all console.info
│       ├── requestNotifications.ts
│       └── supplierNotifications.ts
│
├── features/                       Feature-sliced verticals
│   └── [vertical]/
│       ├── pages/                  Route components
│       ├── hooks/                  React Query hooks (useQuery / useMutation)
│       └── types.ts
│
├── admin/                          ✅ Active admin implementation
│   ├── pages/                      All admin route components
│   ├── components/                 Shared admin UI (StatCard, SearchInput, etc.)
│   └── hooks/                      Admin-specific form/filter/disclosure hooks
│
├── pages/                          Mixed — active routes + legacy duplicates
│   ├── admin/                      ⚠️ Legacy duplicate of src/admin/pages/ — router mixes both
│   ├── auth/                       Active: Login, Register, Onboarding
│   ├── home/                       Active: HomePage
│   ├── profile/                    Active: ProfilePage
│   ├── move-to-dubai/              Active: re-export shims → features/move-to-dubai/pages/
│   ├── Home.tsx Login.tsx etc.     ⚠️ Root-level duplicates — unused, delete
│   └── [nightlife, travel, etc.]   Active route components
│
├── store/
│   └── useAppStore.ts              Zustand — session, profile, isAdmin, savedVenues, filters
│
├── components/
│   ├── ui/                         30 Shadcn/Radix primitives
│   ├── auth/                       AuthGuard, AdminGuard
│   └── transport/                  BookingForm (active), CarFleet/JetFleet (dead)
│
├── shared/
│   └── hooks/useSupplierRegistry.ts  Supplier CRUD mutations — used by AdminSupplierForm
│
├── hooks/                          ⚠️ Root-level duplicates of features/*/hooks/ — consolidate
├── data/                           Static/mock data (carFleet, chauffeurFleet, jetFleet — dead)
├── entities/                       Entity type + service barrel exports
└── types.ts                        Global shared types
```

---

## Database Tables

| Table | Used By | Notes |
|---|---|---|
| `profiles` | `lib/auth.ts`, `AuthListener` | Primary user table — auth reads this |
| `users` | `useUser.ts`, `ProfilePage.tsx` | ⚠️ Conflict — same entity, second table |
| `venues` | Nightlife features, admin | Nightlife inventory |
| `suppliers` | `platform/requests/suppliers.ts` | Vendor directory |
| `requests` | Request system, concierge, admin | Core transaction table |
| `request_status_log` | `platform/requests/lifecycle.ts` | Audit trail per status change |
| `transport_services` | `lib/transport.ts` | Cars, yachts, jets inventory |
| `transport_bookings` | `lib/transport.ts` | Booking records |
| `experience_services` | `lib/experiences.ts` | Experiences inventory |
| `experience_bookings` | `lib/experiences.ts` | Booking records |
| `stays_availability` | `lib/stays.ts` | Property calendar |
| `stays_bookings` | `lib/stays.ts` | Booking records |
| `v_service_catalog` | Admin overview | Sync view — optional, may not exist |
| `v_booking_sync` | Admin overview | Sync view — optional, may not exist |

---

## Request State Machine

Implemented in `src/platform/requests/lifecycle.ts`.

```
pending
  → acknowledged → submitted → assigned → supplier_contacted
    → in_progress → quoted → confirmed → completed

Any state  → cancelled
Any active → on_hold
```

Each valid transition atomically:
1. Updates `requests.status` in Supabase
2. Appends a row to `request_status_log`
3. Fires a notification hook (currently `console.info` only)

---

## Known Architectural Issues

| Issue | Location | Severity |
|---|---|---|
| `profiles` vs `users` table split | `lib/auth.ts` vs `useUser.ts` | Critical |
| Availability RPCs missing in DB | `lib/transport.ts`, `lib/experiences.ts` | Critical |
| Two admin directories in router | `src/pages/admin/` + `src/admin/pages/` | High |
| Root `src/hooks/` duplicates `features/*/hooks/` | `src/hooks/` | Medium |
| No server-side price validation | All booking flows | Medium |
| No payment processing | Entire codebase | Critical |
| Notifications are console.info | `platform/notifications/` | High |

