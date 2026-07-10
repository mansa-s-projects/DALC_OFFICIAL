import "server-only";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdminClient } from "../../../../lib/supabase-admin";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payments are not configured. Missing STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const requestId = session.metadata?.request_id;
    const quoteId = session.metadata?.quote_id;

    if (requestId && quoteId) {
      await supabase
        .from("payments")
        .update({ status: "paid", stripe_payment_intent: session.payment_intent as string | null })
        .eq("stripe_session_id", session.id);

      await supabase
        .from("quotes")
        .update({ status: "paid" })
        .eq("id", quoteId);
    }
  }

  return NextResponse.json({ received: true });
}
