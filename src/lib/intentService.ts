import { detectIntentType, type IntentType } from "./categoryMap";
import { intentRouter, type IntentDecision, type IntentResponse } from "./intentRouter";

export type HandleIntentResult = {
	intentResponse: IntentResponse;
	decision: IntentDecision;
};

function getComplexityScore(userInput: string, intentType: IntentType): number {
	const text = userInput.toLowerCase();
	let score = 1;

	if (intentType === "relocation" || intentType === "business_setup") {
		score += 1;
	}

	if (text.includes("family") || text.includes("children") || text.includes("school")) {
		score += 1;
	}

	if (text.includes(" and ") || text.includes(",")) {
		score += 1;
	}

	if (text.includes("urgent") || text.includes("tomorrow") || text.includes("next week")) {
		score += 1;
	}

	return Math.min(score, 5);
}

export async function handleIntent(userInput: string): Promise<HandleIntentResult> {
	const normalizedInput = userInput.trim();
	const intentType = detectIntentType(normalizedInput);
	const complexityScore = getComplexityScore(normalizedInput, intentType);

	const intentResponse: IntentResponse = {
		intent: {
			user_input: normalizedInput,
			intent_type: intentType,
			complexity_score: complexityScore,
		},
	};

	const decision = intentRouter(intentResponse);

	return {
		intentResponse,
		decision,
	};
}