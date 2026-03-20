# Project Audit
> Date: 2026-03-20 | Method: full codebase trace — frontend → service layer → database

---

## Scope

- Repository: `DALC_OFFICIAL` (React 18 + Vite SPA, Supabase backend)
- Stages: structure scan → module analysis → production connectivity trace → assumption challenge

---

## Methodology

Each feature was traced from UI component → hook → service function → Supabase query. Features were only classified as "built" if all three layers were wired and the database table existed. Mock returns, `console.info` stubs, and catch-block silent fails were each classified separately.

---

## Summary Counts

| Classification | Count |
|---|---|
| Built (fully wired) | 11 |
| Partially built | 18 |
| Mocked | 4 |
| Broken | 14 |
| Missing | 8 |
| Dead code | 12+ |

Full breakdown: see [FEATURE_STATUS.md](FEATURE_STATUS.md)
Full debt register: see [TECH_DEBT.md](TECH_DEBT.md)
Execution plan: see [NEXT_STEPS.md](NEXT_STEPS.md)

---

## Critical Findings

### A. Data Integrity

**1. Two user tables in active use**
- `lib/auth.ts` reads/writes `profiles`
- `useUser.ts` + `ProfilePage.tsx` read/write `users`
- Profile edits save to a table the auth layer never reads. Changes are silently lost from the user's perspective.

**2. `specialRequests` dropped on submission**
- `BookingForm.tsx` collects the field in state, never includes it in `onSubmit`
- Affects every transport booking. The user sees their input; the database never receives it.

**3. Request category hardcoded**
- `Request.tsx` submits `category: 'dining'` regardless of user selection
- All requests submitted via the generic form are miscategorized in the database

**4. Venue ID collision**
- `AdminVenueForm.tsx` generates IDs from name slugs — no UUID
- Two venues with similar names overwrite each other silently

### B. Security

**5. API key committed to git**
- `VITE_GOOGLE_MAPS_API_KEY` is in `.env` (not `.env.local`)
- `.env` is likely tracked. Key is also exposed in the client-side Vite bundle.
- Key must be rotated immediately.

**6. RLS policies unverified**
- Migrations include RLS definitions but these cannot be confirmed from client code
- Admin role enforcement relies on `AdminGuard` (client-side) — if RLS is not set correctly, any authenticated user could query admin data directly

### C. Broken Features

**7. Availability always returns `true`**
- `lib/transport.ts` calls `check_transport_availability` and `get_transport_time_slots`
- `lib/experiences.ts` calls `check_experience_capacity` and `get_experience_slots`
- None of these RPCs exist in the database
- Catch blocks return `{ available: true }` — double-booking is structurally guaranteed

**8. Dead auth hook**
- `src/features/auth/useAuth.ts` always returns `{ user: null, isAuthenticated: false }`
- Never imported by anything. Real auth is wired in `App.tsx → AuthListener → Zustand`.

**9. Dead navigation links**
- `/profile/security`, `/profile/settings`, `/contact` are linked from UI but have no routes

**10. Two parallel admin directories**
- `src/admin/pages/` — active
- `src/pages/admin/` — legacy duplicate
- Router imports from both. Developers can edit the wrong copy with no visible effect.

### D. Missing

**11. No payment processing**
- Zero Stripe or gateway integration. Bookings confirm with no financial transaction.

**12. No notifications**
- `requestNotifications.ts` and `supplierNotifications.ts` are entirely `console.info`
- Users receive no booking confirmations, status updates, or alerts.

---

## Audit Corrections (Initial vs. Verified)

| Initial Claim | Verified Reality |
|---|---|
| Supplier CRUD: missing | Built — `AdminSupplierForm` → `useSupplierRegistry` → `platform/requests/suppliers.ts` → Supabase |
| Transport pricing: display-only | Client-side `calculatePrice()` exists in `BookingForm.tsx` — just never server-validated |
| Move-to-dubai routes: misnamed | Pages in `src/pages/move-to-dubai/` are intentional re-export shims — routing is correct |
| `carFleet.ts`: dead code | `CarFleet.tsx` imports it, but `CarFleet.tsx` is never routed — both are dead in production |
| `useAuth.ts`: broken hook | Confirmed dead stub — never imported, safe to delete outright |
