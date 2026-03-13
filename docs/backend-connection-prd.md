# Backend Connection PRD (Immediate Fix)

## Implementation Status (Current Snapshot)

- `Explore.tsx`: Connected to Supabase via React Query, category resolved from URL/search/all fallback, loading skeleton and error state added.
- `Request.tsx`: Submit flow connected to Supabase mutation, pending button state and toast-style error feedback added.
- New route: `/request/success` added with `src/pages/RequestSuccess.tsx`.
- Hook layer created under `src/hooks/`: `useVenues`, `useVenue`, `useRequests`, `useUser`.
- Shared UI states added: `src/components/skeletons/*` and `src/components/error/*`.
- Remaining critical work: auth pages/guard and migrating `VenueDetail.tsx` to live Supabase venue data.

## Objective
Connect the existing polished frontend to Supabase so core user flows are functional, persistent, and resilient.

## Scope
- Data fetching for venues from Supabase
- Request form persistence
- URL-driven category browsing
- Baseline auth flow
- Reusable data hooks
- Skeleton loading states
- Shared error handling

## Non-Goals (This Phase)
- Full admin analytics backend
- Payment processing
- Advanced role management
- Production monitoring stack beyond basic client-side logging hooks

## Workstreams

### P0: Explore Data Integration
- Update `src/pages/Explore.tsx` to use `useParams` category.
- Replace `mockData` listing with Supabase `venues` query via React Query.
- Add loading and error rendering states.
- Keep search/filter UX behavior while sourcing from backend data.

Acceptance criteria:
- Visiting `/explore` and `/explore/:category` shows live data.
- Page renders a skeleton while loading.
- Error state appears for failed query with retry action.

### P0: Reusable Hook Layer
Create `src/hooks/`:
- `useVenues.ts`: list query with filters and `staleTime: 300000`.
- `useVenue.ts`: single venue by ID.
- `useRequests.ts`: create/read/update/delete request helpers with optimistic updates.
- `useUser.ts`: Supabase session + user profile query.

Acceptance criteria:
- Pages consume hooks, not direct query logic duplication.
- Query keys are stable and filter-aware.

### P0: Request Submission Persistence
- Refactor `src/pages/Request.tsx` submit flow to `useMutation`.
- Insert payload into `requests` table.
- Show pending state while mutation is in-flight.
- Redirect to success confirmation on completion.
- Display failure toast and preserve form inputs on error.

Acceptance criteria:
- A successful submit creates a row in Supabase.
- Duplicate submit while loading is blocked.

### P0: URL Param and Title Correctness
- Ensure route behavior in `src/app/router.tsx` for `/explore/:category`.
- Resolve active category in `Explore.tsx` priority order:
  1. route param
  2. query/search param
  3. `'all'`
- Update document title by selected category.

Acceptance criteria:
- Direct URL navigation to a category opens correct filtered data.
- Browser title reflects category.

### P0: Auth Baseline
- Implement login flow (magic link and/or Google OAuth).
- Add application and onboarding pages.
- Add `src/components/auth/ProtectedRoute.tsx`.

Acceptance criteria:
- Protected pages redirect unauthenticated users to login.
- Authenticated users can proceed through application/onboarding.

### P1: Skeleton Components
Create `src/components/skeletons/`:
- `VenueCardSkeleton.tsx`
- `VenueGridSkeleton.tsx`
- `RequestFormSkeleton.tsx`

Acceptance criteria:
- Loading transitions match existing visual style.

### P1: Error Handling Components
Create `src/components/error/`:
- `ErrorState.tsx`
- `ErrorBoundary.tsx`

Acceptance criteria:
- Query and render failures have user-safe fallback UI.
- Retry paths are available for recoverable errors.

## Data Dependencies
Expected Supabase tables:
- `venues`
- `requests`
- `users`
- `applications`

Required env vars:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Risks
- Current `.env.local` is Gemini-only and missing Supabase vars.
- Existing mock-only assumptions in UI can cause type mismatches.
- Auth route structure in prompt assumes Next.js style; codebase is React Router.

## Delivery Sequence
1. Env + Supabase connectivity validation
2. Hook layer (`useVenues`, `useVenue`)
3. Explore migration to backend
4. Request mutation integration
5. Skeletons + Error components
6. Auth pages + ProtectedRoute
7. Cleanup of mock fallbacks and QA pass
