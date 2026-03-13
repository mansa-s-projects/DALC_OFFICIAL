# DALC Database Schema

## Overview

DALC uses Supabase (hosted PostgreSQL) as its single backend. The schema is organized into 6 SQL files:

| File | Layer | Tables |
|------|-------|--------|
| `supabase/schema.sql` | Core | `profiles`, `suppliers`, `venues`, `requests`, `request_status_log` |
| `supabase/migrations/experiences_001_schema.sql` | Experiences | `experience_services`, `experience_bookings` |
| `supabase/migrations/transport_001_schema.sql` | Transport | `transport_services`, `transport_bookings` |
| `supabase/migrations/stays_001_schema.sql` | Stays | `stays_properties`, `stays_availability`, `stays_bookings` |
| `supabase/migrations/business_001_schema.sql` | Business | `business_services`, `business_consultations`, `business_bookings` |
| `supabase/migrations/relocation_001_schema.sql` | Relocation | `relocation_profiles`, `user_workflows`, `user_workflow_steps`, `user_documents`, `relocation_cost_estimates` |

**Total: 20 tables**

---

## Entity Relationship Overview

```
auth.users (Supabase managed)
  └── profiles (1:1) ← extended user profile

profiles
  ├── requests (1:many) ← concierge requests
  ├── relocation_profiles (1:1) ← relocation data
  │     ├── user_workflows (1:many)
  │     │     └── user_workflow_steps (1:many)
  │     ├── user_documents (1:many)
  │     └── relocation_cost_estimates (1:many)
  ├── experience_bookings (1:many)
  ├── transport_bookings (1:many)
  ├── stays_bookings (1:many)
  ├── business_bookings (1:many)
  └── business_consultations (1:many)

suppliers (service providers)
  ├── experience_services (1:many)
  ├── transport_services (1:many)
  ├── stays_properties (1:many)
  └── business_services (1:many)

venues (discovery catalogue)
  └── requests (1:many, optional link)

experience_services
  └── experience_bookings (1:many)

transport_services
  └── transport_bookings (1:many)

stays_properties
  ├── stays_availability (1:many, per-date calendar)
  └── stays_bookings (1:many)

business_services
  ├── business_consultations (1:many)
  └── business_bookings (1:many)
```

---

## Core Tables (`schema.sql`)

### `profiles`
Extends `auth.users` with DALC-specific profile data. Auto-created on user registration via `handle_new_user()` trigger.

```sql
id              UUID PRIMARY KEY (references auth.users)
full_name       TEXT
avatar_url      TEXT
phone           TEXT
nationality     TEXT
skills          TEXT[]          -- UserSkill enum values
relocation_stage TEXT           -- UserStage enum value
tier            TEXT DEFAULT 'standard'   -- standard|gold|platinum|black
role            TEXT DEFAULT 'user'        -- user|concierge|admin
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

**Indexes:** `profiles_role_idx` on `role`

### `suppliers`
Registered service providers / vendors.

```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES profiles(id)
company_name    TEXT NOT NULL
category        TEXT NOT NULL          -- nightlife|experiences|transport|stays|business
description     TEXT
website         TEXT
phone           TEXT
email           TEXT
commission_rate DECIMAL(5,2) DEFAULT 15.00
status          TEXT DEFAULT 'pending' -- pending|active|suspended
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### `venues`
Curated venue catalogue — discovery touchpoints for concierge requests.

```sql
id              UUID PRIMARY KEY
supplier_id     UUID REFERENCES suppliers(id)
name            TEXT NOT NULL
slug            TEXT UNIQUE NOT NULL
category        TEXT NOT NULL
subcategory     TEXT
description     TEXT
short_description TEXT
images          TEXT[]
price_tier      TEXT               -- $|$$|$$$|$$$$
min_spend       DECIMAL(10,2)
tags            TEXT[]
coordinates     JSONB              -- { lat, lng }
address         TEXT
website         TEXT
phone           TEXT
open_days       TEXT[]
opening_time    TIME
closing_time    TIME
is_published    BOOLEAN DEFAULT false
is_featured     BOOLEAN DEFAULT false
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

**Indexes:** `venues_category_idx`, `venues_slug_idx`, `venues_published_idx`

### `requests`
Concierge requests submitted by users.

```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES profiles(id)
venue_id        UUID REFERENCES venues(id)   -- optional link
request_type    TEXT
description     TEXT NOT NULL
preferred_date  DATE
preferred_time  TIME
party_size      INT
budget_range    TEXT
status          TEXT DEFAULT 'pending'        -- pending|assigned|active|quoted|confirmed|completed|cancelled
assignee_id     UUID REFERENCES profiles(id)  -- concierge assigned
quote_amount    DECIMAL(10,2)
quote_details   TEXT
special_requirements TEXT
internal_notes  TEXT
source_pillar   TEXT
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

