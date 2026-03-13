# DALC Platform Pillars

This document defines the 7 core pillars of Dubai À La Carte in full detail — covering purpose, user personas, subcategories, key pages, database anchors, and nav priority.

> **Strategic Rule:** Move to Dubai is always Pillar #1. Navigation order must reflect this priority at all times.

---

## Pillar Priority Order (Nav)

```
1. Move to Dubai      ← primary CTA pillar
2. Experiences
3. Nightlife
4. Stays
5. Transport
6. Business Setup
7. Concierge
```

---

## Pillar 1 — Move to Dubai

**Route:** `/move-to-dubai`
**Hub Page:** `src/features/move-to-dubai/pages/MoveToDubai.tsx`
**Priority Level:** Maximum — platform's core differentiator

### Purpose
Guide individuals through the full relocation lifecycle: from initial intent and visa planning through to company formation, banking, accommodation, school, and Emirates ID. DALC provides personalized roadmaps, document tracking, cost estimation, and workflow status dashboards.

### User Personas
| Persona | Description |
|---------|-------------|
| Business Founder | UK/EU/US entrepreneur seeking tax-efficient residency via company formation |
| Professional Relocatee | Individual relocating for employment, needs housing + visa support |
| Golden Visa Investor | HNW individual seeking 10-year residency via property or investment |
| Family Relocation | Couple with children needing schools, healthcare, and full setup |
| Retiree | Seeking retirement visa and luxury lifestyle |

### Relocation Purposes (DB Enum)
`employment` | `business` | `retirement` | `family` | `investment`

### Key Pages
| Page | Route | Component | Auth |
|------|-------|-----------|------|
| Hub | `/move-to-dubai` | `MoveToDubai.tsx` | Public |
| Intake | `/move-to-dubai/intake` | `Intake.tsx` | Required |
| Dashboard | `/move-to-dubai/dashboard` | `Dashboard.tsx` | Required |
| Documents | `/move-to-dubai/documents` | `Documents.tsx` | Required |
| Cost Estimator | `/move-to-dubai/cost` | `CostEstimator.tsx` | Required |

### Workflow Engine
On intake completion, a default workflow is generated based on `RelocationPurpose`. Each purpose produces different default steps:
- **Business:** Documents → Visa Application → Company Formation → Banking → Accommodation → School → Insurance → Emirates ID
- **Employment:** Documents → Work Permit → Accommodation → School → Healthcare → Emirates ID
- **Retirement:** Documents → Retirement Visa → Banking → Accommodation → Healthcare → Emirates ID

### Database Tables
`relocation_profiles` · `user_workflows` · `user_workflow_steps` · `user_documents` · `relocation_cost_estimates`

### Hooks
`useRelocation` · `useRelocationDocs` · `useRelocationCost`

### Scalability Notes
- Multi-city: Replace hardcoded "Dubai" references with `city_id` at the profile level
- Add AI-powered roadmap personalization based on profile data
- Add partner integrations (law firms, free zones, banks) as bookable services within workflows

---

## Pillar 2 — Experiences

**Route:** `/experiences`
**Hub Page:** `src/features/experiences/pages/ExperiencesHub.tsx`
**Priority Level:** High — biggest content catalogue

### Purpose
Discover and book unique activities across Dubai. Covers the full spectrum from adrenaline adventures to cultural tours to Michelin-star dining experiences. Requests are handled by the DALC concierge system.

### Subcategories (7)
| Subcategory | DB Value | Key Examples |
|-------------|----------|--------------|
| Nightlife | `nightlife` | White Dubai, Aura Skypool, Caviar & Champagne |

> **Architecture note:** Nightlife is elevated to **Pillar 3** — it has its own feature slice (`src/features/nightlife/`) and routes (`/nightlife/*`). The nightlife subcategory in `experience_services` is reachable via `/experiences/nightlife/:slug` but the primary UX entry point is the dedicated Nightlife hub.
| Adventure | `adventure` | Desert safari, quad biking, indoor skydiving |
| Dining | `dining` | Chef's tables, Tresind Studio, private dining |
| Water | `water` | Shark safari, wakeboarding, flyboarding, scuba |
| Sky | `sky` | Helicopter tours, skydiving, paragliding |
| Wellness | `wellness` | Hammam, spa retreats, mindfulness yoga |
| Culture | `culture` | Heritage walks, Dubai Art Season, museum tours |

