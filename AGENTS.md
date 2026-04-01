# AGENTS.md — Dubai À La Carte

> Reference for AI agents working on this codebase.

---

## Project Overview

**Dubai À La Carte (DALC)** — a luxury concierge platform built with Next.js 16, React 19, Supabase, and Tailwind CSS. Covers transport, stays, experiences, nightlife, business services, relocation, and concierge requests.

**Tech Stack:**

- Next.js 16.2.1 (App Router, Turbopack)
- React 19 + TypeScript 5.9 (strict mode)
- Supabase (auth + DB + realtime)
- Tailwind CSS 3.4 + shadcn/ui + Radix UI
- Zustand (state), TanStack Query (server state)
- GSAP + Motion (animations)
- Mapbox GL + Google Maps
- Zod (validation)

---

## Environment & Debug (2026-04-01)

| Check          | Result                                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Node**       | v25.8.2                                                                                                              |
| **npm**        | 11.11.1                                                                                                              |
| **TypeScript** | ✅ Passes (`npx tsc --noEmit` — no errors)                                                                           |
| **Build**      | ✅ Passes (`npm run build` — 92 routes compiled)                                                                     |
| **Lint**       | ⚠️ `npm run lint` broken on Next.js 16 (tries to open "lint" directory). Use `npx next lint` directly or ESLint CLI. |
| **Git**        | Clean, on `master`, up to date with origin                                                                           |

### Verified Commands

```bash
npx tsc --noEmit          # TypeScript type check
npm run build              # Full production build (Turbopack)
npx next lint              # Lint (do NOT use npm run lint)
npm run dev                # Dev server on 0.0.0.0:3000
```

---

## Project Structure

```
src/
├── app/            # Next.js App Router pages & API routes
│   ├── admin/      # Admin dashboard pages
│   ├── api/        # API routes (sales-ops, submit-lead, track-event)
│   ├── auth/       # Login / register pages
│   ├── providers/  # Context providers (NextProviders)
│   └── [vertical]/ # Page routes per vertical (transport, stays, etc.)
├── components/     # Shared UI components
├── data/           # Static JSON data (yachts, etc.)
├── entities/       # Domain entity definitions
├── features/       # Feature modules (vertical-organized)
│   ├── auth/
│   ├── business/
│   ├── concierge/
│   ├── experiences/
│   ├── explore/
│   ├── home/
│   ├── live-map/
│   ├── move-to-dubai/
│   ├── nightlife/
│   ├── notifications/
│   ├── search/
│   ├── stays/
│   ├── transport/
│   └── travel/
├── hooks/          # Custom React hooks
├── lib/            # Core services & utilities
│   ├── supabase.ts          # Client-side Supabase
│   ├── supabase-admin.ts    # Server-side Supabase (service role)
│   ├── auth.ts              # Auth helpers
│   ├── router.tsx           # react-router-dom compat shim
│   └── [vertical].ts        # Domain logic per vertical
├── shared/         # Shared cross-cutting code
├── store/          # Zustand stores (useAppStore.ts)
├── styles/         # Additional stylesheets
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

### Key Config Files

- `next.config.js` — distDir: `dist`, react-router-dom compat alias, unoptimized images
- `tailwind.config.js` — DALC design system with `cipher.*` color tokens, luxury gold palette
- `tsconfig.json` — strict mode, `@/*` → `./src/*`, react-router-dom → `./src/lib/router`
- `.env.local` — Supabase keys, Mapbox tokens, OpenRouter API key

---

## Design System

**DALC Cipher Palette** (dark luxury warm tones):

- Backgrounds: `cipher.void` (#080706) → `cipher.card2` (#242118)
- Golds: `cipher.gold` (#C9A84C) → `cipher.gold-trace` (#221808)
- Beiges: `cipher.beige` (#F5EDD8) → `cipher.beige-trace` (#2A2518)
- Borders: `cipher.rim` / `cipher.rim2` / `cipher.rim3` (beige-tinted)
- Text: `cipher.white` (warm cream) / `cipher.muted` / `cipher.dim`

**Fonts:** Cormorant Garamond (display), Outfit (body), DM Mono (mono)

**Component Library:** shadcn/ui + Radix primitives, Tailwind utility classes

---

## Conventions

- **Path alias:** `@/*` maps to `./src/*`
- **react-router-dom** is shimmed via `src/lib/router.tsx` — use Next.js Link/router in new code
- **State management:** Zustand for global, TanStack Query for server state
- **Styling:** Tailwind classes with `cipher.*` design tokens; use `cn()` from `@/lib/utils`
- **Supabase:** Client-side via `src/lib/supabase.ts`, server-side via `src/lib/supabase-admin.ts`
- **No comments** in code unless explicitly requested
- **Strict TypeScript** — `noEmit: true`, all types must resolve

---

## Available Skills

Load via the Skill tool when a task matches:

| Skill                            | Use When                                      |
| -------------------------------- | --------------------------------------------- |
| `frontend-design`                | Building web components/pages                 |
| `cipher-design`                  | Applying DALC dark luxury design system       |
| `ckm:ui-styling`                 | shadcn/ui components, Tailwind, accessibility |
| `banner-design`                  | Hero banners, promotional sections            |
| `transport-vertical-architect`   | Transport vertical (cars, yachts, jets)       |
| `stays-vertical-architect`       | Stays vertical (hotels, villas, residences)   |
| `experiences-vertical-architect` | Experiences vertical                          |
| `nightlife-vertical-architect`   | Nightlife vertical (venues)                   |
| `business-vertical-architect`    | Business services vertical                    |
| `relocation-vertical-architect`  | Move to Dubai vertical                        |
| `concierge-vertical-architect`   | Concierge request system                      |

---

## Running Diagnostics

Always run these after making code changes:

```bash
npx tsc --noEmit     # Type check
npm run build         # Full build verification
npx next lint         # Lint check
```

Do NOT use `npm run lint` — it is broken on Next.js 16 (resolves to a directory lookup instead of the lint command).

---

## Environment Variables

Required in `.env.local` (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN` / `NEXT_PUBLIC_MAPBOX_STYLE_URL`
- `OPENROUTER_API_KEY` (server-side AI)
- `AI_*_MODEL` — model identifiers for AI features
