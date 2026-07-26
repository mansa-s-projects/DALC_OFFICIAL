import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { requireUserAuth } from '@/lib/api-auth';
import { enforceRateLimit, readJsonBody } from '@/lib/api-security';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
}

const checkoutSchema = z.object({
  request_id: z.string().uuid(),
  quote_id: z.string().uuid(),
});

function getApplicationUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (
      process.env.NODE_ENV === 'production' &&
      url.protocol !== 'https:'
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, 'payment-checkout', 6, 60_000);
  if (rateLimited) return rateLimited;

  const auth = await requireUserAuth();
  if (auth instanceof NextResponse) return auth;

  if (process.env.PAYMENTS_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'Payments are temporarily paused. Please contact support.' },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  const appUrl = getApplicationUrl();
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET || !appUrl) {
    return NextResponse.json(
      { error: 'Payments are not fully configured.' },
      { status: 503 },
    );
  }

  try {
    const parsed = checkoutSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Valid request_id and quote_id are required.' },
        { status: 400 },
      );
    }

    const { request_id: requestId, quote_id: quoteId } = parsed.data;
    const supabase = getSupabaseAdminClient();
    const { data: ownedRequest, error: requestError } = await supabase
      .from('requests')
      .select('id')
      .eq('id', requestId)
      .eq('user_id', auth.userId)
      .single();

    if (requestError || !ownedRequest) {
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    }

    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('id, amount_aed, status, request_id')
      .eq('id', quoteId)
      .eq('request_id', requestId)
      .single();

    if (quoteError || !quote) {
      return NextResponse.json({ error: 'Quote not found.' }, { status: 404 });
    }

    if (quote.status !== 'sent' && quote.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Quote is not payable.' },
        { status: 409 },
      );
    }

    const amountAed = Number(quote.amount_aed);
    if (!Number.isFinite(amountAed) || amountAed <= 0) {
      return NextResponse.json(
        { error: 'Quote amount is invalid.' },
        { status: 409 },
      );
    }

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: undefined,
        client_reference_id: auth.userId,
        line_items: [
          {
            price_data: {
              currency: 'aed',
              unit_amount: Math.round(amountAed * 100),
              product_data: {
                name: 'DALC Concierge Service',
                description: `Request #${requestId.slice(0, 8)}`,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          request_id: requestId,
          quote_id: quoteId,
          user_id: auth.userId,
        },
        success_url: `${appUrl}/my-requests/${requestId}?payment=processing`,
        cancel_url: `${appUrl}/my-requests/${requestId}?payment=cancelled`,
      },
      { idempotencyKey: `dalc-checkout-${auth.userId}-${quoteId}` },
    );

    const { error: paymentError } = await supabase.from('payments').upsert(
      {
        request_id: requestId,
        quote_id: quoteId,
        user_id: auth.userId,
        amount_aed: amountAed,
        currency: 'AED',
        payment_type: 'deposit',
        status: 'pending',
        stripe_session_id: session.id,
      },
      { onConflict: 'stripe_session_id' },
    );

    if (paymentError) {
      console.error('Failed to persist payment session:', paymentError);
      return NextResponse.json(
        { error: 'Checkout could not be initialized.' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { url: session.url },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE') {
      return NextResponse.json(
        { error: 'Checkout payload is too large.' },
        { status: 413 },
      );
    }

    if (error instanceof Error && error.message === 'INVALID_JSON') {
      return NextResponse.json(
        { error: 'Invalid JSON payload.' },
        { status: 400 },
      );
    }

    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout could not be initialized.' },
      { status: 500 },
    );
  }
}
