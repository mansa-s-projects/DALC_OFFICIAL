# DALC Next.js App Router Migration Plan

## Overview

This document outlines the migration from Vite + React Router to Next.js App Router.

---

## Current vs Target Architecture

### Current (Vite + React Router)

```
src/
├── app/
│   └── router.tsx          # All routes defined here
├── pages/
│   ├── Home.tsx            # Route components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Request.tsx
│   └── ...
├── components/             # Shared UI components
├── features/              # Domain-specific logic
│   ├── auth/
│   ├── transport/
│   └── ...
├── lib/                   # Service layer
└── store/                 # Zustand stores
```

### Target (Next.js App Router)

```
app/                          # Next.js App Router
├── layout.tsx               # Root layout with providers
├── page.tsx                 # Homepage (/)
├── not-found.tsx            # 404 page
├── error.tsx                # Error boundary
├── loading.tsx              # Loading UI
│
├── auth/
│   ├── login/
│   │   └── page.tsx         # /auth/login
│   └── register/
│       └── page.tsx         # /auth/register
│
├── requests/
│   ├── page.tsx             # /requests
│   ├── success/
│   │   └── page.tsx         # /requests/success
│   └── [id]/
│       └── page.tsx         # /requests/:id
│
├── my-requests/
│   └── page.tsx             # /my-requests
│
├── profile/
│   └── page.tsx             # /profile
│
├── transport/
│   ├── page.tsx             # /transport
│   ├── cars/
│   │   └── page.tsx         # /transport/cars
│   ├── yachts/
│   │   └── page.tsx         # /transport/yachts
│   └── [category]/
│       └── [slug]/
│           └── page.tsx     # /transport/:category/:slug
│
├── experiences/
│   ├── page.tsx             # /experiences
│   └── [subcategory]/
│       ├── page.tsx         # /experiences/:subcategory
│       └── [slug]/
│           └── page.tsx     # /experiences/:subcategory/:slug
│
├── nightlife/
│   ├── page.tsx             # /nightlife
│   ├── clubs/
│   │   └── page.tsx         # /nightlife/clubs
│   ├── beach-clubs/
│   │   └── page.tsx         # /nightlife/beach-clubs
│   └── restaurants/
│       └── page.tsx         # /nightlife/restaurants
│
├── venue/
│   └── [id]/
│       └── page.tsx         # /venue/:id
│
├── travel/
│   ├── page.tsx             # /travel
│   ├── flights/
│   │   └── page.tsx         # /travel/flights
│   ├── hotels/
│   │   └── page.tsx         # /travel/hotels
│   └── villas/
│       └── page.tsx         # /travel/villas
│
├── business/
│   ├── page.tsx             # /business
│   └── [subcategory]/
│       ├── page.tsx         # /business/:subcategory
│       └── [slug]/
│           └── page.tsx     # /business/:subcategory/:slug
│
├── concierge/
│   └── page.tsx             # /concierge
│
├── explore/
│   ├── page.tsx             # /explore
│   └── [filter]/
│       └── page.tsx         # /explore/:filter
│
├── move-to-dubai/
│   ├── page.tsx             # /move-to-dubai
│   ├── visa/
│   │   └── page.tsx         # /move-to-dubai/visa
│   └── relocation/
│       └── page.tsx         # /move-to-dubai/relocation
│
└── (admin)/                 # Route group (no URL segment)
    └── admin/
        ├── layout.tsx       # Admin layout with guards
        ├── page.tsx         # /admin (redirects to overview)
        ├── overview/
        │   └── page.tsx     # /admin/overview
        ├── requests/
        │   └── page.tsx     # /admin/requests
        ├── venues/
        │   ├── page.tsx     # /admin/venues
        │   ├── new/
        │   │   └── page.tsx # /admin/venues/new
        │   └── [id]/
        │       └── page.tsx # /admin/venues/:id
        └── suppliers/
            ├── page.tsx     # /admin/suppliers
            └── ...

components/                   # Shared UI components
├── ui/                      # Shadcn/UI primitives
├── layout/                  # Layout components (Navbar, Footer)
├── cards/                   # Card components
└── ...

features/                     # Domain-specific features
├── auth/
│   ├── components/          # Auth-specific components
│   ├── hooks/              # useAuth, useSession
│   └── lib/                # Auth utilities
├── transport/
│   ├── components/
│   ├── hooks/
│   └── lib/
├── requests/
├── experiences/
├── nightlife/
└── ...

lib/                         # Shared utilities
├── supabase.ts             # Supabase client
├── utils.ts                # Utility functions
└── motion.ts               # Animation variants

store/                       # Zustand stores
├── useUserStore.ts
├── useBookingStore.ts
└── ...

hooks/                       # Shared hooks
├── useUser.ts
├── useRequests.ts
└── ...

types/                       # TypeScript types
└── index.ts

middleware.ts                # Next.js middleware for auth guards
next.config.js               # Next.js configuration
```

