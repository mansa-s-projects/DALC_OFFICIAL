# Lifestyle And Experience Flow

## Flow Objective

DALC should handle nightlife, dining, activities, transport, stays, and premium plans as a guided decision-and-execution system, not as a flat marketplace.

The product should reduce choice fatigue, improve conversion quality, and escalate smoothly from booking to concierge-led execution when complexity rises.

## Two Core Journey Types

### Simple Request Journey

This is for requests like:

1. book a hotel for this weekend
2. get a car for tomorrow
3. recommend a beach club tonight

Simple journey:

1. user enters need
2. DALC classifies the intent
3. DALC presents a small set of relevant options
4. user confirms selection
5. DALC captures booking or fee
6. booking is confirmed

### Complex Request Journey

This is for requests like:

1. plan a Dubai weekend with transport, dinner, nightlife, and a stay
2. organize a yacht tomorrow for a group with transfer and catering
3. build a premium plan for a visiting client or family

Complex journey:

1. user enters request
2. DALC classifies it as multi-step or high-touch
3. DALC creates a request rather than showing generic listings
4. AI drafts the plan and next steps
5. operator validates, prices, and routes it
6. DALC sends quote or bundled proposal
7. payment is captured
8. fulfillment is coordinated across suppliers

## AI Planning Logic

AI should decide three things before DALC shows anything:

| Question | Why it matters |
| --- | --- |
| Is this a simple booking or a coordinated plan? | Prevents forcing complex demand into shallow UI |
| Does the user need curation or execution? | Changes whether DALC shows options or opens a request |
| Is there premium or recurring value here? | Determines upsell and membership potential |

AI should generate:

1. intent type
2. complexity score
3. recommended execution mode
4. bundle candidates
5. membership candidate signal

## Quote And Booking Logic

| Flow type | Commercial model |
| --- | --- |
| Standard bookable inventory | Direct booking margin or commission |
| High-touch bundled request | Quote then deposit |
| Urgent premium request | Quote plus rush fee |
| Custom multi-supplier request | Operator-built proposal |

DALC should not surface static price expectations for requests that clearly require custom coordination.

## Concierge Escalation Logic

Escalate from self-serve to concierge when:

1. the request spans multiple services
2. the user signals urgency
3. the user is premium or membership-linked
4. pricing or availability is variable
5. supplier coordination is required

## Bundling Logic

DALC should actively bundle adjacent services when doing so improves both execution and economics.

High-value bundle examples:

1. stay + airport transfer + dinner reservation
2. yacht + transport + catering + nightlife after-plan
3. founder visit + driver + hotel + business concierge support

Bundle rule:

Only bundle when it simplifies the user decision and increases margin without creating operational fragility.

## Membership Triggers

Membership should be suggested when users show:

1. repeated premium booking behavior
2. frequent custom requests
3. urgency dependence
4. preference for priority handling and continuity

## Revenue Capture Points

| Moment | Revenue type |
| --- | --- |
| Consultation or planning support | Advisory or planning fee |
| Direct booking | Commission or margin |
| Custom request execution | Execution fee |
| Urgent request | Rush fee |
| Repeated premium usage | Membership |

## UX States

| State | What the user should feel |
| --- | --- |
| Discovering | DALC understands the request quickly |
| Comparing | DALC narrows choices instead of overwhelming |
| Confirming | DALC makes price and next action clear |
| Waiting | DALC provides status, not silence |
| Escalated | DALC clearly communicates that a human is now coordinating |
| Fulfilled | DALC closes the loop and suggests next useful action |

## Self-Serve Versus Operator-Managed

| Should be self-serve | Should be operator-managed |
| --- | --- |
| Standard hotel or experience booking | Multi-service itineraries |
| Simple transport requests | Group, VIP, or urgent requests |
| Lightweight nightlife discovery | Supplier-dependent or custom-priced requests |
| Clear fixed-price offers | Anything requiring coordination across categories |

## Recommended v1 Scope

1. Guided intake for lifestyle requests
2. Self-serve where inventory is simple and reliable
3. Request creation for high-touch or bundled demand
4. Manual operator quoting for complex cases
5. Commission capture on direct bookings
6. Execution fees on premium custom work

The v1 goal is not to list everything in Dubai. The v1 goal is to capture the premium demand DALC can actually coordinate better than generic booking products.
