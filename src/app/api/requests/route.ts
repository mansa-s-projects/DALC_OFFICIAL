import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    request_id: "test_123",
    status: "created"
  });
}