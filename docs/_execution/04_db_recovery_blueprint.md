# 04 — DB Recovery Blueprint (Production-First)

## Scope

This document consolidates the remaining production-hardening tasks after generating canonical schema types from the linked Supabase production project.

It covers:
- Strategic schema and type locations
- Type drift report (`database.types.ts` vs app-local assumptions)
- Query safety report and priorities
- Safe relationship migration plan
- Canonical entity map (legacy vs canonical models)
- API contract audit (core request/payment/lead/event routes)
- Typed service-layer architecture for incremental rollout

---

## 1) Strategic Schema And Type Locations

## Canonical schema sources (authoritative)

- `database.types.ts`
  - Generated from live production metadata
  - Source of truth for table/view row, insert, update shapes
- `supabase/tmp_remote_tables_types_utf8.json`
  - Table/view inventory from production
- `supabase/tmp_remote_columns_types_utf8.json`
  - Column names/types/nullability/defaults
- `supabase/tmp_remote_fkeys_utf8.json`
  - FK coverage snapshot

## App-level type layers (non-authoritative)

- `src/types.ts`
  - Product/domain UI contracts, currently mixed with DB assumptions
  - Must not be used as DB schema truth
- `src/entities/*/*Types.ts`
  - Feature-specific entity contracts

## Supabase client entry points

- `src/lib/supabase.ts`
  - Browser client (currently untyped generic to preserve compile stability)
- `src/lib/supabase-admin.ts`
  - Server/admin client (currently untyped generic to preserve compile stability)

## Key DB reference patterns in codebase

- Direct table access with raw strings:
  - `.from('...').select('...')`
- Wide `*` selects used heavily in mutation/read paths
- Legacy table/model overlap:
  - `venues` and `venues_old` both used in runtime code
- Mutable writes without centralized table guards:
  - `.insert`, `.update`, `.upsert` across feature modules

---

## 2) Type Drift Report

## Production baseline

- Production objects: `151` total
  - `89` base tables
  - `62` views

## Confirmed critical drift

- `requests.venue_id` is `text`
- `venues.id` is `uuid`
- `venues_old.id` is `text`

Meaning:
- `requests.venue_id` currently aligns with `venues_old.id`, not `venues.id`
- Any assumption that `requests.venue_id` references `venues` is unsafe

## Application-level drift examples fixed in this pass

- `src/app/api/requests/[id]/route.ts`
  - Removed `title` and `description` from `requests` select
  - Replaced with existing columns: `notes`, `internal_notes`
- `src/entities/venue/venueService.ts`
  - Switched to `venues_old` for `subcategory` and `supplier_id`
- `src/features/search/searchService.ts`
  - Switched venue search source to `venues_old` where selected columns exist
- `src/platform/requests/suppliers.ts`
  - Switched supplier/venue mapping reads/writes to `venues_old`

## Remaining drift risks

- `src/types.ts` still defines high-level `Venue`, `Request`, etc. with fields that do not map 1:1 to canonical production tables
- `v_service_catalog` appears in app code but was not discovered in captured production metadata snapshot

---

## 3) Query Safety Report (Refreshed)

From `supabase/query_audit.py` after fixes:

- Query rows scanned: `229`
- `any` usages found: `72`
- Manual DB-type-like interfaces/types: `92`

## Current high-priority query issues

- Unknown table: `waitlist_entries`
  - Found in `src/features/experiences/hooks/useWaitlist.ts` (multiple calls)
- Unknown table/view: `v_service_catalog`
  - Found in `src/hooks/useAdmin.ts`
- Broken column select: `experience_services.max_capacity`
  - Found in `src/lib/experiences.ts`

## Risk categories

- P0: unknown tables/views used at runtime in customer/admin paths
- P1: broken column selections on existing tables
- P2: broad `NO_SELECT` mutation paths (low immediate risk, weak compile-time narrowing)
- P3: scattered `any` usage causing model drift and runtime field assumptions

---

## 4) Safe Relationship Migration Plan

## Already added

- `supabase/migrations/20260528130000_add_bookings_relationships.sql`
  - Adds `NOT VALID` FKs:
    - `bookings.user_id -> profiles(id)`
    - `bookings.request_id -> requests(id)`
    - `bookings.venue_id -> venues(id)`

Rationale:
- Enforces integrity for new rows immediately
- Avoids full historical scan during constraint creation

## Next migration wave (recommended)

1. Validate existing `bookings` constraints in controlled window:
   - `VALIDATE CONSTRAINT bookings_user_id_fkey`
   - `VALIDATE CONSTRAINT bookings_request_id_fkey`
   - `VALIDATE CONSTRAINT bookings_venue_id_fkey`

