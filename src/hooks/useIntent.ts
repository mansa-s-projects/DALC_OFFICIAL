"use client";

import { useState } from "react";

type IntentType = "relocation" | "business_setup" | "lifestyle" | "unknown";

type IntentDecision =
  | "CREATE_REQUEST"
  | "START_RELOCATION_FLOW"
  | "START_BUSINESS_FLOW"
  | "START_LIFESTYLE_FLOW"
  | "UNKNOWN";

type IntentPayload = {
  user_input: string;
  intent_type: IntentType;
  complexity_score: number;
};

type IntentResponse = {
  intent?: IntentPayload | null;
};

type RequestRow = {
  id: string;
  status: string;
  priority: "HIGH" | "NORMAL" | "LOW";
  category: string;
  created_at: string;
};

type UseIntentResult = {
  intentResponse: IntentResponse | null;
  decision: IntentDecision | null;
  intentId: string | null;
  request: RequestRow | null;
  loading: boolean;
  error: string | null;
  submit: (userInput: string, userId?: string) => Promise<void>;
  reset: () => void;
};

export function useIntent(): UseIntentResult {
  const [intentResponse, setIntentResponse] = useState<IntentResponse | null>(null);
  const [decision, setDecision] = useState<IntentDecision | null>(null);
  const [intentId, setIntentId] = useState<string | null>(null);
  const [request, setRequest] = useState<RequestRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(userInput: string, userId?: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dalc/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userInput, user_id: userId ?? null }),
      });

      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as {
        intentResponse: IntentResponse;
        decision: IntentDecision;
        intent_id: string | null;
        request: RequestRow | null;
      };

      setIntentResponse(data.intentResponse);
      setDecision(data.decision);
      setIntentId(data.intent_id);
      setRequest(data.request);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setIntentResponse(null);
    setDecision(null);
    setIntentId(null);
    setRequest(null);
    setError(null);
  }

  return { intentResponse, decision, intentId, request, loading, error, submit, reset };
}
