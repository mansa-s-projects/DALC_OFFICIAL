# Feature: Business Setup

## Purpose

The Business Setup feature provides end-to-end business establishment services in Dubai. It covers company formation across all jurisdictions (mainland, free zones, offshore), trade licensing, corporate banking, tax compliance, and investment visa applications. It is the platform's highest-value transaction category with services ranging from AED 5,000 to AED 50,000+.

---

## Architecture

### Pages
| Page | Route | Component |
|------|-------|-----------|
| Hub | `/business` | `src/features/business/pages/BusinessHub.tsx` |
| Subcategory List | `/business/:subcategory` | `src/features/business/pages/SubcategoryList.tsx` |
| Service Detail | `/business/:subcategory/:slug` | `src/features/business/pages/ServiceDetail.tsx` |
| Consultation | `/business/consultation/:id` | `src/features/business/pages/ConsultationPage.tsx` |

### Business-Specific Components
| Component | File | Purpose |
|-----------|------|---------|
| `ComplianceChecklist` | `src/features/business/components/ComplianceChecklist.tsx` | Document/action compliance tracker |
| `ConsultationScheduler` | `src/features/business/components/ConsultationScheduler.tsx` | Calendar-based consultation booking |
| `DocumentRequirements` | `src/features/business/components/DocumentRequirements.tsx` | Required documents list per service |
| `ProcessTimeline` | `src/features/business/components/ProcessTimeline.tsx` | Visual timeline for service workflow |

> **Note:** These components also exist at `src/components/business/` (legacy path kept for shared component usage).

### Hooks
| Hook | Purpose |
|------|---------|
| `useBusiness` (`src/features/business/hooks/useBusiness.ts`) | Fetch and filter business services |
| `useBusinessBooking` (`src/features/business/hooks/useBusinessBooking.ts`) | Create + manage service bookings |
| `useConsultation` (`src/features/business/hooks/useConsultation.ts`) | Schedule + track consultations |

### Service Library
`src/lib/business.ts` — `MOCK_BUSINESS_SERVICES` (5 services), `getBusinessServices()`, `getFeaturedServices()`, `getServiceBySlug()`, `createBusinessBooking()`, `scheduleConsultation()`, `getAvailableSlots()`, `getComplianceChecklist()`, `updateComplianceItem()`.

### Types
`src/features/business/types.ts` — Full TypeScript definitions for all business entities. Re-exported via shim at `src/types/business.ts`.

---

## Subcategories (5)

| Subcategory | DB Value | Key Services |
|-------------|----------|--------------|
| Company Formation | `company-formation` | DMCC Free Zone Package, Mainland LLC, DIFC SPV, Offshore RAK |
| Licensing | `licensing` | Trade license, professional license, activity amendment, license renewal |
| Banking | `banking` | Corporate bank account setup, multi-currency, payment gateway |
| Tax | `tax` | VAT registration, VAT filing, corporate tax compliance, deregistration |
| Residency Investment | `residency-investment` | Golden Visa (10yr), Investor Visa (3yr), Property-linked Visa, Retirement Visa |

---

## User Flows

### Flow 1: Service Discovery → Booking

```
User lands on /business (hub)
  → Stats: 3,000+ companies formed, 98% approval rate, 15+ years, 50+ free zones
  → 5 service category cards
  → Featured services from useFeaturedBusinessServices()
  → "Book Free Consultation" CTA

User clicks "Company Formation"
  → /business/company-formation → SubcategoryList
  → Service cards: DMCC, Mainland LLC, DIFC, etc.
  → Each card shows: pricing model, timeline, key includes

User clicks "DMCC Free Zone Package"
  → /business/company-formation/dmcc-free-zone-package → ServiceDetail
  → Full description, what's included, compliance requirements
  → ProcessTimeline component: shows workflow steps visually
  → DocumentRequirements: lists required documents
  → ComplianceChecklist: tracks completion of pre-requisites
  → "Book This Service" CTA → createBusinessBooking()
```

### Flow 2: Free Consultation Booking

```
User lands on BusinessHub
  → "Book Free Session" button at top
  → ConsultationScheduler component opens
  → getAvailableSlots(consultantId, type='initial') returns available slots
  → User selects date + time slot
  → Selects meeting type: video / in_person / phone
  → scheduleConsultation(input) creates business_consultations record
  → Confirmation: slot reserved
  → Reminder notification sent before appointment
```

