import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
}

function getPaymentIntentId(session: Stripe.Checkout.Session) {
  return typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id ?? null;
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const signature = request.headers.get('stripe-signature');

  if (!stripe || !webhookSecret || !signature) {
    return NextResponse.json(
      { error: 'Webhook is not configured.' },
      { status: 503 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid webhook signature.' },
      { status: 400 },
    );
  }

  const supportedEvents = new Set([
    'checkout.session.completed',
    'checkout.session.async_payment_succeeded',
    'checkout.session.async_payment_failed',
    'checkout.session.expired',
  ]);

  if (!supportedEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const succeeded =
    event.type === 'checkout.session.async_payment_succeeded' ||
    (event.type === 'checkout.session.completed' &&
      session.payment_status === 'paid');
  const failed =
    event.type === 'checkout.session.async_payment_failed' ||
    event.type === 'checkout.session.expired';
  const status = succeeded ? 'succeeded' : failed ? 'failed' : 'processing';
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from('payments')
    .update({
      status,
      stripe_payment_intent: getPaymentIntentId(session),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_session_id', session.id);

  if (error) {
    console.error('Stripe webhook reconciliation failed:', error);
    return NextResponse.json(
      { error: 'Payment reconciliation failed.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
