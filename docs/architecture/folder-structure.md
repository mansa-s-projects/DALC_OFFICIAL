# DALC Folder Structure

## Current Structure

The codebase uses a **feature-slice** architecture. Each of the 7 pillars lives in `src/features/{vertical}/` with pages, hooks, components, and types co-located. Shared infrastructure stays in `src/lib/`, `src/components/`, and `src/hooks/` (the hook and type shims in those directories re-export from the feature slices for backwards compatibility with shared components that haven't been migrated).

### Directory Tree

```
src/
├── App.tsx
├── types.ts                          ← Legacy flat types (kept for type compat)
├── app/
│   └── router.tsx                    ← All 50+ routes
├── components/                       ← Shared UI components (not vertical-specific)
│   ├── auth/
│   │   ├── AuthGuard.tsx
│   │   └── AdminGuard.tsx
│   ├── business/                     ← Shared business UI (also at features/business/components/)
│   │   ├── ComplianceChecklist.tsx
│   │   ├── ConsultationScheduler.tsx
│   │   ├── DocumentRequirements.tsx
│   │   └── ProcessTimeline.tsx
│   ├── cards/
│   ├── error/
│   ├── experiences/
│   ├── feed/
│   ├── map/
│   ├── navigation/
│   ├── orbit/
│   ├── relocation/
│   ├── requests/
│   ├── skeletons/
│   ├── stays/
│   ├── transport/
│   └── trending/
├── data/
│   ├── mockData.ts
│   ├── skillsMapping.ts
│   └── transport/
├── features/                         ← Feature slices (primary code location)
│   ├── move-to-dubai/                   ← Pillar 1
│   │   ├── pages/
│   │   │   ├── MoveToDubai.tsx
│   │   │   ├── Intake.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Documents.tsx
│   │   │   └── CostEstimator.tsx
│   │   ├── hooks/
│   │   │   ├── useRelocation.ts
│   │   │   ├── useRelocationDocs.ts
│   │   │   └── useRelocationCost.ts
│   │   ├── components/
│   │   └── types.ts
│   ├── experiences/                     ← Pillar 2
│   │   ├── pages/
│   │   │   ├── ExperiencesHub.tsx
│   │   │   ├── SubcategoryList.tsx
│   │   │   └── ExperienceDetail.tsx
│   │   ├── hooks/
│   │   │   ├── useExperiences.ts
│   │   │   └── useExperienceBooking.ts
│   │   ├── components/
│   │   └── types.ts
│   ├── nightlife/                       ← Pillar 3
│   │   ├── pages/
│   │   │   ├── NightlifeHub.tsx
│   │   │   ├── NightClubs.tsx
│   │   │   ├── BeachClubs.tsx
│   │   │   ├── Restaurants.tsx
│   │   │   ├── DiningEntertainment.tsx
│   │   │   └── VenueDetail.tsx
│   │   ├── hooks/
│   │   │   ├── useVenues.ts
│   │   │   └── useVenue.ts
│   │   └── components/
│   ├── stays/                           ← Pillar 4
│   │   ├── pages/
│   │   │   ├── StaysHub.tsx
│   │   │   ├── HotelsList.tsx
│   │   │   ├── VillasList.tsx
│   │   │   ├── ResidencesList.tsx
│   │   │   └── PropertyDetail.tsx
│   │   ├── hooks/
│   │   │   ├── useStays.ts
│   │   │   └── useStaysBooking.ts
│   │   ├── components/
│   │   └── types.ts
│   ├── transport/                       ← Pillar 5
│   │   ├── pages/
│   │   │   ├── TransportHub.tsx
│   │   │   ├── CarsList.tsx
│   │   │   ├── YachtsList.tsx
│   │   │   ├── JetsList.tsx
│   │   │   └── TransportDetail.tsx
│   │   ├── hooks/
│   │   │   ├── useTransport.ts
│   │   │   └── useTransportBooking.ts
│   │   ├── components/
│   │   └── types.ts
│   ├── business/                        ← Pillar 6
│   │   ├── pages/
│   │   │   ├── BusinessHub.tsx
│   │   │   ├── SubcategoryList.tsx
│   │   │   ├── ServiceDetail.tsx
│   │   │   └── ConsultationPage.tsx
│   │   ├── hooks/
│   │   │   ├── useBusiness.ts
│   │   │   ├── useBusinessBooking.ts
│   │   │   └── useConsultation.ts
│   │   ├── components/
│   │   └── types.ts
│   └── concierge/                       ← Pillar 7
│       ├── pages/                       ← (empty; hub + request form live in src/pages/concierge/)
│       ├── hooks/
│       │   └── useConcierge.ts
│       ├── components/
│       ├── api.ts
│       └── types.ts
├── hooks/                            ← Re-export shims (point to features/)
│   ├── useAdmin.ts
│   ├── useBusiness.ts                   → features/business/hooks/useBusiness
│   ├── useBusinessBooking.ts            → features/business/hooks/useBusinessBooking
│   ├── useConsultation.ts               → features/business/hooks/useConsultation
│   ├── useExperienceBooking.ts          → features/experiences/hooks/useExperienceBooking
│   ├── useExperiences.ts                → features/experiences/hooks/useExperiences
│   ├── useRelocation.ts                 → features/move-to-dubai/hooks/useRelocation
│   ├── useRelocationCost.ts             → features/move-to-dubai/hooks/useRelocationCost
│   ├── useRelocationDocs.ts             → features/move-to-dubai/hooks/useRelocationDocs
│   ├── useRequests.ts
│   ├── useStays.ts                      → features/stays/hooks/useStays
│   ├── useStaysBooking.ts               → features/stays/hooks/useStaysBooking
│   ├── useSuppliers.ts
│   ├── useTransport.ts                  → features/transport/hooks/useTransport
│   ├── useTransportBooking.ts           → features/transport/hooks/useTransportBooking
│   ├── useUser.ts
│   ├── useVenue.ts                      → features/nightlife/hooks/useVenue
│   └── useVenues.ts                     → features/nightlife/hooks/useVenues
├── lib/                              ← Supabase service functions (shared)
│   ├── auth.ts
│   ├── business.ts
│   ├── experiences.ts
│   ├── motion.ts
│   ├── relocation.ts
│   ├── stays.ts
│   ├── supabase.ts
│   └── transport.ts
├── pages/                            ← Shell + concierge pages
│   ├── Explore.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── MyRequests.tsx
│   ├── Onboarding.tsx
│   ├── Register.tsx
│   ├── Request.tsx
│   ├── RequestSuccess.tsx
│   └── concierge/
│       ├── ConciergeHub.tsx             ← /concierge
│       └── ConciergeRequest.tsx         ← /concierge/request
├── admin/                            ← Admin panel pages
│   └── pages/
│       ├── AdminLayout.tsx
│       ├── AdminOverview.tsx
│       ├── AdminRequests.tsx
│       ├── AdminSupplierForm.tsx
│       ├── AdminSuppliers.tsx
│       ├── AdminVenueForm.tsx
│       └── AdminVenues.tsx
├── store/
│   └── useAppStore.ts
├── styles/
│   └── index.css
├── types/                            ← Re-export shims (point to features/)
│   ├── business.ts                      → features/business/types
│   ├── experiences.ts                   → features/experiences/types
│   ├── relocation.ts                    → features/move-to-dubai/types
│   ├── stays.ts                         → features/stays/types
│   └── transport.ts                     → features/transport/types
└── utils/
    ├── cn.ts
    └── recommendations.ts
```

---

## Architecture Notes

| Concern | Decision |
|---------|----------|
| Service lib functions | Stay in `src/lib/` (not moved into feature slices) — shared across features |
| Type shims | `src/types/{vertical}.ts` and `src/hooks/useXxx.ts` re-export from feature slices for backwards compat |
| Admin pages | Live in `src/admin/pages/` (not a feature slice — uses `AdminGuard`) |
| Concierge hub/form | `src/pages/concierge/` — migrated here while `src/features/concierge/` holds hooks + types |
| Nightlife | Full feature slice at `src/features/nightlife/` with its own hooks (`useVenues`, `useVenue`) and 6 pages |

---

## Scalability Notes

- **Feature isolation:** Each feature can evolve independently. New team members can own a single `features/` sub-folder.
- **Barrel exports:** Add `index.ts` to each feature folder to expose only the public API
- **Dynamic imports:** Vite `lazy()` loading for each feature hub — reduces initial bundle size significantly
- **Multi-city:** Add a `city` context/parameter at the feature level — features read from a `CityProvider` to scope all DB queries