**Indexes:** `requests_user_id_idx`, `requests_status_idx`, `requests_created_at_idx`

### `request_status_log`
Auto-populated audit trail for all request status changes.

```sql
id              UUID PRIMARY KEY
request_id      UUID REFERENCES requests(id)
old_status      TEXT
new_status      TEXT NOT NULL
changed_by      UUID REFERENCES profiles(id)
notes           TEXT
created_at      TIMESTAMPTZ
```

---

## Auto-Triggers

### 1. Profile Creation Trigger
```sql
CREATE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

### 2. `updated_at` Trigger
Applied to all tables via `update_updated_at_column()` function. Fires on every `UPDATE` and sets `updated_at = NOW()`.

### 3. Request Status Audit Trigger
```sql
CREATE FUNCTION log_request_status_change()
RETURNS trigger AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO public.request_status_log (request_id, old_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_request_status_change
  AFTER UPDATE ON public.requests
  FOR EACH ROW EXECUTE PROCEDURE log_request_status_change();
```

---

## Row Level Security (RLS)

RLS is enabled on **all tables**. Key policies:

| Table | Read Policy | Write Policy |
|-------|-------------|--------------|
| `profiles` | Own row | Own row |
| `suppliers` | Authenticated | Own row |
| `venues` | Published (all), Any (admin) | Admin only |
| `requests` | Own requests | Own + admin/concierge |
| `experience_services` | Published (all) | Admin + owner supplier |
| `experience_bookings` | Own bookings | Own + admin |
| `transport_services` | Published (all) | Admin + owner supplier |
| `transport_bookings` | Own bookings | Own + admin |
| `stays_properties` | Published (all) | Admin + owner supplier |
| `stays_bookings` | Own bookings + relocation_linked | Own + admin |
| `business_services` | Published (all) | Admin + owner supplier |
| `business_bookings` | Own bookings | Own + admin |
| `relocation_profiles` | Own profile | Own + admin/concierge |
| `user_workflows` | Own workflows | Own + admin/concierge |
| `user_documents` | Own documents | Own + admin/concierge (verify) |

**Admin bypass:** All tables have a policy: `auth.jwt() ->> 'role' = 'admin'` enables full read/write.

---

## Common Patterns

### Booking Status Machine (all verticals)
```
pending → confirmed → active → completed | cancelled | refunded
```

### Soft Delete
No hard deletes on bookings or requests. Status field handles all lifecycle states.

### JSONB Convention
Flexible structured data (specs, pricing tiers, workflows, coordinates) is stored as JSONB. All JSONB fields are validated at the application layer (TypeScript types).

### Slug Convention
All service tables have a `slug TEXT UNIQUE NOT NULL` field. Slugs are kebab-case, human-readable, URL-safe identifiers generated from service titles.

---

## Vertical Table Quick Reference

### Experiences
- `experience_services` — service catalogue (7 subcategories)
- `experience_bookings` — ticket-based bookings with `DALC-XXXX-XXXX` code

### Transport
- `transport_services` — vehicle/vessel/aircraft catalogue
- `transport_bookings` — time-based bookings with pickup/dropoff

### Stays
- `stays_properties` — property catalogue (hotels/villas/residences)
- `stays_availability` — per-date calendar with price overrides
- `stays_bookings` — date range bookings with pricing breakdown

### Business
- `business_services` — service catalogue (5 subcategories)
- `business_consultations` — scheduled consultations
- `business_bookings` — service engagements with workflow tracking

### Relocation
- `relocation_profiles` — user relocation intent + metadata
- `user_workflows` — multi-step workflow containers
- `user_workflow_steps` — individual steps with status
- `user_documents` — uploaded document tracking
- `relocation_cost_estimates` — budget line items

---

## Related Documentation

- [Categories](categories.md)
- [Venues](venues.md)
- [Experiences](experiences.md)
- [Suppliers](suppliers.md)
- [Bookings](bookings.md)
- [User Accounts](../platform/user-accounts.md)
