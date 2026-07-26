import 'server-only';
import { NextResponse } from 'next/server';

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();
const MAX_BUCKETS = 10_000;

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip =
    forwardedFor?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return ip;
}

export function enforceRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const key = `${scope}:${getClientIdentifier(request)}`;
  const existing = rateLimitBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (rateLimitBuckets.size >= MAX_BUCKETS) {
      for (const [bucketKey, bucket] of rateLimitBuckets) {
        if (bucket.resetAt <= now) rateLimitBuckets.delete(bucketKey);
      }
      if (rateLimitBuckets.size >= MAX_BUCKETS) {
        const oldestKey = rateLimitBuckets.keys().next().value;
        if (oldestKey) rateLimitBuckets.delete(oldestKey);
      }
    }

    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  existing.count += 1;

  if (existing.count <= limit) return null;

  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please try again shortly.' },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfter) },
    },
  );
}

export async function readJsonBody(request: Request, maxBytes = 16_384) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > maxBytes) {
    throw new Error('PAYLOAD_TOO_LARGE');
  }

  const raw = await request.text();
  if (Buffer.byteLength(raw, 'utf8') > maxBytes) {
    throw new Error('PAYLOAD_TOO_LARGE');
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error('INVALID_JSON');
  }
}
