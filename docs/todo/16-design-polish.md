# TODO: Design Polish & UI Consistency

> Priority: 🟡 LOW-MEDIUM — Platform works; these elevate the luxury feel to production grade

---

## Design System Reference
See: `docs/design-system/` for colors, typography, animations, card system, layout system.

Custom theme tokens in `tailwind.config.js`: `luxury-black`, `luxury-gold`, `luxury-cream`.

---

## Tasks

### Task 1: Loading States — Skeleton Screens

Every data-fetching page must show skeleton placeholders, not blank screens or spinners:

**Audit — ensure skeletons exist for**:
- [ ] Venue cards grid (nightlife pages)
- [ ] Experience cards grid
- [ ] Transport service cards
- [ ] Stay property cards
- [ ] Admin tables
- [ ] Notification dropdown
- [ ] Profile page stats

**Skeleton component standard**:
```tsx
// Use Tailwind animate-pulse with the project's dark theme:
<div className="bg-white/5 animate-pulse rounded-xl h-[280px] w-full" />
```

---

### Task 2: Empty States — All Lists

Every list that can be empty needs a custom empty state (no raw "No results"):

| Page | Empty state message |
|------|---------------------|
| Nightlife category | "No venues in this category yet. Check back soon." |
| Experience category | "No experiences available right now." |
| My Requests | "You have no requests yet. Start with our Concierge." |
| My Bookings | "Your booking history will appear here." |
| Admin table | "No records found. Try adjusting your filters." |
| Search | "No results for [query]. Try different keywords." |
| Notifications | "You're all caught up." (bell icon) |

---

### Task 3: Error States — Network & API Errors

All React Query error states need graceful UI:

```tsx
// Standard error state component:
// src/components/shared/ErrorState.tsx
<div className="flex flex-col items-center justify-center py-24 text-white/60">
  <AlertCircleIcon className="w-12 h-12 mb-4 text-red-400" />
  <h3 className="text-lg font-medium">Something went wrong</h3>
  <p className="text-sm mt-1">{error.message}</p>
  <Button onClick={retry} className="mt-6">Try again</Button>
</div>
```

Apply to: all page-level queries.

---

### Task 4: Page Transitions

All route changes should have a smooth transition. Currently there may be abrupt cuts.

**Add page transition wrapper**:
```tsx
// src/components/layout/PageTransition.tsx
// Use Framer Motion:
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.2 }}
>
  {children}
</motion.div>
```

Wrap all route components in `<PageTransition>` via the router.

---

### Task 5: Mobile Responsive Audit

Audit every page on:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (iPad)
- 1024px (iPad Pro / small laptop)

Common issues to look for:
- [ ] Navbar overflows on small screens → ensure hamburger/mobile menu
- [ ] Cards in 3-column grid → should become 1-column on mobile
- [ ] BookingForm → check input stacking on mobile
- [ ] Admin tables → horizontal scroll on mobile or card view
- [ ] Hero banners → text legibility on small screens

---

### Task 6: Accessibility Audit (WCAG AA)

Key accessibility improvements:
- [ ] All images have `alt` attributes
- [ ] All interactive elements are keyboard-navigable
- [ ] Color contrast ratios pass 4.5:1 (especially gold on black)
- [ ] Modal/dialog traps focus correctly
- [ ] Form inputs have proper `<label>` elements
- [ ] `aria-label` on icon-only buttons (search, close, menu)

---

### Task 7: Focus on Performance

- [ ] All images use `loading="lazy"` or Next.js `<Image>` optimization
- [ ] Heavy pages (Explore, Nightlife grid) use virtual scroll for 50+ items
- [ ] Framer Motion `whileInView` animations only trigger in viewport
- [ ] React Query stale time set appropriately (venues: 5min, user data: 1min)
- [ ] Route code-splitting working (all pages lazy-loaded — verify no barrel exports breaking this)

---

### Task 8: Toast Notification System

Verify `react-hot-toast` or equivalent is globally configured. Ensure consistent toasts for:
- Booking success: ✅ "Booking confirmed!"
- Booking error: ❌ "Booking failed. Please try again."
- Form saved: ✅ "Changes saved."
- Copy to clipboard: ✅ "Copied!"
- Network error: ❌ "Connection error. Check your internet and retry."

Check that toasts appear above modals (`z-index` is high enough).

---

### Task 9: 404 & Error Pages

Check that proper 404 and error pages exist:

```
src/pages/
  NotFoundPage.tsx        ← 404 page
  ErrorPage.tsx           ← generic error boundary
```

404 page should:
- Match luxury brand aesthetic
- Have "Go Home" and "Contact Concierge" CTAs
- Not show raw "Page not found" text

---

### Task 10: Consistent Currency Display

All currency values should use a single formatting utility:

```tsx
// src/utils/formatCurrency.ts
export function formatCurrency(amount: number, currency = 'AED') {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Usage: formatCurrency(2500) → "AED 2,500"
```

Audit all price displays to use this function instead of raw string concatenation.

---

## Acceptance Criteria

- [ ] Every data-loading page shows skeleton during fetch
- [ ] Every list has a custom empty state message
- [ ] Every page-level error shows retry button
- [ ] All route transitions are animated
- [ ] App is fully functional on 375px mobile width
- [ ] Navbar has a mobile hamburger menu
- [ ] All images have alt text
- [ ] Keyboard navigation works on all interactive elements
- [ ] All prices display using `formatCurrency()` utility
- [ ] 404 page matches brand design
