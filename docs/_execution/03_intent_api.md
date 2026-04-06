# Intent API

## Role

`POST /api/intent` is the most important DALC endpoint.

Its job is not to chat. Its job is to convert messy user demand into an executable DALC decision.

Every serious user flow should pass through this endpoint before DALC decides whether to:

1. keep the user in self-serve
2. sell a consultation
3. create a request
4. route to concierge
5. trigger a quote path
6. surface a membership opportunity

## Endpoint Contract

| Field | Value |
| --- | --- |
| Method | `POST` |
| Path | `/api/intent` |
| Auth | Optional in v1, preferred when user is signed in |
| Content type | `application/json` |
| Primary responsibility | Classify need, score it, recommend the correct flow, optionally trigger request creation |

## Request Body

### Required Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `user_input` | `string` | Yes | Raw natural language need from user |
| `user_id` | `string \| null` | No | UUID when authenticated |
| `context` | `object` | Yes | Structured request context |

### Recommended Request Shape

```json
{
	"user_input": "I want to move to Dubai with my wife and two children by September and need help with schools and a villa",
	"user_id": "6b55eb3a-a29b-4de7-8c44-7a5cf3e2f5a1",
	"context": {
		"source": "homepage_command",
		"page": "/",
		"locale": "en",
		"session_id": "sess_01JXYZ",
		"membership_tier": "none",
		"known_profile": {
			"budget_band": "high",
			"family_status": "family"
		}
	}
}
```

## Response Body

The response must always return four primary objects:

1. `intent`
2. `recommended_flow`
3. `next_action`
4. `monetization_signal`

### Recommended Response Shape

```json
{
	"intent": {
		"id": "0f1904fd-69f3-4a28-a4fd-4541c59b9d5d",
		"intent_type": "relocation",
		"intent_subtypes": ["schooling", "housing", "family_move"],
		"entities": {
			"move_timeline": "2026-09",
			"family_size": 4,
			"children_present": true
		},
		"urgency_score": 4,
		"complexity_score": 5,
		"monetization_score": 5,
		"confidence_score": 0.94,
		"handoff_required": true,
		"handoff_reason": "multi-dependency family relocation"
	},
	"recommended_flow": {
		"type": "operator_led_relocation",
		"label": "Relocation planning with concierge support"
	},
	"next_action": {
		"type": "create_request_and_offer_consultation",
		"label": "Start relocation planning",
		"request_creation": true
	},
	"monetization_signal": {
		"type": "paid_consultation_then_package",
		"confidence": 0.92,
		"recommended_offer": "family_relocation_consultation"
	}
}
```

## Intent Object Fields

| Field | Type | Purpose |
| --- | --- | --- |
| `id` | `string` | Unique intent ID |
| `intent_type` | `string` | Top-level DALC category |
| `intent_subtypes` | `string[]` | More precise classification |
| `entities` | `object` | Extracted facts like dates, budget, people, service type |
| `urgency_score` | `number` | Time sensitivity from 1-5 |
| `complexity_score` | `number` | Operational complexity from 1-5 |
| `monetization_score` | `number` | Commercial potential from 1-5 |
| `confidence_score` | `number` | Classification reliability |
| `handoff_required` | `boolean` | Whether human review is required |
| `handoff_reason` | `string \| null` | Why human intervention is needed |

## Recommended Flow Values

Use a closed set of flow types in v1.

| Flow type | When to use it |
| --- | --- |
| `self_serve_booking` | Standard, low-risk, low-complexity demand |
| `assisted_consultation` | User needs expert guidance before execution |
| `operator_led_relocation` | Multi-step relocation or family support |
| `operator_led_business_setup` | Jurisdiction, licensing, or document-heavy setup |
| `custom_quote_flow` | High-touch service with variable scope or price |
| `hybrid_execution` | User starts self-serve but needs manual close |

## Next Action Values

| Next action | Meaning |
| --- | --- |
| `browse_recommendations` | Keep user in lightweight guidance |
| `book_consultation` | Sell expert session immediately |
| `create_request` | Open an internal execution case |
| `create_request_and_offer_consultation` | Open case and collect paid qualification |
| `request_quote` | Start commercial scoping |
| `redirect_to_booking` | Send to direct booking flow |
| `ask_clarifying_question` | Collect required missing information |

## Monetization Signal Values

| Signal type | Intended commercial outcome |
| --- | --- |
| `none` | No monetization yet |
| `consultation` | Sell a paid advisory session |
| `package` | Sell structured relocation or business package |
| `quote` | Sell via custom pricing |
| `booking_margin` | Capture fee, markup, or commission via booking |
| `membership_candidate` | User should see recurring value proposition |
| `rush_fee` | Urgent fulfillment should cost more |

## Validation Rules

