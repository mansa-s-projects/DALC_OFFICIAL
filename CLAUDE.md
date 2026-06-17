# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server on 0.0.0.0:3000 (Turbopack)
npm run build        # Production build (outputs to dist/)
npx tsc --noEmit     # TypeScript type check
npm run lint         # Lint via ESLint CLI (`next lint` is not available on Next.js 16)
npx vitest           # Unit tests (Vitest + Testing Library + jsdom)
npx playwright test  # E2E tests (requires running dev server)
```

Always run `npx tsc --noEmit` and `npm run build` after code changes to verify correctness.

## Architecture

**Dubai À La Carte (DALC)** — luxury concierge platform. Next.js 16 App Router, React 19, TypeScript strict mode, Supabase (auth + DB + realtime), Tailwind CSS with custom `cipher.*` design tokens.

### Vertical Structure

The platform is organized into **service verticals**, each with its own feature module:

```
src/features/          # Feature modules per vertical
src/app/[vertical]/   # App Router pages for that vertical
src/lib/[vertical].ts  # Domain logic / service layer
src/store/[vertical].ts # Zustand slice for that vertical
src/entities/          # Domain entities by type (booking, experience, request, supplier, user, venue)
src/shared/            # Cross-vertical shared components, hooks, utilities
src/data/[vertical]/   # Static JSON datasets (cars, yachts, venues, experiences)
src/explore/           # Explore feature (map, location cards, drawer) — standalone sub-app
```

Verticals: `transport` (cars, yachts, jets), `stays`, `experiences`, `nightlife`, `business`, `concierge`, `move-to-dubai`, `travel`, `explore`, `search`

### Key Architecture Decisions

- **`react-router-dom` is shimmed** via `src/lib/router.tsx` — the tsconfig and webpack alias both redirect imports to this shim. Use Next.js `Link`/`useRouter` in new code.
- **Build output** goes to `dist/` (not `.next/`) — set in `next.config.js`.
- **`src/lib/supabase.ts`** — client-side Supabase (anon key). **`src/lib/supabase-admin.ts`** — server-side only (service role key, never ship to client).
- **Global state:** Zustand (`src/store/useAppStore.ts`), server state via TanStack Query (staleTime 60s).
- **Providers:** `NextProviders` wraps QueryClient + ThemeProvider (forced dark) + AuthListener + SearchModal.
- **Path alias:** `@/*` → `src/*`
- **`src/lib/supabase-query.ts`** — `queryPublished<T>(config)` abstraction for filtered/paginated Supabase queries (supports `eq`, `gte`, `lte`, `ilike` operators; defaults to `status = 'published'`).
- **`src/lib/motion.ts`** — shared Framer Motion variant presets (`fadeInUp`, `staggerContainer`, `cardReveal`, `cardHover`, `feedItem`, `trendingPulse`, etc.). Use these before defining custom variants.

### Middleware & RBAC

`middleware.ts` (root) enforces RBAC on `/admin` and `/api/sales-ops/*` via the `dalc_role` cookie and `x-user-role` header. Roles: `admin`, `sales_manager`, `sales_agent`, `viewer` — permission matrix in `src/lib/rbac.ts` (actions: `view_leads`, `edit_leads`, `assign_leads`, `change_status`, `manage_tasks`, `view_reports`, `manage_users`).

### Intent / Concierge System

`src/lib/intentRouter.ts` routes AI-classified user intent (`relocation`, `business_setup`, `lifestyle`) to flows or `CREATE_REQUEST` based on `complexity_score` (≥4 → `CREATE_REQUEST`, <4 → guided flow). The `/api/dalc` route handles AI intent classification via OpenRouter.

### Sales Ops Layer

`src/app/api/sales-ops/` exposes a command-center, dashboard, and workers. Supporting libs: `lead-automation.ts`, `lead-commands.ts`, `lead-enrichment.ts`, `crm-sync.ts`, `notification-engine.ts`, `whatsapp-automation.ts`, `attribution-models.ts`, `self-optimization.ts`, `experimentation.ts`.

### Admin

`src/app/admin/` pages use server-side Supabase and RBAC from `src/lib/rbac.ts`. Admin UI source lives in `src/admin/pages/` (forms + list views for all verticals). `src/hooks/useAdmin.ts` provides `useAdminStats()` querying counts via `v_service_catalog` / `v_booking_sync` views.

## Design System

**Cipher Palette** (dark luxury warm tones) — all color tokens prefixed `cipher.*`:
- Backgrounds: `cipher.void` → `cipher.card2`
- Golds: `cipher.gold` / `cipher.gold-trace`
- Beiges: `cipher.beige` / `cipher.beige-trace`
- Borders: `cipher.rim` / `cipher.rim2` / `cipher.rim3`
- Text: `cipher.white` / `cipher.muted` / `cipher.dim`

**Fonts:** `--font-display` (Cormorant Garamond), `--font-body` (Outfit), `--font-mono` (DM Mono)

Use `cn()` from `@/lib/utils` for conditional class merging.

## Conventions

- No comments in code unless explicitly requested
- TypeScript strict mode — no `any`, all types must resolve
- New UI components use shadcn/ui + Radix primitives with cipher tokens
- Images: `next/image` with `unoptimized: true` (set in next.config.js)

## Agent Skills

Specialized skills in `.agents/skills/` define namespace ownership for each vertical. When working on a vertical, load the matching skill via the Skill tool (e.g. `transport-vertical-architect`). Each skill owns its routes, file paths, and DB migrations — do not modify another vertical's namespace.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN` / `NEXT_PUBLIC_MAPBOX_STYLE_URL`
- `OPENROUTER_API_KEY`
- `AI_*_MODEL` identifiers
