<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Dubai À La Carte

Luxury concierge platform built with Next.js, Supabase, and Stripe.

## Run locally

Prerequisites: Node.js 22 and npm.

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and configure the required Supabase values.
3. Run the application with `npm run dev`.

## Validation

Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

Payment checkout remains disabled until both payment feature flags, Stripe
credentials, and the verified webhook endpoint are configured.
