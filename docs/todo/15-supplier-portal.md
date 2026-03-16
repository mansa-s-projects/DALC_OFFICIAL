# TODO: Supplier Portal

> Priority: 🟠 HIGH — No supplier-facing interface exists; supplier management is admin-only

---

## Current State

- `suppliers` table exists in Supabase schema
- Admin can manage suppliers via `/admin/suppliers` CRUD page
- Suppliers have NO self-service portal
- Suppliers cannot:
  - Log in and see their own bookings
  - Update their availability
  - Manage their service listings
  - Receive booking notifications
  - Upload documents

---

## Architecture Decision

**Approach**: Suppliers use the same Supabase Auth as regular users but have `profiles.is_supplier = true` and `profiles.supplier_id = suppliers.id`.

Route prefix: `/supplier/...` (protected by `<SupplierGuard>`)

---

## Tasks

### Task 1: Supplier Auth & Guard

**New guard**: `src/components/auth/SupplierGuard.tsx`

```tsx
// Checks: user is authenticated AND profiles.is_supplier = true
// If not supplier: redirect to /login or show "Access Denied"
```

**Supplier login is same as regular login** — just navigates to `/supplier/dashboard` after login if `is_supplier = true`.

Modify `AuthProvider` to detect supplier role and redirect:
```tsx
if (profile.is_supplier) {
  navigate('/supplier/dashboard');
} else {
  navigate('/');
}
```

---

### Task 2: Supplier Onboarding Flow

When a supplier account is first created (by admin or via application), they need to complete onboarding.

Route: `/supplier/onboarding`

**Step 1: Business Profile**
- Company name
- Registration number
- Category (Transport / Experiences / Stays / Nightlife / Business Services)
- Website
- Social media links

**Step 2: Service Listing Setup**
- Add first service/offering
- Set pricing, availability window, description
- Upload images

**Step 3: Bank Details (for payouts)**
- IBAN / Account number
- Bank name
- Beneficiary name
- Documents: trade license, VAT certificate

**Step 4: Agreement**
- Accept platform terms and commission structure
- Sign electronically (name + date)

**On complete**: Update `suppliers.onboarding_completed = true`, notify admin.

---

### Task 3: Supplier Dashboard

Route: `/supplier/dashboard`

**Dashboard widgets**:
| Widget | Data Source |
|--------|------------|
| Active bookings today | `transport_bookings / experience_bookings` WHERE today |
| Revenue this month | SUM total_price WHERE supplier_id = me AND month = current |
| Pending actions | Bookings awaiting confirmation |
| New messages | Unread messages from customers/admin |
| Upcoming availability gaps | Dates with no availability set |

**Quick actions**:
- Update today's availability
- Confirm pending bookings
- View new reviews

---

### Task 4: Service Listing Management

Route: `/supplier/services`

Shows all services belonging to this supplier:
- Table: service name, category, status (active/inactive), bookings this month, avg rating
- Edit service details inline or via modal
- Toggle `is_active` to show/hide from platform
- Duplicate service

**New service creation**: `/supplier/services/new`

Fields:
- Name, description, images (up to 10)
- Category, sub-category
- Pricing: per hour / per day / per person / fixed
- Maximum capacity
- Cancellation policy
- Minimum booking notice (hours)

---

### Task 5: Availability Calendar Management

Route: `/supplier/availability`

Calendar view for each service:
- Mark dates as unavailable (blocked)
- Set custom pricing for specific dates (peak season: +30%)
- View existing bookings overlaid

```sql
-- Supplier manages their own availability:
-- transport_availability / stays_availability tables
-- RLS: supplier can only update their own services' availability
```

---

### Task 6: Booking Management

Route: `/supplier/bookings`

View all incoming bookings:
- Filter: Pending / Confirmed / Completed / Cancelled
- Sort: By date, by service, by value

**Pending bookings**: Require manual confirmation within 24h
- Confirm button → `status = 'confirmed'` + notify customer
- Decline with reason → `status = 'declined'` + notify customer

**Booking detail view**: Show customer name, dates, special requests, contact details.

---

### Task 7: Earnings & Payouts

Route: `/supplier/earnings`

Shows:
- Total lifetime earnings
- This month vs. last month comparison
- Earnings by service breakdown
- Commission deducted (platform fee %)
- Payout history table
- Next payout date + estimated amount