| Rule | Behavior |
| --- | --- |
| `user_input` must be non-empty | Reject requests with blank or whitespace-only input |
| `user_input` length must be reasonable | Minimum 5 characters, recommended max 2000 |
| `context` must be an object | Reject malformed payloads |
| `user_id` must be valid UUID if present | Reject invalid authenticated identifiers |
| High-risk keywords must not bypass human review | Force handoff for legal, immigration, banking, tax, or ambiguous urgent requests |
| AI output must match schema | If parsing fails, fall back to deterministic safe response |

## Decision Logic

The endpoint should make decisions in this order:

1. Validate payload.
2. Normalize raw input.
3. Send normalized input plus context to AI classification.
4. Validate AI output against a strict schema.
5. Apply DALC business rules.
6. Determine `recommended_flow`.
7. Determine `next_action`.
8. Determine `monetization_signal`.
9. Persist intent.
10. If trigger conditions are met, create a request.

### Request Creation Trigger Rules

Create a `request` automatically when any of the following is true:

| Condition | Create request |
| --- | --- |
| `complexity_score >= 4` | Yes |
| `urgency_score >= 4` | Yes |
| `handoff_required = true` | Yes |
| `intent_type` is `relocation` or `business_setup` | Usually yes |
| `next_action` is `request_quote` | Yes |
| `monetization_signal.type` is `consultation` or `package` | Usually yes |

Do not create a request yet when the user is only browsing generic inspiration and there is no operational or commercial signal.

## Fallback Logic

DALC should fail safe, not fail vague.

| Failure case | Fallback |
| --- | --- |
| AI timeout | Return `ask_clarifying_question` with safe default concierge route |
| AI output invalid | Store low-confidence intent and route to operator review |
| Input too vague | Ask one clarifying question rather than pretending certainty |
| Regulated or risky request | Force handoff and suppress automated advice |
| Unknown category | Create generic concierge request if monetization potential is high |

## Error Handling

| Status | When to use it | Response expectation |
| --- | --- | --- |
| `200` | Intent analyzed successfully | Return full response payload |
| `201` | Intent analyzed and request created | Return response plus `request_id` |
| `400` | Invalid payload | Return field-level validation errors |
| `401` | Auth mismatch for protected request | Return auth error |
| `422` | Input valid but cannot be interpreted safely | Return clarifying question response |
| `500` | Unexpected internal failure | Return generic fallback plus tracking ID |
| `503` | AI or downstream dependency unavailable | Return degraded safe mode response |

### Error Response Example

```json
{
	"error": {
		"code": "INVALID_INPUT",
		"message": "user_input must contain a real request",
		"fields": {
			"user_input": "Must be at least 5 characters"
		}
	}
}
```

## How It Connects To AI

AI should only handle interpretation, extraction, and draft recommendation.

AI input should include:

1. Raw user input
2. Source context
3. Known user profile context
4. Allowed DALC intent taxonomy
5. Required output schema
6. Hard rules for regulated or risky requests

AI output should never directly control the system. DALC business rules must enforce:

1. schema validation
2. confidence thresholds
3. handoff rules
4. monetization logic
5. request creation logic

## How It Triggers Request Creation

The endpoint should optionally create a request in the same request cycle.

### Recommended Sequence

1. Persist intent first.
2. Evaluate request creation rules.
3. If rules pass, create `requests` row.
4. Attach initial request summary and lifecycle state.
5. Optionally create first operator task.
6. Return `request_id` in the response.

### Request Creation Response Extension

```json
{
	"next_action": {
		"type": "create_request_and_offer_consultation",
		"label": "Start relocation planning",
		"request_creation": true,
		"request_id": "1ec7a8fd-d25b-4de0-b9dd-e0478f9c9d5d"
	}
}
```

## Next.js API Route Structure

Implement this endpoint in App Router as:

`src/app/api/intent/route.ts`

### Recommended Internal Layers

| Layer | Responsibility |
| --- | --- |
| Route handler | Parse request, auth context, and response formatting |
| Validation layer | Zod schema for input and AI output |
| Intent service | AI call, normalization, and business rule application |
| Persistence layer | Save intent and optional request |
| Event layer | Track analytics and operator alerts |

### Recommended Handler Sequence

1. Parse JSON body.
2. Validate with Zod.
3. Load user/profile context if `user_id` exists.
4. Call intent service.
5. Validate AI output.
6. Apply DALC decision rules.
7. Persist intent.
8. Conditionally create request.
9. Return response.

## Opinionated v1 Guidance

1. Do not make this endpoint a chat endpoint.
2. Do not let AI invent pricing or legal certainty.
3. Do not hide ambiguous outputs from operators.
4. Do not create requests for low-value noise.
5. Do create requests aggressively for high-intent, high-value, or complex needs.

If this API works, DALC behaves like a system.

If this API is weak, DALC becomes a thin wrapper around disconnected flows.