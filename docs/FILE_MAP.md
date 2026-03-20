# File Map
> Last updated: 2026-03-20
> Engineer onboarding reference — what each file does, whether it's active or dead

---

## Entry Points

| File | Role |
|---|---|
| `index.html` | Vite HTML shell |
| `index.tsx` | React root — mounts `<App />` |
| `src/App.tsx` | `AuthListener` + provider tree + `<AppRouter />` |
| `src/app/router.tsx` | All 60+ routes (React Router v6, all lazy-loaded) |
| `src/app/providers/index.tsx` | `QueryClientProvider`, `TooltipProvider` |

---

## Service Layer (`src/lib/`)

| File | Purpose | Notes |
|---|---|---|
| `supabase.ts` | Supabase client + `isMockMode` export | Central switch for all data |
| `auth.ts` | `getProfile()` | Reads `profiles` table |
| `transport.ts` | Transport CRUD | Has broken RPC calls + mock fallback |
| `experiences.ts` | Experience CRUD | Has broken RPC calls + 10-item mock array |
| `stays.ts` | Stays CRUD + `calculatePrice()` | Most complete service file |
| `business.ts` | Business service CRUD | |
| `relocation.ts` | Move-to-Dubai CRUD | |
| `motion.ts` | Framer Motion shared variants | |
| `utils.ts` | `cn()` + misc helpers | |

---

## Platform (`src/platform/`)

| File | Purpose | Notes |
|---|---|---|
| `requests/lifecycle.ts` | Request state machine | 11 statuses, atomic DB writes + audit log |
| `requests/suppliers.ts` | Supplier CRUD | `createWithVenues`, `update`, `bulkUpsert` |
| `requests/timeline.ts` | Timeline display helpers | |
| `notifications/requestNotifications.ts` | Request notification triggers | ⚠️ `console.info` only |
| `notifications/supplierNotifications.ts` | Supplier notification triggers | ⚠️ `console.info` only |
| `auth/access.ts` | Role/permission helpers | |

---

## Global State (`src/store/`)

| File | Purpose |
|---|---|
| `useAppStore.ts` | Zustand — `session`, `profile`, `isAdmin`, `savedVenues`, onboarding state, filters |

---

## Features (`src/features/`)

### Transport
| File | Purpose |
|---|---|
| `transport/hooks/useTransport.ts` | Fetch service listings |
| `transport/hooks/useTransportBooking.ts` | Booking mutation |
| `transport/pages/TransportHub.tsx` | Hub landing |
| `transport/pages/CarsList.tsx` | Cars listing |
| `transport/pages/YachtsList.tsx` | Yachts listing |
| `transport/pages/JetsList.tsx` | Jets listing |
| `transport/pages/TransportDetail.tsx` | Service detail + booking form |
| `transport/types.ts` | TypeScript types |

### Experiences
| File | Purpose |
|---|---|
| `experiences/hooks/useExperiences.ts` | Fetch listings |
| `experiences/hooks/useExperienceBooking.ts` | Booking mutation |
| `experiences/pages/ExperiencesHub.tsx` | Hub landing |
| `experiences/pages/SubcategoryList.tsx` | Category view |
| `experiences/pages/ExperienceDetail.tsx` | Detail + booking |

### Stays
| File | Purpose |
|---|---|
| `stays/hooks/useStays.ts` | Fetch properties |
| `stays/hooks/useStaysBooking.ts` | Booking mutation |
| `stays/pages/HotelsList.tsx` | Hotels |
| `stays/pages/VillasList.tsx` | Villas |
| `stays/pages/ResidencesList.tsx` | Residences |
| `stays/pages/PropertyDetail.tsx` | Property detail + booking |

### Nightlife
| File | Purpose |
|---|---|
| `nightlife/hooks/useVenues.ts` | Fetch venue listings |
| `nightlife/hooks/useVenue.ts` | Single venue |
| `nightlife/pages/NightlifeHub.tsx` | Hub |
| `nightlife/pages/NightClubs.tsx` | Clubs listing |
| `nightlife/pages/BeachClubs.tsx` | Beach clubs |
| `nightlife/pages/Restaurants.tsx` | Restaurants |
| `nightlife/pages/DiningEntertainment.tsx` | Private events |
| `nightlife/pages/VenueDetail.tsx` | Venue detail |

### Business
| File | Purpose |
|---|---|
| `business/hooks/useBusiness.ts` | Fetch services |
| `business/hooks/useConsultation.ts` | Consultation booking |
| `business/pages/BusinessHub.tsx` | Hub |
| `business/pages/SubcategoryList.tsx` | Category list |
| `business/pages/ServiceDetail.tsx` | Service detail |
| `business/pages/ConsultationPage.tsx` | Booking form |

