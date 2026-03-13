# Feature: Stays

## Purpose

The Stays feature covers luxury accommodation across Dubai — from iconic 5-star hotels to private Palm Jumeirah villas to branded long-term residences. It serves both leisure visitors and relocating individuals (through integration with the Move to Dubai pillar).

---

## Architecture

### Pages
| Page | Route | Component |
|------|-------|-----------|
| Hub | `/stays` | `src/features/stays/pages/StaysHub.tsx` |
| Hotels | `/stays/hotels` | `src/features/stays/pages/HotelsList.tsx` |
| Villas | `/stays/villas` | `src/features/stays/pages/VillasList.tsx` |
| Residences | `/stays/residences` | `src/features/stays/pages/ResidencesList.tsx` |
| Detail | `/stays/:subcategory/:slug` | `src/features/stays/pages/PropertyDetail.tsx` |

### Hooks
| Hook | Purpose |
|------|---------|
| `useStays` (`src/features/stays/hooks/useStays.ts`) | Fetch and filter property listings |
| `useStaysBooking` (`src/features/stays/hooks/useStaysBooking.ts`) | Create + manage stays bookings |

### Service Library
`src/lib/stays.ts` — Contains `MOCK_PROPERTIES` (7 seeded properties), `getProperties()`, `getFeaturedProperties()`, `getAvailability()`, `checkAvailability()`, `calculatePrice()`, `createStaysBooking()`, `getUserBookings()`.

### Types
`src/features/stays/types.ts` — TypeScript definitions for all stays entities. Re-exported via shim at `src/types/stays.ts`.

---

## Subcategories (3)

| Subcategory | DB Value | Examples |
|-------------|----------|---------|
| Hotels | `hotels` | Burj Al Arab, Armani Hotel, Atlantis The Royal |
| Villas | `villas` | Palm Jumeirah private villas, Emirates Hills estates |
| Residences | `residences` | Downtown branded apartments, Marina long-stay |

---

## User Flows

### Flow 1: Hotel Discovery → Booking

```
User lands on /stays (hub)
  → Stats bar: 500+ properties, 98% guest satisfaction
  → 3 category cards: Hotels / Villas / Residences
  → Featured properties grid from useFeaturedProperties()

User clicks "Hotels"
  → /stays/hotels → HotelsList
  → Filters: price range, bedrooms, bathrooms, max_guests, amenities
  → Results displayed as property cards

User clicks hotel card
  → /stays/hotels/burj-al-arab → PropertyDetail
  → Full property view: images, description, amenities, pricing
  → Calendar: check availability for date range
  → Price calculator: calculatePrice(checkIn, checkOut)
  → "Book Now" CTA → createStaysBooking(input)
```

### Flow 2: Availability Check

```
User selects check-in / check-out dates on PropertyDetail
  → checkAvailability(propertyId, checkIn, checkOut) called
  → Queries stays_availability for each date in range
  → Returns: { available: boolean, unavailableDates: string[] }
  → If available: shows price breakdown
  → If unavailable: shows blocked dates on calendar
```

### Flow 3: Price Calculation

```
calculatePrice(propertyId, checkIn, checkOut, pricingModel):
  → Computes number of nights
  → Applies seasonal multiplier from seasonal_pricing JSONB
  → Adds service fee percentage
  → Adds security deposit (if required)
  → Returns PriceBreakdown:
    {
      nights: number,
      baseNightlyRate: number,
      seasonalMultiplier: number,
      subtotal: number,
      serviceFee: number,
      securityDeposit: number,
      total: number,
      currency: 'AED'
    }
```

### Flow 4: Relocation-Linked Booking

```
User on /move-to-dubai/dashboard
  → Workflow step: "Secure Accommodation" is in_progress
  → User clicks "Find a Property" → /stays
  → Browses + selects property
  → At checkout: system detects active relocation profile
  → Booking type set to 'relocation'
  → relocation_profile_id linked on stays_bookings
  → Workflow step auto-updated to completed on booking confirmation
```

