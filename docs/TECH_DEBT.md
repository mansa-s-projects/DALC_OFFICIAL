# Tech Debt Register
> Last updated: 2026-03-20
> 🔴 Critical | 🟠 High | 🟡 Medium | ⚪ Low

---

## 🔴 Critical — Fix Before Any Production Traffic

| ID | File(s) | Debt |
|---|---|---|
| TD-01 | `src/lib/auth.ts` vs `src/hooks/useUser.ts` | Two DB tables for same entity (`profiles` vs `users`). Profile saves go to wrong table. |
| TD-02 | `.env` | Google Maps API key committed to git. Must rotate and restrict to `.env.local`. |
| TD-03 | `src/lib/transport.ts`, `src/lib/experiences.ts` | Availability RPCs don't exist in DB. Catch blocks return `{ available: true }`. Double-booking is guaranteed. |
| TD-04 | `src/components/transport/BookingForm.tsx` | `specialRequests` collected in state, never included in `onSubmit` payload. Silent data loss. |

---

## 🟠 High — Fix Before Soft Launch

| ID | File(s) | Debt |
|---|---|---|
| TD-05 | `src/pages/Request.tsx` | Category hardcoded as `'dining'` for all request submissions. |
| TD-06 | `src/features/auth/useAuth.ts` | Dead stub always returns `null`. Never imported. Misleads any developer who finds it. |
| TD-07 | `src/admin/pages/AdminVenueForm.tsx` | Venue ID generated from name slug — collision risk. No UUID. |
| TD-08 | `src/pages/profile/ProfilePage.tsx:194` | Links to `/profile/security` and `/profile/settings` — routes don't exist. |
| TD-09 | Transport pages (multiple) | Links to `/contact` — route doesn't exist in router. |
| TD-10 | `src/pages/admin/`, `src/admin/pages/`, `src/app/router.tsx` | Two parallel admin implementations. Router imports from both. |
| TD-11 | `src/platform/notifications/requestNotifications.ts` | All notification logic is `console.info`. No actual delivery. |
| TD-12 | `src/platform/notifications/supplierNotifications.ts` | Same. |

---

## 🟡 Medium — Fix Before Scaling

| ID | File(s) | Debt |
|---|---|---|
| TD-13 | `src/lib/stays.ts` | Availability fallback uses `Math.random()`. |
| TD-14 | `src/lib/transport.ts` | 7-item `MOCK_SERVICES` array returned when DB is empty. |
| TD-15 | `src/lib/experiences.ts` | 10-item hardcoded array with fake `booking_count` / `trending_score`. |
| TD-16 | `src/hooks/` (root level) | Duplicates all hooks already in `src/features/*/hooks/`. Two sources of truth. |
| TD-17 | `src/app/DALCShadcnDemo.tsx` | Dev/test file in `src/app/`. Not routed but included in the bundle. |
| TD-18 | All booking flows | No server-side price validation. All prices are client-computed only. |
| TD-19 | All route-level pages | `ErrorBoundary` exists but not applied to all routes. |
| TD-20 | Admin tables | No pagination — all records fetched on load. Will degrade at scale. |

---

## ⚪ Low — Dead Code to Delete

| ID | File(s) | Note |
|---|---|---|
| TD-21 | `src/components/transport/CarRental/CarFleet.tsx` | Never routed. Booking CTA is `console.log`. |
| TD-22 | `src/components/transport/Chauffeur/ChauffeurFleet.tsx` | Same. |
| TD-23 | `src/components/transport/PrivateAviation/JetFleet.tsx` | Same. |
| TD-24 | `src/data/transport/carFleet.ts` | Only imported by dead `CarFleet.tsx`. |
| TD-25 | `src/data/transport/chauffeurFleet.ts` | Same. |
| TD-26 | `src/data/transport/jetFleet.ts` | Same. |
| TD-27 | `src/pages/Home.tsx` | Root-level duplicate of `src/pages/home/HomePage.tsx`. |
| TD-28 | `src/pages/Login.tsx` | Root-level duplicate of `src/pages/auth/Login.tsx`. |
| TD-29 | `src/pages/Register.tsx` | Same pattern. |
| TD-30 | `src/pages/Onboarding.tsx` | Same pattern. |
| TD-31 | `src/pages/MyRequests.tsx` | Root-level duplicate of `src/pages/concierge/MyRequests.tsx`. |
| TD-32 | `src/features/booking/index.ts` | Empty barrel export. |
| TD-33 | `src/features/concierge-request/index.ts` | Empty barrel export. |
| TD-34 | `src/features/relocation-intake/index.ts` | Empty barrel export. |

---

## Missing — Feature Gaps (Not Debt)

| Gap | Impact |
|---|---|
| Payment processing | Platform cannot collect money |
| Email / push notifications | Users receive no confirmations or updates |
| RLS policy verification | Cannot confirm server-side access control |
| Supplier self-service portal | Suppliers have no login or dashboard |
| `/profile/security` + `/profile/settings` pages | Dead links in production |
| `/contact` page | Dead links in transport section |
