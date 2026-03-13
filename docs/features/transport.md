# Feature: Transport

## Purpose

The Transport feature enables booking of luxury and exotic transport in Dubai — self-drive supercars, chauffeured vehicles, private yacht charters, and private jet bookings. Transport is distinct from Experiences: it is about movement and access, not leisure activities.

---

## Architecture

### Pages
| Page | Route | Component |
|------|-------|-----------|
| Hub | `/transport` | `src/features/transport/pages/TransportHub.tsx` |
| Cars | `/transport/cars` | `src/features/transport/pages/CarsList.tsx` |
| Yachts | `/transport/yachts` | `src/features/transport/pages/YachtsList.tsx` |
| Jets | `/transport/jets` | `src/features/transport/pages/JetsList.tsx` |
| Detail | `/transport/:subcategory/:slug` | `src/features/transport/pages/TransportDetail.tsx` |

### Hooks
| Hook | Purpose |
|------|---------|
| `useTransport` (`src/features/transport/hooks/useTransport.ts`) | Fetch and filter transport service listings |
| `useTransportBooking` (`src/features/transport/hooks/useTransportBooking.ts`) | Create + manage bookings |

### Service Library
`src/lib/transport.ts` — Contains `MOCK_TRANSPORT` (7 seeded services), `getTransportServices()`, `getFeaturedTransport()`, `getTransportServiceBySlug()`, `checkAvailability()`, `getAvailableTimeSlots()`, `createTransportBooking()`, `generateTransportSlug()`.

### Types
`src/features/transport/types.ts` — TypeScript definitions for all transport entities. Re-exported via shim at `src/types/transport.ts`.

---

## Subcategories (3)

| Subcategory | DB Value | Sub-types | Examples |
|-------------|----------|-----------|---------|
| Cars | `cars` | luxury-sedan, sports-car, suv, chauffeur, airport-transfer | Rolls-Royce Ghost, Lamborghini Huracán |
| Yachts | `yachts` | day-cruise, overnight-charter, fishing, water-sports | 85ft day yacht, 120ft superyacht |
| Jets | `jets` | private-charter, helicopter-tour, empty-leg | Gulfstream G650, Bell 429 helicopter |

---

## User Flows

### Flow 1: Car Rental Discovery → Booking

```
User lands on /transport (hub)
  → Stats: 500+ vehicles, 24/7 availability, 15-min response
  → 3 category cards: Cars / Yachts / Jets
  → Featured fleet from useFeaturedTransport()

User clicks "Cars"
  → /transport/cars → CarsList
  → Filters: price per day, seats, transmission, body type
  → Cards display: make, model, year, horsepower, daily rate

User selects "Rolls-Royce Ghost"
  → /transport/cars/rolls-royce-ghost-2024 → TransportDetail
  → Specifications panel: make, model, seats, transmission, horsepower
  → Pricing: daily/hourly rate
  → Availability calendar (24hr advance booking required)
  → User selects dates → createTransportBooking()
```

### Flow 2: Yacht Charter

```
User navigates to /transport/yachts
  → YachtsList: filtered to subcategory='yachts'
  → Yacht cards: vessel name, length, cabins, max_guests, daily rate
  → User selects 85ft luxury yacht
  → TransportDetail shows: yacht specs, crew info, pick-up locations
  → Minimum booking: 4 hours
  → User selects: date, duration, pickup location, guests
  → Creates booking
```

### Flow 3: Private Jet

```
User navigates to /transport/jets
  → JetsList shows available aircraft
  → Cards: aircraft type, range, seats, hourly rate
  → User selects Gulfstream G650
  → TransportDetail: aircraft specs, range_nm, baggage
  → Availability type: 'by_request' → leads to concierge request
  → User fills: departure airport, destination, date, passengers
  → Creates transport booking (status: pending, requires confirmation)
```

---

## Specification System (JSONB)

Each transport type has a flexible `specifications` JSONB field:

### Cars
```typescript
specifications: {
  make: string;         // "Rolls-Royce"
  model: string;        // "Ghost"
  year: number;         // 2024
  seats: number;        // 4
  transmission: string; // "Automatic"
  horsepower: number;   // 563
  color: string;        // "Silver"
  body_type: string;    // "Sedan"
}
```

