# TODO: Admin Panel — Missing Booking Verticals

> Priority: 🟠 HIGH — Admin can only manage Venues, Suppliers, and Requests. All bookable verticals are missing.

---

## Current Admin State

| Admin Section | Route | Status |
|---------------|-------|--------|
| Overview | `/admin` | ✅ Built |
| All Requests | `/admin/requests` | ✅ Built — shows concierge requests |
| Venues CRUD | `/admin/venues` | ✅ Built |
| Suppliers CRUD | `/admin/suppliers` | ✅ Built |
| Transport Bookings | — | ❌ Missing |
| Experience Bookings | — | ❌ Missing |
| Business Consultations | — | ❌ Missing |
| Stays Bookings | — | ❌ Missing |
| Relocation Profiles | — | ❌ Missing |
| Concierge Queue | `/admin/requests` | ⚠️ Partial — no assignment workflow |
| User Management | — | ❌ Missing |
| Analytics Dashboard | — | ❌ Missing |

---

## Task 1: Admin Sidebar — Add Missing Links

**File**: `src/admin/pages/AdminLayout.tsx` (or `AdminSidebar.tsx`)

Add sidebar nav entries:
```tsx
{ label: 'Transport', icon: CarIcon, href: '/admin/transport' }
{ label: 'Experiences', icon: ZapIcon, href: '/admin/experiences' }
{ label: 'Business', icon: BriefcaseIcon, href: '/admin/business' }
{ label: 'Stays', icon: HomeIcon, href: '/admin/stays' }
{ label: 'Relocation', icon: MapPinIcon, href: '/admin/relocation' }
{ label: 'Concierge Queue', icon: StarIcon, href: '/admin/concierge' }
{ label: 'Users', icon: UsersIcon, href: '/admin/users' }
{ label: 'Analytics', icon: BarChartIcon, href: '/admin/analytics' }
```

---

## Task 2: Transport Bookings Admin

**New file**: `src/admin/pages/TransportBookingsAdmin.tsx`

**Table columns**:
| Column | Source |
|--------|--------|
| Booking ID | `transport_bookings.id` |
| Service type | Car / Yacht / Jet |
| Service name | JOIN `transport_services.name` |
| Customer | JOIN `profiles.full_name` |
| Dates | `start_date` → `end_date` |
| Status | `pending | confirmed | in_progress | completed | cancelled` |
| Price | `total_price` + currency |
| Actions | View, Confirm, Cancel |

**Actions**:
- Confirm booking → `status = 'confirmed'` + send notification
- Cancel booking → `status = 'cancelled'` + send notification
- View details modal with all booking fields

**Route**: `/admin/transport`

---

## Task 3: Experience Bookings Admin

**New file**: `src/admin/pages/ExperienceBookingsAdmin.tsx`

**Table columns**:
| Column | Source |
|--------|--------|
| Booking ID | `experience_bookings.id` |
| Experience | JOIN `experience_services.name` |
| Customer | JOIN `profiles.full_name` |
| Date | `booking_date` |
| Time slot | `time_slot` |
| Tickets | `quantity` (adults + children) |
| Tier | `tier_selected` |
| Status | `pending | confirmed | completed | cancelled` |
| Total | `total_price` |
| Actions | View, Confirm, Cancel |

**Route**: `/admin/experiences`

---

## Task 4: Business Consultations Admin

**New file**: `src/admin/pages/BusinessConsultationsAdmin.tsx`

**Table columns**:
| Column | Source |
|--------|--------|
| Booking ID | `business_consultations.id` |
| Service type | Company formation / Licensing / Banking / etc. |
| Client | JOIN `profiles.full_name` |
| Consultant | Assigned team member |
| Scheduled date | `consultation_date` |
| Status | `pending | scheduled | completed | cancelled` |
| Documents | Count of uploaded docs |
| Actions | Assign, Reschedule, Complete |

**Additional**: Show compliance checklist status per booking.

**Route**: `/admin/business`

---

## Task 5: Stays Bookings Admin

**New file**: `src/admin/pages/StaysBookingsAdmin.tsx`

**Table columns**:
| Column | Source |
|--------|--------|
| Booking ID | `stays_bookings.id` |
| Property | JOIN `stays_properties.name` |
| Type | Hotel / Villa / Residence |
| Guest | JOIN `profiles.full_name` |
| Check-in | `check_in_date` |
| Check-out | `check_out_date` |
| Nights | Calculated |
| Guests | `guest_count` |
| Status | `pending | confirmed | checked_in | checked_out | cancelled` |
| Total | `total_price` |
| Actions | Confirm, Check-in, Check-out, Cancel |

**Route**: `/admin/stays`

---

## Task 6: Relocation Profiles Admin

**New file**: `src/admin/pages/RelocationProfilesAdmin.tsx`

**Purpose**: View, manage, and progress relocation workflows for all clients currently enrolled.

**Table columns**:
| Column | Source |
|--------|--------|
| Profile ID | `relocation_profiles.id` |
| Client | JOIN `profiles.full_name` |
| Case Manager | Assigned team member |
| Current Step | `current_step` from workflow |
| Progress | % of completed steps |
| Start Date | `created_at` |
| Target Move Date | `target_date` |
| Status | `intake | active | paused | completed` |
| Documents | Count uploaded |
| Actions | View timeline, Assign, Progress |

