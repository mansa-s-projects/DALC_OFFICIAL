/**
 * In-memory rate limiter for API routes.
 * Production should use Redis (Upstash) — this protects against casual abuse.
 */

type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (now > entry.resetAt) store.delete(key);
    });
  }, 5 * 60 * 1000);
}

export type RateLimitConfig = {
  /** Max requests per window */
  max: number;
  /** Window duration in seconds */
  windowSec: number;
};

export const RATE_LIMITS = {
  /** Public form submissions (leads, requests) */
  submit: { max: 5, windowSec: 60 } as RateLimitConfig,
  /** Intent API (AI processing) */
  intent: { max: 10, windowSec: 60 } as RateLimitConfig,
  /** Payment checkout */
  checkout: { max: 3, windowSec: 60 } as RateLimitConfig,
  /** General API */
  api: { max: 30, windowSec: 60 } as RateLimitConfig,
  /** Track events */
  track: { max: 60, windowSec: 60 } as RateLimitConfig,
} as const;

/**
 * Check rate limit for a given key.
 * Returns { allowed, remaining, retryAfterSec }.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowSec * 1000 });
    return { allowed: true, remaining: config.max - 1, retryAfterSec: 0 };
  }

  if (entry.count < config.max) {
    entry.count++;
    return {
      allowed: true,
      remaining: config.max - entry.count,
      retryAfterSec: 0,
    };
  }

  const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
  return { allowed: false, remaining: 0, retryAfterSec };
}

/**
 * Extract client IP from Next.js request (works behind Vercel, Cloudflare, nginx).
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