---

## Route Mapping

| Old Route (React Router) | New Route (Next.js) | File Location |
|--------------------------|---------------------|---------------|
| `/` | `/` | `app/page.tsx` |
| `/login` | `/auth/login` | `app/auth/login/page.tsx` |
| `/register` | `/auth/register` | `app/auth/register/page.tsx` |
| `/onboarding` | `/onboarding` | `app/onboarding/page.tsx` |
| `/request` | `/requests` | `app/requests/page.tsx` |
| `/request/success` | `/requests/success` | `app/requests/success/page.tsx` |
| `/my-requests` | `/my-requests` | `app/my-requests/page.tsx` |
| `/my-requests/:id` | `/requests/[id]` | `app/requests/[id]/page.tsx` |
| `/profile` | `/profile` | `app/profile/page.tsx` |
| `/transport` | `/transport` | `app/transport/page.tsx` |
| `/transport/cars` | `/transport/cars` | `app/transport/cars/page.tsx` |
| `/transport/yachts` | `/transport/yachts` | `app/transport/yachts/page.tsx` |
| `/transport/:category/:slug` | `/transport/[category]/[slug]` | `app/transport/[category]/[slug]/page.tsx` |
| `/experiences` | `/experiences` | `app/experiences/page.tsx` |
| `/experiences/:subcategory` | `/experiences/[subcategory]` | `app/experiences/[subcategory]/page.tsx` |
| `/nightlife` | `/nightlife` | `app/nightlife/page.tsx` |
| `/nightlife/clubs` | `/nightlife/clubs` | `app/nightlife/clubs/page.tsx` |
| `/venue/:id` | `/venue/[id]` | `app/venue/[id]/page.tsx` |
| `/business` | `/business` | `app/business/page.tsx` |
| `/concierge` | `/concierge` | `app/concierge/page.tsx` |
| `/explore` | `/explore` | `app/explore/page.tsx` |
| `/admin/*` | `/admin/*` | `app/(admin)/admin/**/page.tsx` |

---

## Key Changes Required

### 1. Navigation

**React Router:**
```tsx
import { Link, useNavigate, useParams } from 'react-router-dom';

// Link
<Link to="/login">Login</Link>

// Navigation
const navigate = useNavigate();
navigate('/dashboard');

// Params
const { id } = useParams();
```

**Next.js:**
```tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Link
<Link href="/auth/login">Login</Link>

// Navigation
const router = useRouter();
router.push('/dashboard');

// Params (received as prop)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
}
```

### 2. Data Fetching

**React Router (client-side):**
```tsx
import { useQuery } from '@tanstack/react-query';

function Page() {
  const { data } = useQuery({ queryKey: ['cars'], queryFn: fetchCars });
  return <div>{data}</div>;
}
```

**Next.js (server-side where possible):**
```tsx
// Server component (default)
async function Page() {
  const cars = await fetchCars(); // Fetched on server
  return <div>{cars}</div>;
}

// Client component (when needed)
'use client';
import { useQuery } from '@tanstack/react-query';

function Page() {
  const { data } = useQuery({ queryKey: ['cars'], queryFn: fetchCars });
  return <div>{data}</div>;
}
```

### 3. Auth Guards