### Sub-subcategories (Selected)
Each subcategory has further specificity:
- **Nightlife:** nightclub, rooftop-bar, beach-club, supper-club, cabaret
- **Water:** scuba-diving, snorkeling, wakeboarding, jet-ski, flyboard, boat-cruise
- **Sky:** helicopter-tour, skydiving, paragliding, hot-air-balloon
- **Dining:** chefs-table, tasting-menu, private-dining, celebrity-chef, cooking-class

### Pricing Models
`per_person` | `per_group` | `fixed` | `tiered` | `free`

Tiered pricing supports multi-tier structures (e.g., Standard AED 500 / VIP AED 1,200 / Ultra VIP AED 3,500).

### Booking System
- Ticket-based bookings with unique codes: `DALC-XXXX-XXXX`
- Time slot management (day + start/end time + capacity per slot)
- Capacity tracking: `max_capacity` vs `current_bookings`
- Service types: `event` | `recurring` | `on_demand` | `seasonal`

### Key Pages
| Page | Route | Component |
|------|-------|-----------|
| Hub | `/experiences` | `ExperiencesHub.tsx` |
| Subcategory | `/experiences/:subcategory` | `SubcategoryList.tsx` |
| Detail | `/experiences/:subcategory/:slug` | `ExperienceDetail.tsx` |

### Database Tables
`experience_services` · `experience_bookings`

### Hooks
`useExperiences` · `useExperienceBooking`

---

## Pillar 3 — Nightlife

**Route:** `/nightlife`
**Hub Page:** `src/features/nightlife/pages/NightlifeHub.tsx`
**Priority Level:** High — Dubai's nightlife is a key acquisition hook

### Purpose
Surface Dubai's most exclusive clubs, beach clubs, lounges, and entertainment venues as a first-class navigation entry. Despite being an experience subcategory in the database, Nightlife is elevated to a standalone pillar for UX and marketing prominence.

### Architecture Note
> Nightlife exists in two database locations:
> 1. **`venues`** table (category: `nightlife`) — curated venue profiles (NYX, Raspoutine, Soho Meydan)
> 2. **`experience_services`** table (subcategory: `nightlife`) — bookable nightlife experiences

### Venue Types
- **Nightclubs** — NYX DIFC, Raspoutine, Soho Meydan
- **Rooftop Bars** — Aura Skypool, Level 43, Zero Gravity
- **Beach Clubs** — Nikki Beach, Cove Beach, White Beach
- **Supper Clubs** — Caviar & Champagne dining experiences
- **Cabaret** — Entertainment dining with live performance

### Current Routes
| Route | Component | Location |
|-------|-----------|----------|
| `/nightlife` | `NightlifeHub` | `src/features/nightlife/pages/NightlifeHub.tsx` |
| `/nightlife/clubs` | `NightClubs` | `src/features/nightlife/pages/NightClubs.tsx` |
| `/nightlife/beach-clubs` | `BeachClubs` | `src/features/nightlife/pages/BeachClubs.tsx` |
| `/nightlife/restaurants` | `Restaurants` | `src/features/nightlife/pages/Restaurants.tsx` |
| `/nightlife/dining` | `DiningEntertainment` | `src/features/nightlife/pages/DiningEntertainment.tsx` |

### Database Tables
`venues` (category: `nightlife`) · `experience_services` (subcategory: `nightlife`)

---

## Pillar 4 — Stays

**Route:** `/stays`
**Hub Page:** `src/features/stays/pages/StaysHub.tsx`

### Purpose
Book luxury accommodation in Dubai — from iconic 5-star hotels to private Palm villas to long-term branded residences, including relocation-linked long stays.