2. Normalize request-to-venue relationship:
   - Option A (preferred long-term): migrate `requests.venue_id` to UUID and reference `venues(id)`
   - Option B (transitional): keep `requests.venue_id` as text and explicitly model as legacy `venues_old(id)`

3. Add explicit compatibility view (if needed) for transition:
   - A read model that maps old venue references into canonical venue data for API consumers

---

## 5) Canonical Entity Map

## Canonical DB entities (runtime-write safe)

- Core workflow:
  - `requests`, `quotes`, `payments`, `bookings`
- Identity:
  - `profiles`
- Venue domain (new model):
  - `venues`, `venue_categories`, `emirates`

## Legacy/compat entities still actively used

- `venues_old`
  - Contains fields not present on `venues` such as `subcategory`, `supplier_id`, `hero_image`, `area`

## Duplicate model hotspots

- Venue model split:
  - New normalized: `venues`
  - Legacy rich record: `venues_old`
- App/domain types vs DB row types:
  - `src/types.ts` interfaces blend UI and persistence concerns

## Recommendation

- Introduce explicit naming split in service layer:
  - `LegacyVenue` (from `venues_old`)
  - `CanonicalVenue` (from `venues`)
- Prevent direct table switching in feature code by routing through typed repositories

---

## 6) API Contract Audit

## Audited routes

- `src/app/api/bookings/hotel/route.ts`
- `src/app/api/payments/checkout/route.ts`
- `src/app/api/requests/[id]/route.ts`
- `src/app/api/submit-lead/route.ts`
- `src/app/api/track-event/route.ts`

## Findings

- `bookings/hotel`
  - Uses `bookings` with hotel-specific columns that exist in production
- `payments/checkout`
  - Contract is consistent with `quotes` + `payments` linkage
- `requests/[id]`
  - Previous invalid `title/description` projection fixed in this pass
- `submit-lead` and `track-event`
  - Contracts align with `leads` and `events` tables
  - Event metadata remains loosely typed (`z.record(z.any())`)

## Operational dependency checks

- Server routes depend on correct environment variables for admin client and Stripe
- Missing env vars lead to runtime failures (already guarded with explicit errors)

---

## 7) Typed Service-Layer Architecture (Incremental)

## Goal

Eliminate direct table-string drift and spread of schema assumptions by centralizing typed DB access.

## Proposed layering

1. Typed clients
- Do not parameterize global clients yet
- First harden generated `Database` shape compatibility (relations/views/unnamed columns)
- Introduce typed wrappers/repositories before flipping global generics

2. Table type aliases
- Add shared aliases:
  - `DbTables = Database['public']['Tables']`
  - `DbRow<T extends keyof DbTables>`
  - `DbInsert<T extends keyof DbTables>`
  - `DbUpdate<T extends keyof DbTables>`

3. Repositories (single table ownership)
- `src/lib/db/repositories/requestsRepo.ts`
- `src/lib/db/repositories/quotesRepo.ts`
- `src/lib/db/repositories/paymentsRepo.ts`
- `src/lib/db/repositories/venuesRepo.ts`
- `src/lib/db/repositories/legacyVenuesRepo.ts`

4. Service adapters
- Convert repository rows into UI/domain contracts
- Keep `src/types.ts` as product contract layer only

5. Route integration
- Move route handlers to repository + adapter calls
- Remove inline select strings from route files over time

## Rollout order

1. Request/quote/payment chain (`/api/requests/[id]`, `/api/payments/checkout`)
2. Venue search/read paths (`searchService`, venue entity modules)
3. Supplier-venue assignment paths
4. Lead/event tracking paths

---

## 8) Immediate Backlog (Execution)

1. Resolve `waitlist_entries` unknown table:
   - verify intended table or create migration if feature is valid
2. Resolve `v_service_catalog` unknown view:
   - either recreate view in production or switch admin metric source
3. Fix `experience_services.max_capacity` query:
   - align select with production table columns
4. Create shared `src/lib/db/types.ts` aliases and begin repository extraction
5. Run full validation:
   - `npm run typecheck`
   - `npm run build`
   - `npm run lint`
   - `npm test`

---

## 9) Change Log (This Pass)

- Attempted global Supabase client typing, then rolled back for stability (current generated shape caused `never` inference across query builders)
- Fixed invalid select fields in request details API
- Redirected legacy venue field usage to `venues_old` in:
  - venue entity service
  - search service venue query
  - supplier-venue assignment module
- Refreshed query audit report after fixes
- Added non-destructive bookings FK migration (`NOT VALID`)