**React Router:**
```tsx
<Route path="/profile" element={
  <AuthGuard><ProfilePage /></AuthGuard>
} />
```

**Next.js:**
```tsx
// Option 1: Middleware (middleware.ts)
export function middleware(request: NextRequest) {
  const token = request.cookies.get('supabase-auth-token');
  if (!token && request.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Option 2: Layout check
// app/profile/layout.tsx
export default async function ProfileLayout({ children }) {
  const session = await getSession(); // Server-side auth check
  if (!session) redirect('/auth/login');
  return <>{children}</>;
}
```

### 4. Layouts

**React Router (manual):**
```tsx
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
```

**Next.js (file-based):**
```tsx
// app/layout.tsx - applies to all routes
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

// app/(admin)/admin/layout.tsx - applies only to admin routes
export default function AdminLayout({ children }) {
  return (
    <AdminSidebar>
      {children}
    </AdminSidebar>
  );
}
```

---

## Migration Strategy

### Phase 1: Setup (Parallel Development)
1. Install Next.js alongside existing Vite setup
2. Create new `app/` directory structure
3. Set up shared components and features
4. Configure build to output static files

### Phase 2: Route Migration (Incremental)
1. Migrate auth routes first (low complexity)
2. Migrate static pages (home, explore)
3. Migrate dynamic routes with params
4. Migrate admin routes last (highest complexity)

### Phase 3: Cleanup
1. Remove React Router dependencies
2. Delete `src/pages/` and `src/app/router.tsx`
3. Update documentation
4. Deploy and test

---

## Critical Considerations

### 1. Client vs Server Components
- Use Server Components by default for data fetching
- Use Client Components (`'use client'`) for:
  - Interactivity (buttons, forms)
  - Browser APIs (localStorage, window)
  - React hooks that need browser context

### 2. Static Export
Next.js will be configured for static export:
```js
// next.config.js
module.exports = {
  output: 'export',
  distDir: 'dist',
}
```

This means:
- All routes must be statically generate-able at build time
- Dynamic routes need `generateStaticParams()`
- No server-side runtime

### 3. Auth with Static Export
Since we're using static export, auth guards will be:
- Client-side checks in layouts/components
- Middleware won't work (requires server)
- Use client-side redirects with `useRouter`

### 4. Data Fetching Patterns
```tsx
// For static export, data must be fetched:
// 1. At build time (generateStaticParams + fetch)
// 2. Client-side (useEffect + useQuery)

// Option 1: Build-time data (for static content)
export async function generateStaticParams() {
  const cars = await fetchCars();
  return cars.map((car) => ({ slug: car.slug }));
}

// Option 2: Client-side data (for dynamic/user-specific content)
'use client';
export default function Page() {
  const { data } = useQuery({ queryKey: ['user'], queryFn: fetchUser });
}
```

---

## File Structure Diagram

```mermaid
graph TD
    A[app/layout.tsx] --> B[app/page.tsx]
    A --> C[app/auth/login/page.tsx]
    A --> D[app/auth/register/page.tsx]
    A --> E[app/requests/page.tsx]
    A --> F[app/requests/success/page.tsx]
    A --> G[app/requests/[id]/page.tsx]
    A --> H[app/transport/page.tsx]
    A --> I[app/transport/cars/page.tsx]
    A --> J[app/experiences/page.tsx]
    A --> K[app/nightlife/page.tsx]
    A --> L[app/concierge/page.tsx]
    A --> M[app/business/page.tsx]
    A --> N[app/profile/page.tsx]
    
    O[components/ui/] --> A
    P[components/layout/] --> A
    Q[features/auth/] --> C
    R[features/transport/] --> I
    S[lib/supabase.ts] --> Q
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style O fill:#bbf,stroke:#333
    style P fill:#bbf,stroke:#333
    style Q fill:#bfb,stroke:#333
    style R fill:#bfb,stroke:#333
```

---

## Next Steps

1. Review and approve this migration plan
2. Switch to Code mode to begin implementation
3. Start with Phase 1: Project Setup
4. Proceed incrementally through each phase