### Subcategories (3)
| Subcategory | DB Value | Examples |
|-------------|----------|----------|
| Hotels | `hotels` | Burj Al Arab, Armani Hotel, Atlantis The Royal |
| Villas | `villas` | Palm Jumeirah private villas, Emirates Hills estates |
| Residences | `residences` | Downtown branded apartments, Marina long-stay |

### Pricing Models
`nightly` | `monthly` | `yearly` | `flexible`

Seasonal pricing via `stays_properties.seasonal_pricing` (JSONB array with multipliers by date range).

### Availability System
`stays_availability` table stores per-date records with individual price overrides. `checkAvailability()` validates date ranges against this calendar. `calculatePrice()` applies seasonal multipliers + service fees + security deposits.

### Booking Types
`short_term` | `long_term` | `relocation`

Relocation-linked bookings link to `relocation_profiles` via `relocation_profile_id`, enabling accommodation to appear as a completed workflow step.

### Key Pages
| Page | Route | Component |
|------|-------|-----------|
| Hub | `/stays` | `StaysHub.tsx` |
| Hotels | `/stays/hotels` | `HotelsList.tsx` |
| Villas | `/stays/villas` | `VillasList.tsx` |
| Residences | `/stays/residences` | `ResidencesList.tsx` |
| Detail | `/stays/:subcategory/:slug` | `PropertyDetail.tsx` |

### Database Tables
`stays_properties` · `stays_availability` · `stays_bookings`

### Hooks
`useStays` · `useStaysBooking`

---

## Pillar 5 — Transport

**Route:** `/transport`
**Hub Page:** `src/features/transport/pages/TransportHub.tsx`

### Purpose
Book luxury and exotic transport in Dubai: self-drive supercars, chauffeured sedans, private yacht charters, and private jet bookings.

### Subcategories (3)
| Subcategory | DB Value | Examples |
|-------------|----------|----------|
| Cars | `cars` | Rolls-Royce Ghost, Lamborghini Huracán, Range Rover |
| Yachts | `yachts` | 85ft day yacht, 120ft superyacht |
| Jets | `jets` | Gulfstream G650, helicopter tours |

### Specification System
Each transport service uses a JSONB `specifications` field for type-specific data:
- **Cars:** `{ make, model, year, seats, transmission, horsepower }`
- **Yachts:** `{ length_ft, cabins, crew_size, max_guests, amenities }`
- **Jets:** `{ aircraft_type, range_nm, seats, max_altitude, baggage_kg }`

### Pricing Models
`hourly` | `daily` | `fixed` | `per_trip` | `custom`

### Availability Types
`on_demand` | `scheduled` | `seasonal` | `by_request`

Default: 24-hour advance booking required. Minimum booking: 1 hour (cars) / 4 hours (yachts) / TBC (jets).

### Legacy Routes (to redirect)
| Legacy | Target |
|--------|--------|
| `/transport/airport-transfer` | `/transport/cars?type=chauffeur` |
| `/transport/chauffeur` | `/transport/cars?type=chauffeur` |
| `/transport/private-aviation` | `/transport/jets` |

### Key Pages
| Page | Route | Component |
|------|-------|-----------|
| Hub | `/transport` | `TransportHub.tsx` |
| Cars | `/transport/cars` | `CarsList.tsx` |
| Yachts | `/transport/yachts` | `YachtsList.tsx` |
| Jets | `/transport/jets` | `JetsList.tsx` |
| Detail | `/transport/:subcategory/:slug` | `TransportDetail.tsx` |

### Database Tables
`transport_services` · `transport_bookings`

### Hooks
`useTransport` · `useTransportBooking`

---

## Pillar 6 — Business Setup

**Route:** `/business`
**Hub Page:** `src/features/business/pages/BusinessHub.tsx`

### Purpose
End-to-end business establishment services in Dubai: from choosing a jurisdiction and incorporating a company to opening corporate bank accounts, registering for tax, and obtaining investment visas.