### Move to Dubai
| File | Purpose |
|---|---|
| `move-to-dubai/hooks/useRelocation.ts` | Relocation profile data |
| `move-to-dubai/hooks/useRelocationCost.ts` | Cost estimates |
| `move-to-dubai/hooks/useRelocationDocs.ts` | Document tracking |
| `move-to-dubai/pages/MoveToDubai.tsx` | Hub |
| `move-to-dubai/pages/Intake.tsx` | Visa services form |
| `move-to-dubai/pages/Dashboard.tsx` | Progress dashboard |
| `move-to-dubai/pages/Documents.tsx` | Document management |
| `move-to-dubai/pages/CostEstimator.tsx` | Cost estimate tool |

### Auth
| File | Purpose | Notes |
|---|---|---|
| `auth/loginService.ts` | Login logic | Active |
| `auth/registerService.ts` | Registration | Active |
| `auth/useAuth.ts` | ⚠️ Dead stub | Always returns null — delete |

### Live Map
| File | Purpose |
|---|---|
| `live-map/LiveMapPage.tsx` | Map page |
| `live-map/lib/map-store.ts` | Map Zustand state |
| `live-map/lib/venue-data.ts` | Static venue pins |
| `live-map/components/map-3d/map-3d.tsx` | 3D Google Maps component |

---

## Admin — Active (`src/admin/`)

| File | Purpose | Notes |
|---|---|---|
| `pages/AdminLayout.tsx` | Sidebar layout, nav | |
| `pages/AdminOverview.tsx` | Dashboard stats | |
| `pages/AdminRequests.tsx` | Request management | |
| `pages/AdminVenues.tsx` | Venue listing | |
| `pages/AdminVenueForm.tsx` | Venue create/edit | ⚠️ ID collision bug |
| `pages/AdminSuppliers.tsx` | Supplier listing | |
| `pages/AdminSupplierForm.tsx` | Supplier create/edit | Full CRUD via `useSupplierRegistry` |
| `pages/AdminTransport.tsx` | Transport list | |
| `pages/AdminExperiences.tsx` | Experiences list | |
| `pages/AdminStays.tsx` | Stays list | |
| `pages/AdminBusiness.tsx` | Business list | |
| `pages/AdminConcierge.tsx` | Concierge view | |
| `hooks/useAdminFilters.ts` | Filter state | |
| `hooks/useAdminForm.ts` | Form helpers | |
| `hooks/useAdminDisclosure.ts` | Modal state | |

## Admin — Legacy (`src/pages/admin/`) ⚠️ DELETE AFTER AUDIT

| File | Notes |
|---|---|
| `AdminDashboard.tsx` | Not in router — delete |
| `AdminOverview.tsx` | Duplicate — verify router then delete |
| `AdminRequests.tsx` | Router may import this — check before delete |
| `AdminSuppliers.tsx` | Duplicate — verify then delete |
| `AdminVenues.tsx` | Router may import this — check before delete |

---

## Pages (`src/pages/`) — Active Routes

| File | Route |
|---|---|
| `auth/Login.tsx` | `/login` |
| `auth/Register.tsx` | `/register` |
| `auth/Onboarding.tsx` | `/onboarding` |
| `home/HomePage.tsx` | `/` |
| `explore/ExplorePage.tsx` | `/explore` |
| `explore/SearchResults.tsx` | `/search` |
| `profile/ProfilePage.tsx` | `/profile` |
| `Request.tsx` | `/request` |
| `RequestSuccess.tsx` | `/request/success` |
| `RequestDetail.tsx` | `/my-requests/:id` |
| `concierge/ConciergeHub.tsx` | `/concierge` |
| `concierge/RequestPage.tsx` | `/concierge/request` |
| `concierge/MyRequests.tsx` | `/my-requests` |
| `move-to-dubai/MoveToDubaiPage.tsx` | `/move-to-dubai` |
| `move-to-dubai/VisaServices.tsx` | re-export → `features/move-to-dubai/pages/Intake` |
| `move-to-dubai/RelocationServices.tsx` | re-export → `features/move-to-dubai/pages/Dashboard` |
| `move-to-dubai/BankSetup.tsx` | re-export → `features/move-to-dubai/pages/Documents` |
| `move-to-dubai/Schooling.tsx` | re-export → `features/move-to-dubai/pages/CostEstimator` |
| `travel/TravelHub.tsx` | `/travel` |
| `travel/Hotels.tsx` | `/travel/hotels` |
| `travel/Villas.tsx` | `/travel/villas` |
| `travel/Residences.tsx` | `/travel/residences` |
| `travel/Flights.tsx` | `/travel/flights` |
| `nightlife/NightlifeHub.tsx` | `/nightlife` |
| `nightlife/Nightclubs.tsx` | `/nightlife/clubs` |
| `nightlife/BeachClubs.tsx` | `/nightlife/beach-clubs` |
| `nightlife/Restaurants.tsx` | `/nightlife/restaurants` |
| `nightlife/PrivateEvents.tsx` | `/nightlife/dining` |
| `nightlife/VenueDetail.tsx` | `/venue/:id` |

