import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

interface CreateRequestBody {
  user_id?: string;
  venue_id?: string;
  venue_name?: string;
  category: string;
  request_type?: string;
  date_time?: string;
  party_size?: number;
  contact_name?: string;
  contact_info?: string;
  notes?: string;
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = getSupabaseAdminClient();
  const { data: { user }, error: authError } = await admin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await admin
    .from("requests")
    .select("id, category, request_type, venue_name, status, priority, party_size, date_time, notes, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdminClient();
    const body = (await request.json()) as CreateRequestBody;

    if (!body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required field: category" },
        { status: 400 },
      );
    }

    const insertPayload = {
      user_id: body.user_id ?? null,
      venue_id: body.venue_id ?? null,
      venue_name: body.venue_name ?? null,
      category: body.category,
      request_type: body.request_type ?? "booking",
      date_time: body.date_time ?? new Date().toISOString(),
      party_size: Number(body.party_size ?? 1),
      status: "submitted",
      priority_score: 0,
      contact_name: body.contact_name ?? null,
      contact_info: body.contact_info ?? null,
      notes: body.notes ?? null,
    };

    const { data: created, error: createError } = await supabase
      .from("requests")
      .insert(insertPayload)
      .select(
        "id, user_id, venue_id, venue_name, category, request_type, date_time, party_size, status, priority_score, assigned_to, contact_name, contact_info, notes, internal_notes, supplier_response, confirmed_at, completed_at, created_at, updated_at, service_id, category_id, subcategory_id, booking_id, intent_id, priority",
      )
      .single();

    if (createError) {
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 500 },
      );
    }

    const { error: statusLogError } = await supabase
      .from("request_status_log")
      .insert({
        request_id: created.id,
        old_status: null,
        new_status: "submitted",
        changed_by: body.user_id ?? null,
        notes: null,
      });

    if (statusLogError) {
      console.error("Failed to write request status log:", statusLogError);
    }

    return NextResponse.json({
      success: true,
      request_id: created.id,
      request: created,
    });
  } catch (error) {
    console.error("Failed to create request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create request" },
      { status: 500 },
    );
  }
}