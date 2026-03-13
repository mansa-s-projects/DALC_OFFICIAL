# Database: Suppliers

## Overview

The `suppliers` table is the registry of all service providers on the DALC platform. Every bookable service (experience, transport, stays, business) links to a supplier via `supplier_id`. The supplier system is the foundation of DALC's marketplace model.

---

## Schema

```sql
CREATE TABLE public.suppliers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id),
  company_name    TEXT NOT NULL,
  category        TEXT NOT NULL,
  description     TEXT,
  website         TEXT,
  phone           TEXT,
  email           TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 15.00,
  status          TEXT DEFAULT 'pending',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes
```sql
CREATE INDEX suppliers_category_idx ON public.suppliers(category);
CREATE INDEX suppliers_status_idx ON public.suppliers(status);
```

---

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | References `profiles.id` — the supplier's user account |
| `company_name` | TEXT | Display name of the business |
| `category` | TEXT | Service category: `experiences` \| `transport` \| `stays` \| `business` \| `nightlife` |
| `description` | TEXT | Company description for supplier profile |
| `website` | TEXT | Company website URL |
| `phone` | TEXT | Contact phone number |
| `email` | TEXT | Contact email |
| `commission_rate` | DECIMAL(5,2) | DALC's commission percentage on bookings (default: 15%) |
| `status` | TEXT | `pending` \| `active` \| `suspended` |

---

## Supplier Status Machine

```
pending   → DALC reviews application → active
active    → Admin suspends → suspended
suspended → Admin reactivates → active
pending   → Admin rejects → (soft delete or rejected status)
```

All new supplier registrations start as `pending`. Only `active` suppliers' services are published.

---

## Supplier → Service Relationships

| Supplier Category | Service Table | FK Column |
|-------------------|---------------|-----------|
| `experiences` | `experience_services` | `supplier_id` |
| `transport` | `transport_services` | `supplier_id` |
| `stays` | `stays_properties` | `supplier_id` |
| `business` | `business_services` | `supplier_id` |
| `nightlife` | `venues` | `supplier_id` |

A single supplier can supply services in one category. Cross-category suppliers would have multiple accounts (limitation of current design — see scalability notes).

---

## Commission Model

`commission_rate` is stored as a percentage (e.g., `15.00` = 15%).

Commission is calculated at booking time:
```typescript
const commission = booking.total_amount * (supplier.commission_rate / 100);
const supplierPayout = booking.total_amount - commission;
```

Commission rates can be customized per supplier by admin. Default is 15%.

**Future:** Add a `supplier_payouts` table to track payout history.

---

## RLS Policies

```sql
-- Any auth user can view active suppliers
"Active suppliers are publicly visible"
  FOR SELECT USING (status = 'active')

-- Suppliers can update their own profile
"Suppliers can update own profile"
  FOR UPDATE USING (user_id = auth.uid())

-- Admin can manage all suppliers
"Admins have full access to suppliers"
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ))
```

---

## Hook: `useSuppliers`

`src/hooks/useSuppliers.ts`

```typescript
// Fetch suppliers (admin view or category filter)
const { suppliers, isLoading } = useSuppliers({ category: 'experiences', status: 'active' });
```

---

## Admin Supplier Management

Routes:
- `/admin/suppliers` — `AdminSuppliers.tsx` — paginated supplier list, status badges
- `/admin/suppliers/new` — `AdminSupplierForm.tsx` — create new supplier profile
- `/admin/suppliers/:id` — `AdminSupplierForm.tsx` — edit supplier profile

Admin actions:
- Approve supplier (status: `pending → active`)
- Suspend supplier (status: `active → suspended`)
- Edit commission rate
- View all services under this supplier

---

## Current Onboarding Flow (Manual)

Currently, supplier onboarding is manual (admin-operated):
1. Supplier contacts DALC off-platform
2. Admin creates supplier record in `/admin/suppliers/new`
3. Admin creates service listings manually
4. Services published after review

**Target:** Self-service supplier onboarding portal (see [supplier-onboarding.md](../suppliers/supplier-onboarding.md)).

---

## Mock / Seed Data

Services in `src/lib/*.ts` reference supplier IDs directly in mock data:
```typescript
const MOCK_EXPERIENCE = {
  supplier_id: 'supplier-1', // hardcoded in mock
  ...
}
```

When live, real supplier UUIDs from the database replace these.

---

## Scalability Notes

- **Multi-category suppliers:** Current design assumes one category per supplier. To support multi-category suppliers, add a `supplier_categories TEXT[]` field or create a `supplier_categories` join table.
- **Supplier tiers:** Add `supplier_tier` field (`standard` | `preferred` | `premium`) to differentiate supplier quality levels. Premium suppliers get featured placement.
- **KYC/verification:** Add `kyc_status` and `kyc_documents` fields for formal supplier identity verification before activation.
- **Supplier self-service portal:** Build `/supplier/*` routes with a `SupplierGuard` (role check) allowing suppliers to manage their own listings, view bookings, and track payouts.
- **Revenue sharing:** Add `supplier_payouts` table to track per-booking commissions and scheduled payouts.
- **Multi-city:** Add `city_id` to suppliers to allow a supplier to operate in multiple cities. Services under that supplier inherit the city context.
