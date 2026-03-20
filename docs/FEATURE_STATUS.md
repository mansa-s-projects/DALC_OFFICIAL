# Feature Status
> Last updated: 2026-03-20
> ✅ Built | 🟡 Partial | 🟠 Mocked | 🔴 Broken | ⬛ Missing

---

## Auth & Users

| Feature | Status | Blocker / Note |
|---|---|---|
| Login / Register | ✅ | Supabase email+password |
| Session persistence | ✅ | Zustand + `onAuthStateChange` in `App.tsx` |
| AuthGuard | ✅ | Zustand session, redirects with `state.from` |
| AdminGuard | ✅ | Checks `profile.role` in Zustand |
| Profile view | ✅ | Reads from Zustand profile state |
| Profile edit (save) | ✅ | Writes to `profiles` table correctly |
| `useAuth.ts` hook | 🔴 | Dead stub — always returns null. Delete. |
| `/profile/security` | ✅ | Privacy & security page with password change |
| `/profile/settings` | ✅ | Notification preferences page |
| Password reset | ✅ | Available in security page |
| Avatar upload | ⬛ | Field in schema, no upload flow |

---

## Transport (Cars / Yachts / Jets)

| Feature | Status | Blocker / Note |
|---|---|---|
| Service listing — cars | 🟡 | Real query + 3-item mock fallback |
| Service listing — yachts | 🟡 | Real query + 2-item mock fallback |
| Service listing — jets | 🟡 | Real query + 2-item mock fallback |
| Service detail page | ✅ | `TransportDetail.tsx` with specs |
| Booking form UI | ✅ | Date, duration, extras, price display |
| Client-side price calc | 🟡 | `BookingForm.tsx` — no server validation |
| `specialRequests` field | 🔴 | Collected, never sent to DB |
| Availability check | 🔴 | RPC doesn't exist — always returns available |
| Booking write to DB | 🟡 | Writes to `transport_bookings` when connected |
| `/contact` link | 🔴 | Route doesn't exist |
| CarFleet / ChauffeurFleet / JetFleet components | ⬛ | Dead — never routed, CTA is `console.log` |

---

## Experiences

| Feature | Status | Blocker / Note |
|---|---|---|
| Experience listing | 🟠 | 10-item hardcoded array, fake booking counts |
| Category filtering | 🟡 | Filter logic exists, operates on mock data |
| Experience detail | 🟡 | Page exists, schema defined |
| Slot availability | 🔴 | RPC doesn't exist — always returns available |
| Booking write to DB | 🟡 | Writes to `experience_bookings` when connected |

---

## Stays (Hotels / Villas / Residences)

| Feature | Status | Blocker / Note |
|---|---|---|
| Property listing | 🟡 | Real queries, mock fallback |
| Property detail | 🟡 | Page + components exist |
| Price calculation | ✅ | `calculatePrice()` in `stays.ts` — seasonal rates, fees, deposit |
| Availability calendar | 🟡 | Queries `stays_availability`; mock uses `Math.random()` |
| Booking write to DB | 🟡 | Writes to `stays_bookings` |

---

## Nightlife / Venues

| Feature | Status | Blocker / Note |
|---|---|---|
| Venue listing | 🟡 | Real Supabase queries with category filter |
| Venue detail | 🟡 | Page + data structure exist |
| Table / reservation booking | ⬛ | No booking flow for nightlife |
| Saved venues | ✅ | Zustand + `persist` middleware |

---

## Request / Concierge System

| Feature | Status | Blocker / Note |
|---|---|---|
| Generic request form | 🔴 | Category hardcoded as `'dining'` |
| Request write to DB | 🟡 | Submits — but category field is wrong |
| Request state machine | ✅ | 11 statuses, valid transitions, audit log |
| My Requests (user) | ✅ | Real Supabase query, status display |
| Request detail | ✅ | Timeline, status badge |
| Admin request management | ✅ | Status updates, filtering |
| Request notifications | 🟡 | Foundation exists (notifications table + hooks), not yet integrated |

---

## Supplier System

| Feature | Status | Blocker / Note |
|---|---|---|
| Supplier listing (admin) | ✅ | Real Supabase query |
| Supplier create | ✅ | `AdminSupplierForm` → `useSupplierRegistry` → DB |
| Supplier update | ✅ | Same path |
| Supplier bulk import | ✅ | `bulkUpsertSuppliers` in `platform/requests/suppliers.ts` |
| Supplier-venue assignment | ✅ | Syncs `venues.supplier_id` on save |
| Supplier portal (self-service) | ⬛ | No supplier-facing login or dashboard |

---

## Admin Panel

| Feature | Status | Blocker / Note |
|---|---|---|
| Layout + sidebar | ✅ | `src/admin/pages/AdminLayout.tsx` |
| Overview stats | ✅ | Real counts from Supabase |
| Venue create/edit | 🔴 | ID collision bug — name slug, no UUID |
| Supplier CRUD | ✅ | Fully wired |
| Request management | ✅ | Status updates work |
| Transport / Experiences / Stays / Business / Concierge | 🟡 | List views only — no create/edit for these |

---

## Move to Dubai

| Feature | Status | Blocker / Note |
|---|---|---|
| Hub landing | ✅ | Category overview page |
| Intake / Visa Services | 🟠 | Form UI, no real backend processing |
| Relocation dashboard | 🟡 | Progress tracking UI, real DB hooks |
| Document management | 🟡 | Upload UI exists, no real storage flow confirmed |
| Cost estimator | 🟡 | Add/view UI + hooks, no pricing engine |

---

## Business Setup

| Feature | Status | Blocker / Note |
|---|---|---|
| Hub + category listing | ✅ | Real Supabase queries |
| Service detail | 🟡 | Page exists |
| Consultation booking | 🟡 | Form + page — DB write unverified |

---

## Search & Explore

| Feature | Status | Blocker / Note |
|---|---|---|
| Explore page | ✅ | Venue grid with filters |
| Search results | 🟡 | `SearchResults.tsx` + `searchService.ts` exist |
| Live Map | 🟡 | Google Maps 3D integration, venue pins from static data |

---

## Platform / Infrastructure

| Feature | Status | Blocker / Note |
|---|---|---|
| Supabase connection | ✅ | Real credentials in `.env.local` |
| Mock fallback mode | ✅ | `isMockMode` pattern — clean |
| Email notifications | ⬛ | Not started |
| Push notifications | ⬛ | Not started |
| In-app notifications | ✅ | Bell in navbar + /notifications page + real-time |
| Payment processing | ⬛ | Zero implementation |
| Error boundaries | 🟡 | `ErrorBoundary.tsx` exists, not applied to all routes |
| RLS policies | ❓ | Migrations define them — cannot verify enforcement from client |