**Detail View**: Show full step-by-step workflow state machine for the client.

**Route**: `/admin/relocation`

---

## Task 7: Concierge Queue Admin (Upgrade Existing)

**Existing file**: `src/admin/pages/AdminRequests.tsx` — UPGRADE, don't replace.

**Current state**: Shows list of requests, basic status update.

**Missing features**:

1. **Assignment workflow**:
   - "Assign to" dropdown → select from admin/team users
   - `concierge_requests.assigned_to` field
   
2. **Internal notes**:
   - Rich text notes field per request (admin-only)
   - Thread/comment history
   
3. **Priority queue view**:
   - Sort by urgency: `urgent | high | normal | low`
   - Color-coded row highlighting

4. **Quote flow**:
   - "Send Quote" button on request row
   - Opens modal to enter quote amount + details
   - Updates `concierge_requests.quote_amount` + `status = 'quoted'`
   - Client can accept/decline from their side at `/my-requests`

5. **Estimated fulfillment date**:
   - Set ETA field on each request
   - Shows in client's My Requests view

**Route**: `/admin/requests` (already exists, enhance it)

---

## Task 8: User Management Admin

**New file**: `src/admin/pages/UsersAdmin.tsx`

**Table columns**:
| Column | Source |
|--------|--------|
| User ID | `profiles.id` |
| Name | `profiles.full_name` |
| Email | `auth.users.email` (via Edge Function or admin RLS policy) |
| Tier | `profiles.tier` — black / platinum / gold |
| Joined | `profiles.created_at` |
| Activity | Count: requests, bookings |
| Status | active / suspended |
| Actions | View profile, Change tier, Suspend |

**Change Tier**: Admin can upgrade/downgrade a user's `profiles.tier` directly.

**Route**: `/admin/users`

---

## Task 9: Analytics Dashboard Admin

**New file**: `src/admin/pages/AnalyticsAdmin.tsx`

**Metrics to display**:

| Metric | Source |
|--------|--------|
| Total bookings (30d) | Count across all booking tables |
| Revenue (30d) | Sum of total_price across all booking tables |
| New users (30d) | COUNT profiles.created_at |
| Active requests | COUNT concierge_requests WHERE status = 'active' |
| Top category | GROUP BY category across experiences |
| Booking funnel | Conversion from view → booking |
| Top venues | Most booked venues |

**Charts** (using recharts or chart.js):
- Line chart: daily bookings (30d)
- Bar chart: bookings by category
- Pie chart: request types distribution
- KPI cards with sparklines

**Route**: `/admin/analytics`

---

## Router Changes Required

```tsx
// src/app/router.tsx — add inside AdminGuard route:
const TransportBookingsAdmin = lazy(() => import('../admin/pages/TransportBookingsAdmin'));
const ExperienceBookingsAdmin = lazy(() => import('../admin/pages/ExperienceBookingsAdmin'));
const BusinessConsultationsAdmin = lazy(() => import('../admin/pages/BusinessConsultationsAdmin'));
const StaysBookingsAdmin = lazy(() => import('../admin/pages/StaysBookingsAdmin'));
const RelocationProfilesAdmin = lazy(() => import('../admin/pages/RelocationProfilesAdmin'));
const UsersAdmin = lazy(() => import('../admin/pages/UsersAdmin'));
const AnalyticsAdmin = lazy(() => import('../admin/pages/AnalyticsAdmin'));

<Route path="/admin/transport" element={<TransportBookingsAdmin />} />
<Route path="/admin/experiences" element={<ExperienceBookingsAdmin />} />
<Route path="/admin/business" element={<BusinessConsultationsAdmin />} />
<Route path="/admin/stays" element={<StaysBookingsAdmin />} />
<Route path="/admin/relocation" element={<RelocationProfilesAdmin />} />
<Route path="/admin/concierge" element={<AdminConciergeQueue />} />
<Route path="/admin/users" element={<UsersAdmin />} />
<Route path="/admin/analytics" element={<AnalyticsAdmin />} />
```

---

## Common Admin Table Component

Avoid duplicating table UI. Create or reuse:
```
src/admin/components/
  AdminDataTable.tsx      ← generic sortable/filterable table
  AdminStatusBadge.tsx    ← status color chip
  AdminActionMenu.tsx     ← row action dropdown
  AdminDetailModal.tsx    ← generic detail drawer
  AdminStatCard.tsx       ← KPI metric card
```

---

## Acceptance Criteria

- [ ] Admin sidebar shows all 8 new sections
- [ ] Transport bookings list loads from Supabase `transport_bookings`
- [ ] Experience bookings list loads from Supabase `experience_bookings`
- [ ] Business consultations list loads from Supabase
- [ ] Stays bookings list loads from Supabase
- [ ] Relocation profiles list loads with workflow progress
- [ ] Concierge requests have assignment + quote workflow
- [ ] User management shows all registered users with tier badge
- [ ] Analytics shows real aggregate queries
- [ ] All admin pages behind `<AdminGuard>`
