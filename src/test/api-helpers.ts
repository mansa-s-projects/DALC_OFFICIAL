import { NextRequest } from 'next/server';
import { expect } from 'vitest';

/**
 * Create a POST NextRequest with a JSON body.
 * Shared across all API route test files.
 */
export function makePostRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Assert a response is an error: checks HTTP status and `ok: false` in body.
 * Use when a test expects both a non-200 status and a standard error envelope.
 */
export async function expectErrorResponse(res: Response, status = 400): Promise<void> {
  expect(res.status).toBe(status);
  const body = await res.json();
  expect(body.ok).toBe(false);
}
