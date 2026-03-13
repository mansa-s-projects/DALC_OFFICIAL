# Dubai À La Carte (DALC) — Platform Overview

## What is DALC?

Dubai À La Carte is a luxury lifestyle marketplace and concierge platform built for high-net-worth individuals relocating to, living in, or visiting Dubai. The platform unifies curated discovery, frictionless booking, and white-glove concierge handling across every dimension of life in Dubai — from landing at the airport to incorporating a company to booking a superyacht.

## Platform Mission

> **"To be the single operating system for life in Dubai — from landing to living."**

DALC removes the fragmentation of luxury services in Dubai by creating one intelligent platform that understands its users' stage of life in the city and surfaces what they need next.

---

## 7 Core Pillars

| # | Pillar | Route | Core Value |
|---|--------|-------|-----------|
| 1 | **Move to Dubai** | `/move-to-dubai` | Guided relocation: visa, company, banking, school, home |
| 2 | **Experiences** | `/experiences` | Curated activities: water, desert, sky, culture, wellness, dining |
| 3 | **Nightlife** | `/nightlife` | Dubai's most exclusive clubs, lounges, and late-night entertainment |
| 4 | **Stays** | `/stays` | Luxury hotels, private villas, long-term residences |
| 5 | **Transport** | `/transport` | Exotic cars, yacht charters, private jets |
| 6 | **Business Setup** | `/business` | Company formation, licensing, banking, tax, residency investment |
| 7 | **Concierge** | `/concierge` | White-glove request handling across all pillars |

> **Strategic Priority:** Move to Dubai is always Pillar #1. It is the platform's core differentiator and primary acquisition channel.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + TypeScript | Strict mode, functional components |
| Styling | Tailwind CSS | Custom luxury color tokens |
| Animation | Framer Motion | Hero carousels, scroll reveals, hover lifts |
| State | Zustand (`useAppStore`) | Auth session, profile, UI state |
| Data Fetching | React Query (`@tanstack/react-query`) | Caching, loading states |
| Backend | Supabase | PostgreSQL + Auth + Storage + Realtime |
| Security | Row Level Security (RLS) | Enabled on all tables |
| Build | Vite + TypeScript | ESM-native, fast refresh |

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `bg-black` | `#0a0a0a` | Primary background |
| Gold | `#D4AF37` | Accent, CTAs, highlights |
| White | `#ffffff` | Text, icons |
| Gray | `#1a1a1a` / `#333` | Cards, borders |

**Page Template Pattern:**
Every vertical hub page follows the same structure:
1. **Hero** — full-screen background, tagline, dual CTA buttons
2. **Stats Bar** — 3–4 platform credibility metrics
3. **Category Cards** — grid linking to subcategory pages
4. **Featured Grid** — data-driven cards from hooks/Supabase
5. **Value Section** — features, how-it-works, or testimonials
6. **Final CTA** — concierge / booking conversion

---

## Implementation Status (March 2026)

| Area | Status | Notes |
|------|--------|-------|
| All 7 hub pages | ✅ Complete | Each pillar has a fully designed hub |
| All subcategory list pages | ✅ Complete | Hotels, YachtsList, SubcategoryList, etc. |
| All detail pages | ✅ Complete | PropertyDetail, ExperienceDetail, TransportDetail |
| Admin dashboard | ✅ Complete | Venues, Suppliers, Requests, Overview |
| Auth pages | ✅ Complete | Login, Register, Onboarding |
| Supabase schema | ✅ Complete | 1 main + 5 vertical migration files |
| RLS policies | ✅ Complete | All tables secured |
| Mock data layer | ✅ Active | `isMockMode = true` across all lib files |
| Live Supabase connection | 🔄 Partial | venues + requests partially wired |
| Auth flow (full) | ⏳ Pending | `AuthGuard` exists, profile creation partial |
| Concierge hub page | ⏳ Pending | No `/concierge` hub built yet |
| Supplier frontend | ⏳ Pending | No supplier-facing UI |
| Admin analytics | ⏳ Pending | Overview metrics are static |
| Multi-city expansion | 🗺️ Planned | Architecture ready, not implemented |

---

## Key Directories

```
src/
  app/router.tsx          ← All routes (168 lines)
  App.tsx                 ← Root: QueryClient + BrowserRouter + AuthListener
  store/useAppStore.ts    ← Global Zustand store
  pages/                  ← All page components (49 files across 7 sub-folders)
  components/             ← Reusable UI components
  types/                  ← TypeScript types per vertical
  lib/                    ← Service functions per vertical (mock + Supabase)
  hooks/                  ← React Query hooks per vertical
  data/                   ← Static mock data files
supabase/
  schema.sql              ← Core tables: profiles, suppliers, venues, requests
  migrations/             ← 5 vertical-specific schemas
docs/                     ← This documentation system
```

---

## Related Documentation

- [Platform Pillars](01-platform-pillars.md) — Full pillar definitions
- [Platform Architecture](architecture/platform-architecture.md) — System architecture
- [Folder Structure](architecture/folder-structure.md) — Current vs proposed structure
- [Routing Structure](architecture/routing-structure.md) — All routes defined
- [Database Schema](database/database-schema.md) — All tables and relationships
- [Future Expansion](platform/future-expansion.md) — Multi-city roadmap
