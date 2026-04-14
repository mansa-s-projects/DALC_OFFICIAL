import { NextRequest, NextResponse } from "next/server";
import { handleIntent } from "../../../../lib/intentService";
import { getSupabaseAdminClient } from "../../../../lib/supabase-admin";
import { createRequestFromIntent } from "../../../../lib/requestService";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { user_input?: unknown; user_id?: unknown };
    const userInput = body.user_input;
    const userId = typeof body.user_id === "string" ? body.user_id : null;
    const normalizedInput = typeof userInput === "string" ? userInput.trim() : "";

    if (normalizedInput.length === 0) {
      return NextResponse.json(
        { error: "user_input is required" },
        { status: 400 },
      );
    }

    const { intentResponse, decision } = await handleIntent(normalizedInput);
    const intent = intentResponse.intent!;

    // Persist intent to DB
    const supabase = getSupabaseAdminClient();
    const { data: intentRow, error: intentError } = await supabase
      .from("intents")
      .insert({
        user_id: userId,
        user_input: intent.user_input,
        intent_type: intent.intent_type,
        complexity_score: intent.complexity_score,
        decision,
        raw_response: intentResponse,
      })
      .select("id")
      .single();

    if (intentError) {
      console.error("[intent] DB insert failed:", intentError.message);
    }

    const intentId: string | null = intentRow?.id ?? null;

    // If high-complexity, immediately create a request
    let request: Awaited<ReturnType<typeof createRequestFromIntent>> | null = null;
    if (decision === "CREATE_REQUEST" && intentId) {
      request = await createRequestFromIntent({
        intent_id: intentId,
        intent_type: intent.intent_type ?? "unknown",
        complexity_score: intent.complexity_score ?? 1,
        user_id: userId,
      });
    }

    return NextResponse.json({
      intentResponse,
      decision,
      intent_id: intentId,
      request: request ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}