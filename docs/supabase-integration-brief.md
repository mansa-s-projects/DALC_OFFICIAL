# Dubai A La Carte Supabase Integration Brief

You are a senior full-stack developer connecting the Dubai A La Carte frontend to Supabase backend.

## CURRENT STATE
- React app with polished UI, Framer Motion, Tailwind
- Supabase client exists but unused
- React Query provider initialized but no queries
- All data is mock (`mockData.ts`)
- Forms do not persist
- URL params ignored
- Auth is "Coming Soon"

## YOUR TASK: Make the app actually work

### 1. CONNECT EXPLORE PAGE TO SUPABASE (Priority: P0)

File: `src/pages/Explore.tsx`

Requirements:
- Read category from URL params (`useParams`)
- Fetch venues from Supabase using React Query
- Replace `mockData` with real data
- Handle loading states with skeleton screens
- Handle errors gracefully

Code pattern:
```typescript
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function Explore() {
  const { category } = useParams();

  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['venues', category],
    queryFn: async () => {
      let query = supabase.from('venues').select('*');
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <VenueSkeletonGrid />;
  if (error) return <ErrorState message={error.message} />;

  return <VenueGrid venues={venues} />;
}
```

### 2. CREATE REUSABLE DATA HOOKS (Priority: P0)

Create files in `src/hooks/`:

`useVenues.ts`:
- Accepts filters: `category`, `priceRange`, `location`
- Returns venues with React Query caching
- 5-minute stale time

`useVenue.ts`:
- Fetches single venue by ID
- Used in `VenueDetail.tsx`

`useRequests.ts`:
- CRUD operations for user requests
- Optimistic updates

`useUser.ts`:
- Current user from Supabase Auth
- Profile data from `users` table

### 3. CONNECT REQUEST FORM TO SUPABASE (Priority: P0)

File: `src/pages/Request.tsx`

Requirements:
- Replace local state submit flow with `useMutation`
- Submit to `supabase.from('requests').insert()`
- Show loading state during submission
- Redirect to success page on complete
- Handle errors with toast notification

### 4. FIX URL PARAMS (Priority: P0)

Update `src/app/router.tsx`:
- Ensure `/explore/:category` route passes params correctly
- Handle category slugs from `types.ts` union

Update `src/pages/Explore.tsx`:
- Read category param first
- Fallback to search params
- Fallback to `'all'`
- Update document title based on category

### 5. IMPLEMENT AUTH FLOW (Priority: P0)

Create auth pages and wrapper:

- `src/app/(auth)/login/page.tsx`
  - Email magic link form OR Google OAuth button
  - Use Supabase Auth UI or custom UI

- `src/app/(auth)/application/page.tsx`
  - Multi-step qualification form
  - Store in `applications` table
  - Initial status: `PENDING`

- `src/app/(auth)/onboarding/page.tsx`
  - Post-approval document upload
  - Preferences selection
  - Redirect to Command Center

- `src/components/auth/ProtectedRoute.tsx`
  - Checks Supabase session
  - Redirects to login if unauthenticated

### 6. SKELETON COMPONENTS (Priority: P1)

Create `src/components/skeletons/`:

`VenueCardSkeleton.tsx`:
- Matches `VenueCard` dimensions
- Animated pulse background
- Gold and gray color scheme

`VenueGridSkeleton.tsx`:
- 6-8 skeleton cards
- Responsive grid layout

`RequestFormSkeleton.tsx`:
- Form layout with pulsing inputs

### 7. ERROR HANDLING (Priority: P1)

Create `src/components/error/`:

`ErrorState.tsx`:
- Props: `message`, `retry` callback
- Warning icon, gold text, retry button

`ErrorBoundary.tsx`:
- Catches React render errors
- Shows fallback UI
- Logs to error tracking

## Implementation Note

The current project uses Vite + React Router, not Next.js app routing. If needed, map `src/app/(auth)/*/page.tsx` paths to equivalent route components under `src/pages/` and register them in `src/app/router.tsx`.