### Yachts
```typescript
specifications: {
  length_ft: number;    // 85
  cabins: number;       // 3
  crew_size: number;    // 4
  max_guests: number;   // 12
  amenities: string[];  // ["Air conditioning", "Jacuzzi", "BBQ"]
  builder: string;      // "Sunseeker"
  year: number;         // 2022
}
```

### Jets
```typescript
specifications: {
  aircraft_type: string; // "Gulfstream G650"
  range_nm: number;      // 7000
  seats: number;         // 14
  max_altitude: number;  // 51000
  baggage_kg: number;    // 280
  speed_kph: number;     // 956
}
```

Spec label maps are defined in `src/types/transport.ts` for UI rendering.

---

## Pricing Models

| Model | Usage |
|-------|-------|
| `hourly` | Cars (minimum 4hr), yachts |
| `daily` | Cars (24hr blocks) |
| `fixed` | Standard transfers (airport, point-to-point) |
| `per_trip` | Helicopter tours with fixed routes |
| `custom` | Jets and superyachts — quote-based |

---

## Availability System

`AvailabilityType` options:
- `on_demand` — available immediately with 24hr lead time (most cars)
- `scheduled` — specific scheduled slots (helicopter tours, tours)
- `seasonal` — available only certain months (superyachts peak Nov-Apr)
- `by_request` — availability confirmed after inquiry (jets, rare vehicles)

`checkAvailability(serviceId, date, duration)` returns `AvailabilityResult`:
```typescript
{
  available: boolean;
  advanceBookingHours: number; // min lead time required
  minimumDuration: number;     // minimum booking in hours
  availableSlots?: TimeSlot[]; // for scheduled type
}
```

---

## Slug Generation

Slugs are generated by `generateTransportSlug(service)` in `src/lib/transport.ts`:

| Input | Output |
|-------|--------|
| Rolls-Royce Ghost 2024 | `rolls-royce-ghost-2024` |
| 85ft Luxury Yacht | `85ft-luxury-yacht` |
| Gulfstream G650 | `gulfstream-g650` |

---

## Database Schema

### `transport_services`
```sql
id, supplier_id, subcategory (cars|yachts|jets), title, slug,
description, short_description, images (text[]), specifications (JSONB),
pricing_model, base_price, currency, hourly_rate, daily_rate,
availability_type, pickup_locations (text[]), advance_booking_hours,
minimum_duration_hours, max_passengers, is_published, is_featured,
is_trending, trending_score, tags (text[]),
created_at, updated_at
```

### `transport_bookings`
```sql
id, service_id, user_id, booking_reference, pickup_location,
dropoff_location, start_date, end_date, duration_hours,
passengers, total_amount, currency, status, payment_status,
payment_method, special_requests, notes, relocation_profile_id,
workflow_step_id, created_at, updated_at
```

---

## Mock Data (7 seeded services)

| Name | Type | Rate |
|------|------|------|
| Rolls-Royce Ghost 2024 | cars | AED 4,500/day |
| Lamborghini Huracán Evo | cars | AED 5,200/day |
| Range Rover SVAutobiography | cars | AED 2,800/day |
| 85ft Luxury Yacht | yachts | AED 18,000/day |
| 120ft Superyacht Dubai | yachts | AED 42,000/day |
| Gulfstream G650 | jets | AED 28,000/hr |
| Bell 429 Helicopter Tour | jets | AED 2,200/trip (fixed) |

---

## Scalability Notes

- **Fleet expansion:** As supplier marketplace grows, transport suppliers will self-list vehicles via the supplier dashboard.
- **Real-time availability:** Integrate with fleet management systems to sync actual vehicle availability in real time.
- **Chauffeur service:** Add a `chauffeur_available` boolean to `transport_services` for cars that offer driver with booking.
- **Insurance integration:** Display insurance coverage details + allow users to add extra coverage at booking.
- **Tracking:** Add real-time vehicle/vessel tracking for active bookings via GPS API integration.
- **Multi-city:** `transport_services` gains `city_id` + `pickup_city` for multi-location fleets.
