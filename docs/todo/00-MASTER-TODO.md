# DALC — Master TODO & Development Roadmap
> Last updated: March 16, 2026

---

## Priority Tiers

| Symbol | Meaning |
|--------|---------|
| 🔴 | Blocking / Broken — fix immediately |
| 🟠 | High priority — user-facing gap |
| 🟡 | Medium — feature incomplete |
| 🔵 | Low — polish / nice-to-have |
| ✅ | Done |

---

## Quick Status By Vertical

| Vertical | Route | Status | Detail File |
|----------|-------|--------|-------------|
| Home | `/` | ✅ Built | — |
| Explore | `/explore` | ✅ Built | [05-explore.md](./05-explore.md) |
| Live Map | `/live-map` | 🔴 Placeholder | [01-live-map.md](./01-live-map.md) |
| Move to Dubai | `/move-to-dubai` | 🟡 Mostly built | [06-move-to-dubai.md](./06-move-to-dubai.md) |
| Experiences | `/experiences` | 🟡 Mostly built | [07-experiences.md](./07-experiences.md) |
| Nightlife | `/nightlife` | 🟠 Mock data only | [02-nightlife.md](./02-nightlife.md) |
| Travel (Stays) | `/travel` | 🟠 Flights broken | [09-stays.md](./09-stays.md) |
| Transport | `/transport` | 🟡 Mostly built | [08-transport.md](./08-transport.md) |
| Business | `/business` | 🟡 Mostly built | [10-business.md](./10-business.md) |
| Concierge | `/concierge` | 🟡 Mostly built | [11-concierge.md](./11-concierge.md) |
| Search | `/search` | 🟡 Partial | [13-search.md](./13-search.md) |
| Auth / Profile | `/login` `/profile` | 🟡 Partial | [12-auth-profile.md](./12-auth-profile.md) |
| Admin Panel | `/admin` | 🟠 Incomplete | [04-admin-extensions.md](./04-admin-extensions.md) |
| Notifications | — | 🔴 Not built | [14-notifications.md](./14-notifications.md) |
| Supplier Portal | — | 🔴 Not built | [15-supplier-portal.md](./15-supplier-portal.md) |

---

## Critical Blockers (Fix First)

### 🔴 1. Live Map — `/live-map` is a placeholder div
The Navbar links directly to `/live-map` but renders `"Live Map Coming Soon"` text.  
→ See [01-live-map.md](./01-live-map.md)

### 🔴 2. Flights page is a bug — re-exports JetsList
`src/pages/travel/Flights.tsx` does `export { default } from '../../features/transport/pages/JetsList'`  
→ See [09-stays.md](./09-stays.md)

### 🔴 3. Nightlife listing pages use `MOCK_VENUES` static array
All 4 sub-category pages (`/nightlife/clubs`, `/beach-clubs`, `/restaurants`, `/dining`) pull from `MOCK_VENUES` instead of Supabase.  
→ See [02-nightlife.md](./02-nightlife.md)

---

## High Priority Gaps

### 🟠 4. Admin panel missing 6 booking verticals
Admin only covers: Venues, Suppliers, Requests. Missing: Transport, Experiences, Business, Stays, Relocation, Concierge.  
→ See [04-admin-extensions.md](./04-admin-extensions.md)

### 🟠 5. Notifications system — not built at all
No in-app or email notifications on any booking, request, or document status change.  
→ See [14-notifications.md](./14-notifications.md)

### 🟠 6. Supplier Portal — does not exist
No supplier-facing dashboard, onboarding, or service management UI.  
→ See [15-supplier-portal.md](./15-supplier-portal.md)

---

## Medium Priority

### 🟡 7. My Requests — no real-time updates
`/my-requests` loads once; no Supabase Realtime subscription for status changes.  
→ See [11-concierge.md](./11-concierge.md)

### 🟡 8. Move to Dubai — intake back link broken
Intake page back arrow navigates to `/relocation` which doesn't exist.  
→ See [06-move-to-dubai.md](./06-move-to-dubai.md)

### 🟡 9. Explore — Orbit section incomplete
Orbit component exists but clicking categories doesn't deep-filter correctly.  
→ See [05-explore.md](./05-explore.md)

### 🟡 10. Search — cross-vertical, no facets
Search works for venues but doesn't surface experiences, transport, or business services.  
→ See [13-search.md](./13-search.md)

### 🟡 11. User tiers — stored but not gated
Gold/Platinum/Black tiers do nothing in the product yet.  
→ See [12-auth-profile.md](./12-auth-profile.md)

### 🟡 12. Experiences — no upcoming events displayed on hub
`useUpcomingEvents` hook exists but the hub doesn't render a proper events calendar.  
→ See [07-experiences.md](./07-experiences.md)

---

## Database Migrations Status

All 9 migration files exist in `supabase/migrations/`:

| File | Status |
|------|--------|
| relocation_schema | ✅ Written |
| transport_schema | ✅ Written |
| stays_schema | ✅ Written |
| experiences_schema | ✅ Written |
| business_schema | ✅ Written |
| requests_concierge_alignment | ✅ Written |
| suppliers_bulk_import | ✅ Written |
| platform_core_taxonomy_booking | ✅ Written |
| platform_security_hardening_and_sync | ✅ Written |

Action needed: **Confirm all migrations are applied to production Supabase project.**

---

## Tech Debt

| Item | File | Issue |
|------|------|-------|
| `Flights.tsx` wrong export | `src/pages/travel/Flights.tsx` | Re-exports JetsList — needs own implementation |
| Intake back link | `src/features/move-to-dubai/pages/Intake.tsx` | Points to `/relocation` (404) |
| `MOCK_VENUES` in nightlife | Multiple nightlife pages | Replace with Supabase `useVenues` hook queries |
| `MOCK_VENUES` in NightlifeHub | `src/features/nightlife/pages/NightlifeHub.tsx` | DiningEntertainment section uses static filter |
| No tests | Entire codebase | Zero test files anywhere |
| `project-structure-and-status.md` | `docs/` | Describes old file structure, needs update |
| Legacy `/request` form | `src/pages/Request.tsx` | Should redirect to `/concierge/request` |

---

## Completed ✅ 

- All 7 Pillars have hub pages
- All booking detail flows (Transport, Experiences, Stays, Business) built
- Admin panel: Venues + Suppliers CRUD, Requests queue, Overview stats
- Auth: Login, Register, Onboarding, AuthGuard, AdminGuard
- Concierge: 4-step request form wired to Supabase
- Move to Dubai: Intake, Dashboard (workflow), Documents (uploads), Cost Estimator
- Profile page: tier display, edit modal, skills
- Search: URL-synced results page
- Explore: grid + map split view, filters, collections strip
- Supabase schema: 20 tables fully designed and migration-ready
- RLS policies on all tables
- React Query throughout all data hooks
