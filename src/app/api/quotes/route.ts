import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { sendNotification } from "@/lib/notifications";

interface CreateQuoteBody {
  request_id: string;
  amount_aed: number;
  notes?: string;
  expires_at?: string;
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdminClient();

  const body = (await req.json()) as CreateQuoteBody;
  const { request_id, amount_aed, notes, expires_at } = body;

  if (!request_id || !amount_aed || amount_aed <= 0) {
    return NextResponse.json(
      { error: "request_id and a positive amount_aed are required" },
      { status: 400 }
    );
  }

  const { data: request, error: reqError } = await supabase
    .from("requests")
    .select("id, user_id, status, venue_name, category")
    .eq("id", request_id)
    .single();

  if (reqError || !request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .insert({
      request_id,
      amount_aed,
      status: "sent",
      notes: notes ?? null,
      expires_at: expires_at ?? null,
    })
    .select("id, request_id, amount_aed, status, notes, expires_at, created_at")
    .single();

  if (quoteError || !quote) {
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }

  // Advance request to quoted (if not already beyond that)
  const advanceable = ["submitted", "acknowledged", "assigned", "supplier_contacted", "in_progress"];
  if (advanceable.includes(request.status)) {
    await supabase
      .from("requests")
      .update({ status: "quoted", updated_at: new Date().toISOString() })
      .eq("id", request_id);

    await supabase.from("request_status_log").insert({
      request_id,
      old_status: request.status,
      new_status: "quoted",
      changed_by: null,
      notes: `Quote of AED ${amount_aed.toLocaleString()} created`,
    });
  }

  // Notify customer
  if (request.user_id) {
    await sendNotification({
      userId: request.user_id,
      requestId: request_id,
      type: "quote_ready",
      title: "Your Quote Is Ready",
      message: `AED ${amount_aed.toLocaleString()} for ${request.venue_name ?? request.category}. Tap to review and pay.`,
    }).catch(() => null);
  }

  return NextResponse.json({ quote }, { status: 201 });
}
