import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../../lib/supabase-admin";
import { requireAdminAuth } from "@/lib/api-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createSupabaseServerClient();
  const { data: { user } } = await serverClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const supabase = getSupabaseAdminClient();

  const { data: request, error } = await supabase
    .from("requests")
    .select("id, category, status, priority, notes, internal_notes, created_at, updated_at, user_id")
    .eq("id", id)
    .single();

  if (error || !request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = request.user_id === user.id;
  const authResult = await requireAdminAuth(req);
  const isAdmin = !(authResult instanceof NextResponse);

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

interface PatchRequestBody {
  status?: string;
  priority?: string;
  notes?: string;
  internal_notes?: string;
  assigned_to?: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAuth(req, 'edit_leads');
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  const supabase = getSupabaseAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from("requests")
    .select("status")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const old_status = existing.status as string;

  const body = (await req.json()) as PatchRequestBody;

  const { data: updated, error: updateError } = await supabase
    .from("requests")
    .update({
      ...(body.status !== undefined && { status: body.status }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.internal_notes !== undefined && { internal_notes: body.internal_notes }),
      ...(body.assigned_to !== undefined && { assigned_to: body.assigned_to }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (body.status && body.status !== old_status) {
    await supabase.from("request_status_log").insert({
      request_id: id,
      old_status,
      new_status: body.status,
      changed_by: auth.userId,
      notes: null,
    });
  }

  return NextResponse.json({ success: true, request: updated });
}
