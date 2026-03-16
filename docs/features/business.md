# Feature: Business

## Purpose

The Business feature provides end-to-end business establishment services in Dubai. It covers company formation, licensing, banking, tax compliance, and residency-investment workflows. The product route is `/business`, while the underlying feature slice remains `src/features/business/`.

---

## Architecture

### Pages
| Page | Route | Component |
|------|-------|-----------|
| Hub | `/business` | `src/pages/business/BusinessHub.tsx` |
| Subcategory List | `/business/:subcategory` | `src/features/business/pages/SubcategoryList.tsx` |
| Service Detail | `/business/:subcategory/:slug` | `src/features/business/pages/ServiceDetail.tsx` |
| Consultation | `/business/consultation/:id` | `src/pages/business/ConsultationPage.tsx` |

### Components
| Component | File | Purpose |
|-----------|------|---------|
| `ComplianceChecklist` | `src/features/business/components/ComplianceChecklist.tsx` | Compliance tracker |
| `ConsultationScheduler` | `src/features/business/components/ConsultationScheduler.tsx` | Consultation booking |
| `DocumentRequirements` | `src/features/business/components/DocumentRequirements.tsx` | Required documents |
| `ProcessTimeline` | `src/features/business/components/ProcessTimeline.tsx` | Workflow timeline |

### Hooks
| Hook | Purpose |
|------|---------|
| `useBusiness` (`src/features/business/hooks/useBusiness.ts`) | Fetch and filter services |
| `useBusinessBooking` (`src/features/business/hooks/useBusinessBooking.ts`) | Create + manage bookings |
| `useConsultation` (`src/features/business/hooks/useConsultation.ts`) | Schedule + track consultations |

### Service Library
`src/lib/business.ts` — `MOCK_BUSINESS_SERVICES`, `getBusinessServices()`, `getFeaturedServices()`, `getServiceBySlug()`, `createBusinessBooking()`, `scheduleConsultation()`, `getAvailableSlots()`, `getComplianceChecklist()`, `updateComplianceItem()`.

### Types
`src/features/business/types.ts` — Full business type definitions. Re-exported via shim at `src/types/business.ts`.

---

## Subcategories (5)

| Subcategory | DB Value | Key Services |
|-------------|----------|--------------|
| Company Formation | `company-formation` | DMCC Free Zone Package, Mainland LLC, DIFC SPV |
| Licensing | `licensing` | Trade license, professional license, renewals |
| Banking | `banking` | Corporate account setup, multi-currency, payment gateway |
| Tax | `tax` | VAT registration, VAT filing, corporate tax compliance |
| Residency Investment | `residency-investment` | Golden Visa, Investor Visa, Retirement Visa |

---

## User Flows

### Flow 1: Discovery -> Booking

```
User lands on /business
  -> 5 service category cards
  -> Featured services grid
  -> "Book Free Consultation" CTA

User clicks a category
  -> /business/:subcategory
  -> Service cards with pricing model, timeline, and includes

User clicks a service
  -> /business/:subcategory/:slug
  -> Full description, timeline, document requirements, compliance checklist
  -> "Book This Service" CTA
```

### Flow 2: Consultation Booking

```
User clicks consultation CTA
  -> ConsultationScheduler opens
  -> getAvailableSlots() loads availability
  -> User selects date, time, and meeting type
  -> scheduleConsultation(input) creates consultation record
```

---

## Pricing Models

| Model | DB Value | Description |
|-------|----------|-------------|
| Fixed | `fixed` | Set price |
| Starting From | `starting_from` | Base price, final quote depends on scope |
| Custom Quote | `custom_quote` | Requires consultation |
| Hourly | `hourly` | Advisory billing |

---

## Database Schema

### `business_services`
```sql
id, supplier_id, subcategory, service_type, title, slug,
description, short_description, images (text[]), pricing_model,
base_price, currency, timeline_days, includes (text[]),
compliance_checklist (JSONB), workflow_template (JSONB),
consultation_required, free_consultation_available,
is_published, is_featured, tags (text[]), created_at, updated_at
```

### `business_consultations`
```sql
id, service_id, user_id, consultant_id, consultation_type,
meeting_type, scheduled_at, duration_minutes, meeting_link,
meeting_address, status, notes, created_at, updated_at
```

### `business_bookings`
```sql
id, service_id, user_id, booking_reference, status,
workflow_id, workflow_status, current_step, total_steps,
documents_submitted, compliance_completed, total_amount, currency,
payment_status, payment_method, relocation_profile_id, notes,
created_at, updated_at
```

---

## Naming Note

- Product/route name: **Business** (`/business`)
- Feature slice name: **Business Setup** / `src/features/business/`
- This doc is named `business.md` to align with current route and page naming.