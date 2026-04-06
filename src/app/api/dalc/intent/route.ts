import { NextRequest, NextResponse } from "next/server";
import { handleIntent } from "../../../../lib/intentService";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { user_input?: unknown };
    const userInput = body.user_input;

    if (typeof userInput !== "string" || userInput.trim().length === 0) {
      return NextResponse.json(
        { error: "user_input is required" },
        { status: 400 },
      );
    }

    const result = await handleIntent(userInput);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}