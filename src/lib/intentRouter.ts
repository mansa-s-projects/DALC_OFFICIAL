export type IntentDecision =
  | "CREATE_REQUEST"
  | "START_RELOCATION_FLOW"
  | "START_BUSINESS_FLOW"
  | "START_LIFESTYLE_FLOW"
  | "UNKNOWN";

type IntentPayload = {
  user_input?: string;
  intent_type?: string | null;
  complexity_score?: number | null;
};

export type IntentResponse = {
  intent?: IntentPayload | null;
};

export function intentRouter(intentResponse: IntentResponse): IntentDecision {
  const intent = intentResponse.intent;
  const intentType = intent?.intent_type;
  const complexityScore = intent?.complexity_score ?? 0;

  if (intentType === "relocation") {
    if (complexityScore >= 4) {
      return "CREATE_REQUEST";
    }
    return "START_RELOCATION_FLOW";
  }

  if (intentType === "business_setup") {
    if (complexityScore >= 4) {
      return "CREATE_REQUEST";
    }
    return "START_BUSINESS_FLOW";
  }

  if (intentType === "lifestyle") {
    return "START_LIFESTYLE_FLOW";
  }

  return "UNKNOWN";
}