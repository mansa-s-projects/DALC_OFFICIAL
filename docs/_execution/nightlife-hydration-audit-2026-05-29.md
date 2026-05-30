# Nightlife Restaurants Hydration Audit (2026-05-29)

## Scope
- Route: /nightlife/restaurants
- Goal: verify whether hydration mismatch is DALC code instability or extension-side DOM mutation.

## Changes Applied
- Removed page-level hydration masking on [src/features/nightlife/pages/Restaurants.tsx](src/features/nightlife/pages/Restaurants.tsx).
- Removed body-level hydration masking on [src/app/layout.tsx](src/app/layout.tsx).
- Kept html-level suppression in [src/app/layout.tsx](src/app/layout.tsx) because next-themes mutates html class/style on client.

## Runtime Verification
- Dev server started with Turbopack and route served 200 consistently.
- Browser runtime showed no hydration mismatch console errors after removing page-level suppressions.
- No redirect loop observed (redirectCount = 0, stable final URL).
- No Turbopack/server compilation errors observed during checks.

## Important Observation
- Server HTML initially has html without class=dark, while hydrated client html has class=dark and color-scheme style.
- This is expected from ThemeProvider forced dark mode in [src/app/providers/NextProviders.tsx](src/app/providers/NextProviders.tsx), not route-specific unstable rendering in restaurants page.

## Extension-Only Case (ProtonPass or similar)
If hydration warning appears only when extension(s) are enabled and does not appear in a clean browser context, classify as extension-side DOM mutation.

Recommended handling:
1. Keep DALC hydration checks strict in app pages (do not add suppressHydrationWarning to page content wrappers).
2. Document extension conflict in issue notes and QA checklist.
3. Do not mark DALC code as hydration-broken when clean-context runs are stable.

## Outcome
- DALC restaurants page no longer masks hydration warnings.
- No DALC hydration mismatch reproduced after fix.
- Any remaining mismatch in extension-enabled user profiles should be treated as extension-specific unless reproducible in clean context.
