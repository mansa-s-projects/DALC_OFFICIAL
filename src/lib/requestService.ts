import "server-only";
import { getSupabaseAdminClient } from "./supabase-admin";

export type RequestPriority = "HIGH" | "NORMAL" | "LOW";

export type RequestRow = {
  id: string;
  intent_id: string | null;
  user_id: string | null;
  status: string;
  priority: RequestPriority;
  assigned_to: string | null;
  category: string;
  request_type: string;
  title: string;
  created_at: string;
  updated_at: string;
};

type CreateRequestInput = {
  intent_id: string;
  intent_type: string;
  complexity_score: number;
  user_id?: string | null;
};

function resolvePriority(complexity_score: number): RequestPriority {
  if (complexity_score >= 4) return "HIGH";
  return "NORMAL";
}

function resolveCategory(intent_type: string): string {
  const map: Record<string, string> = {
    relocation: "relocation",
    business_setup: "business",
    lifestyle: "lifestyle",
  };
  return map[intent_type] ?? "general";
}

export async function createRequestFromIntent(
  input: CreateRequestInput,
): Promise<RequestRow> {
  const supabase = getSupabaseAdminClient();
  const priority = resolvePriority(input.complexity_score);
  const category = resolveCategory(input.intent_type);

  const { data, error } = await supabase
    .from("requests")
    .insert({
      intent_id: input.intent_id,
      user_id: input.user_id ?? null,
      status: "pending",
      priority,
      category,
      request_type: "concierge",
      title: `${category} request`,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create request: ${error.message}`);
  }

  return data as RequestRow;
}
