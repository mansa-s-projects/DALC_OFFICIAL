import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../../lib/supabase-admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = getSupabaseAdminClient();

  const { data: request, error } = await supabase
    .from("requests")
    .select("id, category, status, priority, notes, internal_notes, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error || !request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [quotesResult, paymentsResult] = await Promise.all([
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
  ]);

  return NextResponse.json({
    ...request,
    quotes: quotesResult.data ?? [],
    payments: paymentsResult.data ?? [],
  });
}