**Commission model**: Stored as `suppliers.commission_rate` (e.g., 0.15 = 15%).

Net payout = `total_price * (1 - commission_rate)`.

---

### Task 8: Reviews & Reputation

Route: `/supplier/reviews`

Shows all reviews received across their services:
- Rating breakdown: 5★, 4★, 3★, 2★, 1★ counts
- Individual review cards with customer name (optional), date, text
- Average rating prominently displayed
- "Reply to review" (optional phase 2)

---

### Task 9: Documents & Compliance

Route: `/supplier/documents`

View of required documents and their status:
- Trade License: ✅ Uploaded | ⚠️ Expires in 30 days | ❌ Missing
- VAT Certificate: ...
- Insurance Certificate: ...

Upload new versions before expiry.

Store in Supabase Storage: `supplier-docs/{supplier_id}/`

---

### Task 10: Supplier Application Flow (Public-Facing)

Add a "Become a Supplier / Partner" page on the main site.

Route: `/become-a-partner`

- Short application form: company name, category, website, description, contact info
- Submit → creates `supplier_applications` table entry + notifies admin
- Admin reviews and approves → creates `suppliers` record + creates auth user

---

## Database Schema Requirements

Audit that `suppliers` table has:
```sql
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(4,3) DEFAULT 0.15;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_details JSONB;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS agreement_signed_at TIMESTAMPTZ;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
```

New table:
```sql
CREATE TABLE supplier_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  category TEXT,
  website TEXT,
  description TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## RLS Policies Needed

```sql
-- Suppliers can only read/update their own data:
CREATE POLICY "Supplier can read own services" ON transport_services
  FOR SELECT USING (supplier_id = (SELECT supplier_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Supplier can update own services" ON transport_services
  FOR UPDATE USING (supplier_id = (SELECT supplier_id FROM profiles WHERE id = auth.uid()));
```

Apply same pattern to: `experience_services`, `stays_properties`, `transport_availability`, `stays_availability`.

---

## Component Structure

```
src/features/supplier/
  pages/
    SupplierDashboard.tsx
    SupplierOnboarding.tsx
    SupplierServices.tsx
    SupplierNewService.tsx
    SupplierAvailability.tsx
    SupplierBookings.tsx
    SupplierEarnings.tsx
    SupplierReviews.tsx
    SupplierDocuments.tsx
  components/
    SupplierBookingCard.tsx
    SupplierServiceCard.tsx
    EarningsChart.tsx
    AvailabilityCalendar.tsx
  hooks/
    useSupplierProfile.ts
    useSupplierBookings.ts
    useSupplierServices.ts
    useSupplierEarnings.ts

src/components/auth/
  SupplierGuard.tsx
```

---

## Router Changes Required

```tsx
// src/app/router.tsx
const SupplierDashboard = lazy(() => import('../features/supplier/pages/SupplierDashboard'));
// ... all supplier pages

<Route path="/supplier" element={<SupplierGuard />}>
  <Route path="dashboard" element={<SupplierDashboard />} />
  <Route path="services" element={<SupplierServices />} />
  <Route path="services/new" element={<SupplierNewService />} />
  <Route path="availability" element={<SupplierAvailability />} />
  <Route path="bookings" element={<SupplierBookings />} />
  <Route path="earnings" element={<SupplierEarnings />} />
  <Route path="reviews" element={<SupplierReviews />} />
  <Route path="documents" element={<SupplierDocuments />} />
  <Route path="onboarding" element={<SupplierOnboarding />} />
</Route>

<Route path="/become-a-partner" element={<BecomeAPartner />} />
```

---

## Acceptance Criteria

- [ ] `<SupplierGuard>` routes only accessible to `is_supplier = true` users
- [ ] Supplier redirect after login works
- [ ] Supplier onboarding 4-step wizard works end-to-end
- [ ] Dashboard shows real booking and revenue data
- [ ] Supplier can activate/deactivate services
- [ ] Supplier can manage availability calendar
- [ ] Supplier can confirm/decline pending bookings
- [ ] Earnings breakdown shows gross, commission, net
- [ ] Reviews page shows all reviews received
- [ ] Documents section with expiry tracking
- [ ] `/become-a-partner` public page + `supplier_applications` table
- [ ] RLS policies prevent cross-supplier data access
