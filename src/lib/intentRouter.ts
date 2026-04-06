import type { IntentType } from "./categoryMap";

export type IntentDecision =
  | "CREATE_REQUEST"
  | "START_RELOCATION_FLOW"
  | "START_BUSINESS_FLOW"
  | "START_LIFESTYLE_FLOW"
  | "UNKNOWN";

export type IntentPayload = {
  user_input: string;
  intent_type: IntentType;
  complexity_score: number;
};

export type IntentResponse = {
  intent: IntentPayload;
};

export function intentRouter(intentResponse: IntentResponse): IntentDecision {
  const intent = intentResponse.intent;
  const intentType = intent.intent_type;
  const complexityScore = intent.complexity_score;

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