# Admin: Suppliers

## Overview

The Admin Suppliers section manages the registry of all DALC service providers. This is where suppliers are onboarded, reviewed, activated, and assigned commission rates.

---

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin/suppliers` | `AdminSuppliers.tsx` | Supplier registry list |
| `/admin/suppliers/new` | `AdminSupplierForm.tsx` | Add new supplier |
| `/admin/suppliers/:id` | `AdminSupplierForm.tsx` | Edit supplier profile |

---

## Supplier List (`AdminSuppliers.tsx`)

### Columns
| Column | DB Field | Notes |
|--------|----------|-------|
| Company Name | `company_name` | Clickable → edit form |
| Category | `category` | Badge |
| Email | `email` | |
| Commission | `commission_rate` | `15.00%` |
| Status | `status` | `Pending` / `Active` / `Suspended` badge |
| Services | computed | Count of linked services |
| Created | `created_at` | Relative date |
| Actions | — | Approve \| Suspend \| Edit |

### Filters
- Status: Pending / Active / Suspended / All
- Category dropdown
- Search by company name

---

## Supplier Form (`AdminSupplierForm.tsx`)

### Form Fields

```
Company Name       [text input]              required
Category           [select: experiences|transport|stays|business|nightlife]
Email              [email input]
Phone              [phone input]
Website            [URL input]
Description        [textarea, 500 chars max]
Commission Rate    [number input, default: 15.00] %
Status             [select: pending | active | suspended]
User Account       [user lookup input] (optional — links to a profiles.id)
```

---

## Supplier Status Machine

```
pending  →  [Admin approves]  →  active
active   →  [Admin suspends]  →  suspended
suspended → [Admin reactivates] → active
```

### Approve Action
```typescript
async function approveSupplier(supplierId: string) {
  await supabase
    .from('suppliers')
    .update({ status: 'active' })
    .eq('id', supplierId)
    .throwOnError();
  // Future: send welcome email to supplier
}
```

### Suspend Action
Suspend should:
1. Set `suppliers.status = 'suspended'`
2. Set `is_published = false` on all services under this supplier
3. Log the action in `admin_audit_log` (future)
4. Future: notify active clients with affected bookings

```typescript
async function suspendSupplier(supplierId: string) {
  await supabase.from('suppliers').update({ status: 'suspended' }).eq('id', supplierId);

  // Unpublish all their services
  await supabase.from('experience_services').update({ is_published: false }).eq('supplier_id', supplierId);
  await supabase.from('transport_services').update({ is_published: false }).eq('supplier_id', supplierId);
  await supabase.from('stays_properties').update({ is_published: false }).eq('supplier_id', supplierId);
  await supabase.from('business_services').update({ is_published: false }).eq('supplier_id', supplierId);
}
```

---

## Commission Rate Management

`commission_rate` is stored as a percentage on each supplier record.

**Default:** 15.00%

**Applied at booking time:**
```
Total booking: AED 5,000
Commission (15%): AED 750
Supplier earns: AED 4,250
```

**Per-supplier negotiation:** Premium suppliers (e.g. luxury yacht charter companies) may have lower commission rates (8–12%). Admin sets this per supplier.

---

## Linking Services to Suppliers

After a supplier is created and activated, admin creates service listings under that supplier:

1. Navigate to the relevant vertical admin panel (`/admin/experiences`, `/admin/transport`, etc.)
2. Create service with `supplier_id` set to this supplier
3. Publish service

**Future:** Approved suppliers use the supplier portal to create and manage their own listings.

---

## Supplier Service Summary Panel

On the supplier edit form, a read-only panel shows:

```
Services under this supplier:
┌─────────────────────────────────────────────────────────┐
│ EXPERIENCES (3)                                         │
│ ○ White Dubai Friday Night         Published  ✓        │
│ ○ Aura Sky Pool Experience         Published  ✓        │
│ ○ Zero Gravity Beach Club          Draft      ✗        │
│                                                         │
│ TRANSPORT (0)                                           │
│ STAYS (0)                                               │
│ BUSINESS (0)                                            │
└─────────────────────────────────────────────────────────┘
```

---

## Supplier User Account Linking

Each supplier can optionally be linked to a `profiles` user account via `suppliers.user_id`. This enables:
- Supplier portal login (when built)
- Self-service service management
- Booking notification delivery to supplier's email

**Current:** Most suppliers are created without a linked user account (admin-managed only).

---

## Scalability Notes

- **Supplier portal:** Build `/supplier/*` routes with `SupplierGuard` (role check for `supplier` role) — allows suppliers to log in, manage their services, and view bookings.
- **KYC workflow:** Add `kyc_status`, `trade_license_url`, `passport_url`, `vat_registration_url` fields to the supplier form for formal identity verification before activation.
- **Rating aggregation:** After implementing customer reviews, show average service rating per supplier in the admin list.
- **Payout management:** Add `supplier_payouts` table — list pending/paid payouts per supplier, bulk payout generation, payout approval workflow.
- **Supplier metrics:** Show lifetime booking count, total GMV (gross merchandise value), average rating on the supplier detail page.
