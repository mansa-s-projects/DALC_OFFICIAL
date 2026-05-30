import "server-only";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdminClient } from "../../../../lib/supabase-admin";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

type CheckoutBody = {
  request_id?: unknown;
  quote_id?: unknown;
};

export async function POST(req: NextRequest) {
  const paymentsEnabled = process.env.PAYMENTS_ENABLED === "true";
  if (!paymentsEnabled) {
    return NextResponse.json(
      { error: "Payments are temporarily paused. Please contact support." },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payments are not configured. Missing STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  const body = (await req.json()) as CheckoutBody;
  const requestId = typeof body.request_id === "string" ? body.request_id : null;
  const quoteId = typeof body.quote_id === "string" ? body.quote_id : null;

  if (!requestId || !quoteId) {
    return NextResponse.json(
      { error: "request_id and quote_id are required" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();

  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .select("id, amount_aed, status, request_id")
    .eq("id", quoteId)
    .eq("request_id", requestId)
    .single();

  if (quoteError || !quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  if (quote.status !== "sent" && quote.status !== "accepted") {
    return NextResponse.json({ error: "Quote is not payable" }, { status: 409 });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "aed",
          unit_amount: Math.round(quote.amount_aed * 100),
          product_data: {
            name: "DALC Concierge Service",
            description: `Request #${requestId.slice(0, 8)}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      request_id: requestId,
      quote_id: quoteId,
    },
    success_url: `${appUrl}/my-requests/${requestId}?payment=success`,
    cancel_url: `${appUrl}/my-requests/${requestId}?payment=cancelled`,
  });

  // Record payment row in pending state
  await supabase.from("payments").insert({
    request_id: requestId,
    quote_id: quoteId,
    amount_aed: quote.amount_aed,
    payment_type: "deposit",
    status: "pending",
    stripe_session_id: session.id,
  });

  return NextResponse.json({ url: session.url });
}
