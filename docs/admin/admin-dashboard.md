# Admin Dashboard

## Overview

The Admin Dashboard provides DALC staff with tools to manage venues, suppliers, requests, services, and platform configuration. It is protected by the `AdminGuard` component, which restricts access to users with `role: 'admin'` or `role: 'concierge'`.

---

## Access Control

### Roles with Admin Access
| Role | Level | Access |
|------|-------|--------|
| `admin` | Full | All admin routes + operations |
| `concierge` | Limited | Request management + venue view only |
| `user` | None | Redirected to `/` |

### AdminGuard Component

`src/components/auth/AdminGuard.tsx`

```typescript
function AdminGuard({ children }: { children: ReactNode }) {
  const { profile } = useAppStore();
  if (!profile) return <Navigate to="/login" replace />;
  if (!['admin', 'concierge'].includes(profile.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
```

All `/admin/*` routes are wrapped with `<AdminGuard>` in `src/app/router.tsx`.

---

## Admin Route Structure

```
/admin                    → AdminLayout (shell + sidebar)
  /admin/overview         → AdminOverview (metrics + activity)
  /admin/requests         → AdminRequests (request queue management)
  /admin/venues           → AdminVenues (venue catalogue)
  /admin/venues/new       → AdminVenueForm (create)
  /admin/venues/:id       → AdminVenueForm (edit)
  /admin/suppliers        → AdminSuppliers (supplier registry)
  /admin/suppliers/new    → AdminSupplierForm (create)
  /admin/suppliers/:id    → AdminSupplierForm (edit)
```

Future admin routes:
```
  /admin/experiences      → AdminExperiences
  /admin/transport        → AdminTransport
  /admin/stays            → AdminStays
  /admin/business         → AdminBusiness
  /admin/users            → AdminUsers
  /admin/analytics        → AdminAnalytics
```

---

## AdminLayout Shell

`src/pages/admin/AdminLayout.tsx`

- Left sidebar with navigation links
- Top header with admin user info + quick actions
- `<Outlet />` for nested route content
- Mobile: collapsible sidebar (hamburger toggle)

### Sidebar Navigation
```
Dashboard Overview
  ├── Requests
  ├── Venues
  ├── Suppliers
  ── ── (coming soon) ──
  ├── Experiences
  ├── Transport & Stays
  ├── Business
  ├── Relocation
  ├── Users
  └── Analytics
```

---

## AdminOverview

`src/pages/admin/AdminOverview.tsx`

Current: Static placeholder metrics.

Target metrics displayed:

### Real-time Stats (top row)
| Metric | Source | Refresh |
|--------|--------|---------|
| Open Requests | `COUNT(requests WHERE status IN ('pending','assigned'))` | Real-time |
| Today's Bookings | All booking tables WHERE `created_at > today` | 5 min |
| Active Users | Sessions (Supabase Auth) | 1 hr |
| Pending Suppliers | `COUNT(suppliers WHERE status = 'pending')` | On load |

### Charts (future)
- Booking volume by vertical (last 30 days)
- Revenue by vertical (last 30 days)
- Request resolution time trend
- New user signups

### Activity Feed
Recent events:
- New request submitted
- Supplier approved
- Venue published
- Booking confirmed

---

## AdminRequests

`src/pages/admin/AdminRequests.tsx`

Full request queue management.

### Features
- Paginated table of all requests
- Filter by status: `pending | assigned | active | quoted | confirmed | completed | cancelled`
- Search by user name or request description
- Click row → expandable detail panel
- Assign concierge staff to request
- Update request status
- Add internal notes
- View `request_status_log` audit trail

### Concierge-Only Access
Users with `role = 'concierge'` can:
- ✅ View request queue
- ✅ Assign themselves to a request
- ✅ Update request status
- ❌ Cannot create/edit venues or suppliers

---

## AdminVenues

`src/pages/admin/AdminVenues.tsx`

Venue catalogue with full CRUD.

### Features
- Paginated list of all venues (including unpublished)
- Filter by category, published status, featured status
- Toggle `is_published` inline (flip switch)
- Toggle `is_featured` inline
- Edit full venue details
- Delete venue (soft delete or permanent — admin only)

See [Admin Venues](admin-venues.md) for full detail.

---

## AdminSuppliers

`src/pages/admin/AdminSuppliers.tsx`

Supplier management and onboarding review.

### Features
- Paginated list of all suppliers
- Filter by status, category
- Approve supplier (`pending → active`)
- Suspend supplier (`active → suspended`)
- Edit commission rate
- View supplier's service listings

See [Admin Suppliers](admin-suppliers.md) for full detail.

---

## Admin Data Access Patterns

All admin queries bypass the `is_published` RLS filter:
```sql
-- Admin RLS bypass (profiles.role = 'admin')
CREATE POLICY "Admin full access" ON venues
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

Admin sees:
- All venues including unpublished drafts
- All bookings (all users)
- All requests (all users)
- All supplier profiles (pending, active, suspended)

---

## Hooks Used in Admin

| Hook | File | Purpose |
|------|------|---------|
| `useAdmin` | `hooks/useAdmin.ts` | Admin state + permissions check |
| `useRequests` | `hooks/useRequests.ts` | Request queue data + mutations |
| `useVenues` | `hooks/useVenues.ts` | Venue list (admin: all) |
| `useVenue` | `hooks/useVenue.ts` | Single venue detail + edit |
| `useSuppliers` | `hooks/useSuppliers.ts` | Supplier list + mutations |

---

## Scalability Notes

- **Real-time alerts:** Use Supabase Realtime to push new request notifications to admin users without page reload.
- **Role expansion:** Add `super_admin` role with global access + `finance` role for revenue/payout-only access.
- **Audit logging:** Add an `admin_audit_log` table — all admin mutations (create/update/delete) are logged with `admin_id`, `action`, `resource`, `old_value`, `new_value`.
- **Bulk operations:** Add batch status update for requests (select multiple → mark as completed).
- **Analytics dashboard:** Integrate an analytics page with Chart.js or Recharts showing booking trends, revenue by vertical, user acquisition, and request SLA metrics.
