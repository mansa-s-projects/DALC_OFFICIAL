# DALC Card System

All cards inherit from `BaseCard`.

Cards must never introduce custom styling that breaks consistency.

## BaseCard

### Properties

- background
- border
- hover glow
- padding
- rounded corners
- animation

### BaseCard Style

| Property | Value |
|----------|-------|
| background | `#111214` |
| border | `1px solid rgba(200,164,107,0.35)` |
| hover border | `#C8A46B` |
| hover glow | `rgba(200,164,107,0.15)` |

## Card Types

### AccessCard

Email entry card shown on the opening screen.

### CategoryCard

Used on the homepage category grid.

**Categories:**
- Move To Dubai
- Experiences
- Nightlife
- Travel
- Business Setup
- Concierge

### ServiceCard

Used for:
- experiences
- venues
- activities
- services

### RequestCard

Used for concierge requests.

---

This becomes your UI architecture rulebook.
