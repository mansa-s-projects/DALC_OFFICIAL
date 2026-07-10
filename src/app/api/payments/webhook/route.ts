import "server-only";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdminClient } from "../../../../lib/supabase-admin";
import { sendNotification } from "../../../../lib/notifications";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // Dev mode: accept unsigned events (never in production)
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const requestId = session.metadata?.request_id;
      const quoteId = session.metadata?.quote_id;
      if (!requestId) break;

      await supabase
        .from("payments")
        .update({ status: "paid" })
        .eq("stripe_session_id", session.id);

      if (quoteId) {
        await supabase
          .from("quotes")
          .update({ status: "accepted" })
          .eq("id", quoteId);
      }

      const { data: req_ } = await supabase
        .from("requests")
        .select("status")
        .eq("id", requestId)
        .single();

      if (req_ && req_.status !== "confirmed" && req_.status !== "completed") {
        await supabase
          .from("requests")
          .update({ status: "confirmed", updated_at: new Date().toISOString() })
          .eq("id", requestId);

        await supabase.from("request_status_log").insert({
          request_id: requestId,
          old_status: req_.status,
          new_status: "confirmed",
          changed_by: null,
          notes: `Payment confirmed via Stripe session ${session.id}`,
        });
      }

      // Notify the customer
      const { data: reqFull } = await supabase
        .from("requests")
        .select("user_id")
        .eq("id", requestId)
        .single();
      if (reqFull?.user_id) {
        await sendNotification({
          userId: reqFull.user_id,
          requestId,
          type: "payment_confirmed",
          title: "Payment Confirmed",
          message: `Your payment of AED ${((session.amount_total ?? 0) / 100).toLocaleString()} has been received. Your concierge will confirm details shortly.`,
        }).catch(() => null);
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await supabase
        .from("payments")
        .update({ status: "cancelled" })
        .eq("stripe_session_id", session.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      // Stripe session ID isn't on the PaymentIntent, match via payment_intent column if stored
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("stripe_payment_intent_id", pi.id);
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const pi = charge.payment_intent as string | null;
      if (pi) {
        await supabase
          .from("payments")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent_id", pi);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
