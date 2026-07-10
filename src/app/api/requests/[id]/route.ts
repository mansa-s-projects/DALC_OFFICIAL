import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../../lib/supabase-admin";
import { notifyRequestStatusChange } from "../../../../lib/notifications";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = getSupabaseAdminClient();

  const { data: request, error } = await supabase
    .from("requests")
    .select("id, user_id, category, request_type, venue_name, status, priority, priority_score, party_size, date_time, contact_name, contact_info, notes, internal_notes, assigned_to, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error || !request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [quotesResult, paymentsResult, logsResult] = await Promise.all([
    supabase
      .from("quotes")
      .select("id, amount_aed, status, notes, expires_at, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("id, amount_aed, status, payment_type, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("request_status_log")
      .select("id, new_status, old_status, notes, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    ...request,
    quotes: quotesResult.data ?? [],
    payments: paymentsResult.data ?? [],
    request_status_log: logsResult.data ?? [],
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = getSupabaseAdminClient();

  const body = await req.json();
  const { status, assigned_to, internal_notes } = body as {
    status?: string;
    assigned_to?: string;
    internal_notes?: string;
  };

  const { data: updated, error } = await supabase
    .from("requests")
    .update({ status, assigned_to, internal_notes, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, status, user_id")
    .single();

  if (error || !updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  if (status) {
    await supabase.from("request_status_log").insert({
      request_id: id,
      old_status: null,
      new_status: status,
      changed_by: null,
    });

    if (updated.user_id) {
      await notifyRequestStatusChange(updated.user_id, id, status).catch(() => null);
    }
  }

  return NextResponse.json(updated);
}
