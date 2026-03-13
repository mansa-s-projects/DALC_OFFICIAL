# Supplier Dashboard

## Overview

The Supplier Dashboard is a future-facing self-service portal that allows approved suppliers to manage their service listings, view bookings, and track revenue — all without requiring admin intervention.

**Current status:** Not yet built. This document is a build specification.

---

## Routes (Future)

```
/supplier                → SupplierLayout (shell + sidebar)
  /supplier/dashboard    → SupplierOverview (metrics)
  /supplier/services     → SupplierServices (listing management)
  /supplier/services/new → SupplierServiceForm (create listing)
  /supplier/services/:id → SupplierServiceForm (edit listing)
  /supplier/bookings     → SupplierBookings (incoming bookings)
  /supplier/bookings/:id → SupplierBookingDetail
  /supplier/availability → SupplierAvailability (calendar)
  /supplier/settings     → SupplierSettings (profile + bank details)
```

---

## Access Control: SupplierGuard

New guard component (not yet created):

```typescript
function SupplierGuard({ children }: { children: ReactNode }) {
  const { profile } = useAppStore();
  if (!profile) return <Navigate to="/login" replace />;
  if (profile.role !== 'supplier') return <Navigate to="/" replace />;
  return <>{children}</>;
}
```

All `/supplier/*` routes wrapped with `<SupplierGuard>`.

**RLS enforcement:** The database ensures suppliers can only read/write their own records:
```sql
-- Example: supplier can only manage their own services
CREATE POLICY "Suppliers manage own services"
  ON experience_services FOR ALL
  USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  );
```

---

## SupplierOverview (Dashboard Home)

Key metrics for the supplier:

### Stats Row
- Total bookings this month
- Total revenue this month (gross, before commission)
- Your payout this month (gross - commission)
- Average booking rating (future — when reviews are live)

### Active Bookings Strip
Upcoming bookings in the next 7 days:
```
Today:
  09:30  Desert Safari (4 guests) — Confirmed
  14:00  VIP Table — Pending
Tomorrow:
  11:00  Yacht Charter (8 guests) — Confirmed
```

### Quick Actions
- [+ Add New Service]
- [View Pending Bookings]
- [Update Availability]

---

## SupplierServices (Listing Management)

Suppliers manage their own service catalogue. Each service links back to the relevant vertical table (`experience_services`, `transport_services`, etc. depending on supplier category).

### Service List
- Paginated list of all their services
- Columns: title, subcategory, price, status (draft/published), bookings count
- Toggle is_published inline (draft ↔ live — pending admin review before first publish)
- Edit / Delete actions

### Service Form
Same fields as admin service forms but pre-filtered to the supplier's category. All listings created by suppliers start as `is_published = false` and require admin review before going live.

### Image Upload
Suppliers upload images directly to Supabase Storage:
```
Bucket: dalc-supplier-assets (authenticated write, public read)
Path:   services/{supplier_id}/{service_id}/{filename}
```

---

## SupplierBookings (Incoming Bookings)

Suppliers see bookings for their services:

```typescript
// Fetch bookings for this supplier's services
const { data } = await supabase
  .from('experience_bookings')
  .select(`
    *,
    experience:experience_services(title, images),
    user:profiles(full_name, phone)
  `)
  .in('experience_id',
    supabase.from('experience_services')
      .select('id')
      .eq('supplier_id', supplierRecord.id)
  )
  .order('slot_date', { ascending: true });
```

### Booking Actions
- Mark booking as confirmed (if status = pending)
- Mark as completed
- Cannot cancel (must go through DALC admin)

---

## SupplierAvailability (Calendar Manager)

Visual calendar showing:
- Dates with confirmed bookings (red dots)
- Blackout dates (dates marked unavailable by supplier — e.g. closed for Eid)
- Available slots (green)

Supplier actions:
- Set blackout dates (block availability on specific dates)
- Override pricing for peak dates (holiday surcharge)
- Set max capacity per date

This writes directly to:
- `stays_availability` (for stays suppliers)
- `experience_services.time_slots` JSONB (for experience suppliers)

---

## SupplierSettings (Profile + Bank Details)

Editable profile:
```
Company Name      [text]
Description       [textarea]
Website           [URL]
Contact Phone     [phone]
Contact Email     [email]
```

Bank / Payout Details (future, sensitive):
```
Bank Name         [text]
Account Number    [masked]
IBAN              [text]
Account Holder    [text]
```
Payout details stored encrypted; not queryable via RLS except by the supplier themselves and finance admins.

---

## Supplier Notifications

Suppliers receive notifications when:
- A new booking is made for their service
- A booking is cancelled
- A review is submitted (future)
- A payout is processed (future)
- Admin requests or approves a service listing change

**Channel:** Email (Supabase/Resend) + in-app notification if logged in.

---

## Scalability Notes

- **Supplier analytics:** Add a trend chart showing bookings over time, top performing services, peak demand periods.
- **Supplier app (mobile):** A dedicated mobile app (React Native) for suppliers to manage availability and bookings on the go.
- **Instant messaging:** Add a supplier ↔ DALC admin direct message thread for listing clarifications and operational coordination.
- **Multi-location suppliers:** A transport or stays supplier may have services across multiple Dubai areas — allow services to be tagged by location/area within the dashboard.
