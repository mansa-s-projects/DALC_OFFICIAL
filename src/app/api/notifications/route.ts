import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

interface NotifyBody {
  user_id: string;
  type: string;
  title: string;
  message: string;
  action_url?: string;
  metadata?: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as NotifyBody;
  const { user_id, type, title, message, action_url, metadata } = body;

  if (!user_id || !type || !title || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("notifications").insert({
    user_id,
    type,
    title,
    message,
    action_url: action_url ?? null,
    metadata: metadata ?? {},
  });

  if (error) {
    return NextResponse.json({ error: "Failed to insert notification" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