### Subcategories (5)
| Subcategory | DB Value | Key Services |
|-------------|----------|--------------|
| Company Formation | `company-formation` | DMCC Free Zone, Mainland LLC, DIFC |
| Licensing | `licensing` | Trade license, professional license, activity amendments |
| Banking | `banking` | Corporate banking, multi-currency accounts, payment gateways |
| Tax | `tax` | VAT registration, VAT filing, corporate tax compliance |
| Residency Investment | `residency-investment` | Golden Visa, investor visa, property-linked residency |

### Pricing Models
`fixed` | `starting_from` | `custom_quote` | `hourly`

### Consultation System
Users can book free or paid consultations before committing to a full service. Consultation types: `initial` | `follow_up` | `document_review` | `signing`. Meeting formats: `video` | `in_person` | `phone`.

### Compliance Workflow
Each service defines a `compliance_checklist` (JSONB) of required documents and actions. On booking, a workflow is initialized in `user_workflows` with steps mapped from `workflow_template` JSONB on the service.

### Key Pages
| Page | Route | Component |
|------|-------|-----------|
| Hub | `/business` | `BusinessHub.tsx` |
| Subcategory | `/business/:subcategory` | `SubcategoryList.tsx` |
| Service Detail | `/business/:subcategory/:slug` | `ServiceDetail.tsx` |
| Consultation | `/business/consultation/:id` | `ConsultationPage.tsx` |

### Database Tables
`business_services` · `business_consultations` · `business_bookings`

### Hooks
`useBusiness` · `useBusinessBooking` · `useConsultation`

---

## Pillar 7 — Concierge

**Route:** `/concierge`
**Hub Page:** `src/pages/concierge/ConciergeHub.tsx`

### Purpose
DALC's white-glove service layer. When no pre-listed service meets the user's exact need, they submit a concierge request and a DALC team member takes end-to-end ownership — sourcing, quoting, and fulfilling the request.

### Use Cases
- Bespoke experience not listed on platform
- Last-minute venue reservation (same-day tables at Nobu, etc.)
- Private event planning (birthday party, corporate dinner)
- VIP table + bottle service arrangements
- Multi-day itinerary curation
- Any cross-pillar bespoke arrangement

### Request Flow
`User submits request → DALC receives notification → Concierge assigned → Status updates → Quote delivered → User approves → Fulfillment → Completion`

### Request Status Machine
`pending → assigned → active → completed | cancelled`

### Database Tables
`requests` · `request_status_log`

### Hooks
`useRequests`

### What's Built
1. `/concierge` hub page — `src/pages/concierge/ConciergeHub.tsx` ✅
2. `/concierge/request` — `ConciergeRequest.tsx` 4-step form ✅
3. `/request` legacy form — still accessible as fallback ✅

### Still To Build
1. Real-time request status updates (Supabase Realtime on `requests` table)
2. Concierge-facing assignment UI (admin panel extension to `/admin/requests`)
3. In-app notifications for status changes
4. `/my-requests/:id` request detail + chat view

See [platform/request-system.md](../platform/request-system.md) for the full request lifecycle spec.

---

## Pillar Cross-Reference Matrix

| Pillar | Has Hub | Has Subcategories | Has Detail | DB Schema | Hooks | Status |
|--------|---------|-------------------|------------|-----------|-------|--------|
| Move to Dubai | ✅ | ✅ (stages) | ✅ | ✅ | ✅ | Live (mock) |
| Experiences | ✅ | ✅ (7) | ✅ | ✅ | ✅ | Live (mock) |
| Nightlife | ✅ | ✅ (types) | ✅ | ✅ | ✅ | Live (feature slice) |
| Stays | ✅ | ✅ (3) | ✅ | ✅ | ✅ | Live (mock) |
| Transport | ✅ | ✅ (3) | ✅ | ✅ | ✅ | Live (mock) |
| Business Setup | ✅ | ✅ (5) | ✅ | ✅ | ✅ | Live (mock) |
| Concierge | ✅ | ❌ | ✅ (`/concierge/request`) | ✅ | ✅ | Hub ✅, status/assign ❌ |