## Pages (`src/pages/`) — Root-Level Duplicates ⚠️ DELETE

`Home.tsx`, `Login.tsx`, `Register.tsx`, `Onboarding.tsx`, `MyRequests.tsx` — unused copies of files in subdirectories.

---

## Components (`src/components/`)

### Auth
| File | Purpose |
|---|---|
| `auth/AuthGuard.tsx` | Redirects unauthenticated — reads Zustand session |
| `auth/AdminGuard.tsx` | Redirects non-admin — reads Zustand profile.role |

### Transport
| File | Status |
|---|---|
| `transport/BookingForm.tsx` | ✅ Active — used by `TransportDetail` |
| `transport/ServiceCard.tsx` | ✅ Active |
| `transport/TransportFilters.tsx` | ✅ Active |
| `transport/CarRental/CarFleet.tsx` | ⚠️ Dead — never routed |
| `transport/Chauffeur/ChauffeurFleet.tsx` | ⚠️ Dead — never routed |
| `transport/PrivateAviation/JetFleet.tsx` | ⚠️ Dead — never routed |

### UI Primitives (`src/components/ui/`)
30 Shadcn/Radix components: `alert`, `avatar`, `badge`, `button`, `card`, `checkbox`, `command`, `dialog`, `drawer`, `dropdown-menu`, `input`, `label`, `pagination`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `tooltip`.

---

## Shared (`src/shared/`)

| File | Purpose |
|---|---|
| `hooks/useSupplierRegistry.ts` | Supplier CRUD mutations — used by `AdminSupplierForm` |
| `components/SupplierRegistryForm.tsx` | Reusable supplier form UI |
| `utils/supplier.ts` | Supplier data helpers |

---

## Data (`src/data/`) — Static Files

| File | Status |
|---|---|
| `mockData.ts` | Active fallback for venue/request mock data |
| `venueAliasMap.ts` | Active — slug → venue ID mapping |
| `skillsMapping.ts` | Active — user interest label map |
| `transport/carFleet.ts` | ⚠️ Dead — only used by dead `CarFleet.tsx` |
| `transport/chauffeurFleet.ts` | ⚠️ Dead |
| `transport/jetFleet.ts` | ⚠️ Dead |

---

## Database (`supabase/`)

| File | Purpose |
|---|---|
| `schema.sql` | Full schema snapshot |
| `seed.sql` | Seed data |
| `migrations/...090100_relocation_schema.sql` | Relocation tables |
| `migrations/...090200_transport_schema.sql` | Transport tables |
| `migrations/...090300_stays_schema.sql` | Stays + availability tables |
| `migrations/...090400_experiences_schema.sql` | Experience tables |
| `migrations/...090500_business_schema.sql` | Business tables |
| `migrations/...090600_requests_concierge_alignment.sql` | Request system |
| `migrations/...090700_suppliers_bulk_import.sql` | Supplier operations |
| `migrations/...090800_platform_core_taxonomy_booking.sql` | Core taxonomy + booking sync |
| `migrations/...090900_platform_security_hardening_and_sync.sql` | RLS + sync views |

---

## Hooks (`src/hooks/`) — ⚠️ Duplicates, Consolidate

All files here mirror hooks in `src/features/*/hooks/`. No unique logic. Should be removed and callers updated to import from the feature-scoped location.

`useAdmin.ts`, `useBusiness.ts`, `useBusinessBooking.ts`, `useConsultation.ts`, `useExperienceBooking.ts`, `useExperiences.ts`, `useExplore.ts`, `useRelocation.ts`, `useRelocationCost.ts`, `useRelocationDocs.ts`, `useRequests.ts`, `useStays.ts`, `useStaysBooking.ts`, `useSuppliers.ts`, `useTransport.ts`, `useTransportBooking.ts`, `useUser.ts`, `useVenue.ts`, `useVenues.ts`