### Flow 3: Compliance Workflow Tracking

```
User has active business_bookings record (status: in_progress)
  → Views compliance checklist on ServiceDetail or booking detail
  → getComplianceChecklist(serviceId) loads items from service's compliance_checklist JSONB
  → Items displayed with status: pending / complete
  → User marks item complete: updateComplianceItem(bookingId, itemId, true)
  → Progress bar updates
  → When all items complete → booking workflow advances to next step
```

---

## Pricing Models

| Model | DB Value | Description |
|-------|----------|-------------|
| Fixed | `fixed` | Set price (e.g., AED 15,000 for DMCC package) |
| Starting From | `starting_from` | Base price, final quote depends on requirements |
| Custom Quote | `custom_quote` | Requires consultation before pricing |
| Hourly | `hourly` | For advisory/consulting hours |

---

## Consultation System

### Consultation Types
| Type | DB Value | Description |
|------|----------|-------------|
| Initial | `initial` | First discovery call — usually free |
| Follow-up | `follow_up` | Progress review call |
| Document Review | `document_review` | Review submitted documents |
| Signing | `signing` | Final contract / registration signing |

### Meeting Formats
`video` | `in_person` | `phone`

### Slot Availability
`getAvailableSlots()` in `src/lib/business.ts` generates slots Mon-Fri 09:00–17:00 (1-hour blocks), excluding already-booked slots from `business_consultations`.

### Consultation Statuses
`scheduled → confirmed → completed | cancelled | no_show`

---

## Workflow Engine (Business Bookings)

When a business service booking is created (`createBusinessBooking()`):
1. A `user_workflows` record is created with the service's `workflow_template` JSONB
2. `user_workflow_steps` are created from the template steps array
3. Workflow is linked to the booking via `workflow_id`

Workflow steps vary by service type. Example for DMCC Free Zone:
1. Submit required documents
2. Initial application review (2-3 days)
3. Trade name approval
4. License application submission
5. License issuance + company registration
6. Open corporate bank account
7. Visa applications (owner + employees)
8. Emirates ID registration

---

## Database Schema

### `business_services`
```sql
id, supplier_id, subcategory, service_type, title, slug,
description, short_description, images (text[]), pricing_model,
base_price, currency, timeline_days, includes (text[]),
compliance_checklist (JSONB), workflow_template (JSONB),
consultation_required, free_consultation_available,
is_published, is_featured, tags (text[]),
created_at, updated_at
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
documents_submitted, compliance_completed,
total_amount, currency, payment_status, payment_method,
relocation_profile_id, notes, created_at, updated_at
```

---

## Mock Data (5 seeded services)

| Service | Subcategory | Price |
|---------|-------------|-------|
| DMCC Free Zone Package | company-formation | AED 18,500 (fixed) |
| Dubai Mainland LLC | company-formation | from AED 12,000 |
| Corporate Banking Setup | banking | custom_quote |
| Golden Visa Application | residency-investment | AED 9,500 (fixed) |
| VAT Registration & Compliance | tax | AED 2,500 (fixed) |

---

## Integration with Move to Dubai

Business Setup integrates deeply with the Move to Dubai feature:
- `business_bookings.relocation_profile_id` links a service booking to a relocation profile
- Booking a "Company Formation" service can auto-complete the "Company Formation" step in the user's relocation workflow
- The `BusinessHub` surface shows relocation-status-aware CTAs (e.g., "Your relocation profile shows you need a company — here's how we help")

---

## Scalability Notes

- **Partner network:** Each service can be delivered by a different partner law firm / consultancy. Add `supplier_id` routing logic to assign the right partner based on service type and user location.
- **Document upload integration:** Add file upload to compliance checklist items — users upload documents against specific checklist line items, reviewed by concierge team.
- **E-signature:** Integrate DocuSign or similar for remote signing of incorporation documents.
- **Government API integration:** Direct integration with UAE government portals (DMCC portal, DED online, GDRFA) for automated status tracking.
- **Multi-city expansion:** Abu Dhabi (ADGM), Sharjah, and other UAE free zones can be added as subcategory options without structural changes.