---

## Pricing System

### Pricing Models
| Model | Description |
|-------|-------------|
| `nightly` | Standard per-night pricing |
| `monthly` | Long-stay monthly rate (usually discounted) |
| `yearly` | Annual rental rate |
| `flexible` | Custom quote for extended stays |

### Seasonal Pricing
```typescript
seasonal_pricing: SeasonalPricing[] = [
  { name: 'Peak Season', startDate: '2024-12-15', endDate: '2025-01-10', multiplier: 1.8 },
  { name: 'Summer', startDate: '2025-06-01', endDate: '2025-08-31', multiplier: 0.75 },
  { name: 'Ramadan', startDate: '2025-03-01', endDate: '2025-03-30', multiplier: 0.85 }
]
```

`getSeasonalMultiplier()` in `src/lib/stays.ts` calculates the applicable multiplier for a given date.

---

## Amenity System

Properties have an `amenities: string[]` field. The `AMENITY_ICONS` map in `src/types/stays.ts` provides icon identifiers for 25+ amenities:

```
pool, private-pool, gym, spa, parking, wifi, kitchen, air-conditioning,
balcony, sea-view, city-view, beach-access, butler-service, concierge,
cinema-room, games-room, bbq, garden, security, elevator, pet-friendly,
baby-cot, wheelchair-accessible, rooftop, tennis-court
```

---

## Database Schema

### `stays_properties`
```sql
id, supplier_id, subcategory (hotels|villas|residences), title, slug,
description, short_description, images (text[]), bedrooms, bathrooms,
max_guests, amenities (text[]), base_nightly_rate, monthly_rate,
yearly_rate, pricing_model, currency, seasonal_pricing (JSONB),
min_stay_nights, max_stay_nights, deposit_required, deposit_amount,
deposit_percentage, service_fee_percentage, location, address,
district, coordinates (JSONB), is_published, is_featured,
rating, review_count, created_at, updated_at
```

### `stays_availability`
```sql
id, property_id, date, is_available, price_override, notes,
created_at, updated_at
```

### `stays_bookings`
```sql
id, property_id, user_id, relocation_profile_id,
booking_reference, check_in_date, check_out_date,
nights, guests, nightly_rate, total_nights_cost,
service_fee, security_deposit, total_amount,
currency, status, booking_type (short_term|long_term|relocation),
payment_status, payment_method, special_requests, notes,
created_at, updated_at
```

---

## Mock Data (7 seeded properties)

| Name | Type | Nightly Rate |
|------|------|-------------|
| Burj Al Arab Jumeirah | hotel | AED 8,500 |
| Armani Hotel Dubai | hotel | AED 4,200 |
| Palm Jumeirah Signature Villa | villa | AED 12,000 |
| Emirates Hills Estate | villa | AED 18,500 |
| Downtown Dubai Penthouse Residence | residence | AED 2,800 |
| Dubai Marina Branded Residence | residence | AED 1,900 |
| Atlantis The Royal Ocean Suite | hotel | AED 22,000 |

---

## Filtering (`StaysFilters`)
```typescript
{
  subcategory?: StaysSubcategory;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxGuests?: number;
  amenities?: string[];
  checkIn?: string;       // ISO date
  checkOut?: string;      // ISO date
  isFeatured?: boolean;
  searchQuery?: string;
}
```

---

## Scalability Notes

- **Dynamic availability calendar:** Replace mock `generateMockAvailability()` with real data from `stays_availability` synced with property management systems (PMS) via API.
- **Online payments:** Integrate Stripe or Checkout.com for deposit + full payment flow.
- **Reviews:** Add `stays_reviews` table — review after stay completion triggers incentive.
- **Multi-currency:** Stays already stores `currency` field — add currency conversion layer at the display layer.
- **Multi-city:** `stays_properties` gains `city_id` column — all queries filter by active city.
- **Supplier self-listing:** When supplier marketplace goes live, property owners manage listings via supplier dashboard.
