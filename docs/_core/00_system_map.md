# System Map

## Purpose

This file is the canonical DALC system model.

Every product, engineering, AI, operations, and monetization decision should support this model.

DALC is not a marketplace, a directory, or a content site. DALC is a Dubai life execution system that turns messy user intent into fulfilled outcomes, managed through AI decisioning and human operators.

## The Single Most Important User Flow

The core DALC flow is:

1. A user expresses a real need.
2. DALC interprets the need into structured intent.
3. DALC decides the best flow, urgency, monetization path, and execution model.
4. DALC creates the required operational objects.
5. DALC fulfills the request through self-serve actions, partner actions, operator actions, or a hybrid path.
6. DALC captures revenue from the execution and expands lifetime value through follow-on needs.

In plain terms:

`User need -> structured intent -> recommended flow -> request/task creation -> fulfillment -> payment -> retention`

This is the product. Everything else is support infrastructure.

## System Loop

| Stage | What happens | Primary owner | Output |
| --- | --- | --- | --- |
| Input | User submits a message, form, quote request, consultation request, or booking need | User interface | Raw user signal |
| Intent | DALC converts raw input into a structured intent object | AI + validation rules | Intent object |
| Decision | DALC chooses routing, urgency, complexity, monetization path, and human involvement | AI + business rules | Recommended flow |
| Execution | DALC creates requests, tasks, quotes, bookings, conversations, and partner actions | Operators + partners + product flows | Fulfillment in progress |
| Monetization | DALC charges fees, commissions, memberships, retainers, or bundled services | Payments + sales ops | Revenue event |
| Learning | DALC records outcomes, conversion data, operator actions, and follow-on needs | Product + AI + ops | Better routing and higher LTV |

## Decision Logic

DALC should make one decision before any UI complexity appears: what kind of problem is this?

| Question | If yes | If no |
| --- | --- | --- |
| Is the user asking for a high-value life or business outcome? | Create intent and route to assisted flow | Keep in lightweight discovery or self-serve browse |
| Does the request involve multiple dependencies, deadlines, or ambiguity? | Route to concierge or operator-assisted execution | Allow direct booking or quote path |
| Is there immediate monetizable intent? | Trigger quote, consultation, deposit, or membership path | Continue qualification |
| Is the request risky, regulated, or operationally sensitive? | Force human review | Allow automated next step |

## Core Objects

These are the minimum DALC system objects that must stay consistent across product, backend, and ops.

| Object | Purpose | Why it matters |
| --- | --- | --- |
| User | The account identity | Connects activity, payments, and lifetime value |
| Profile | Structured user context | Stores family status, budget, timeline, residency stage, preferences, and history |
| Intent | The structured meaning of a user need | The central DALC object; all flows should start here |
| Request | The execution container for a service need | Converts intent into an operational case |
| Task | Work items needed to fulfill a request | Gives operators and systems execution clarity |
| Quote | Commercial proposal for custom or assisted work | Converts complexity into payable scope |
| Booking | Confirmed service fulfillment record | Tracks committed execution |
| Payment | Revenue capture event | Makes monetization explicit and auditable |
| Membership | Recurring relationship layer | Changes prioritization, economics, and retention |
| Partner | External fulfillment source | Expands capacity without building inventory in-house |
| Service | Standardized DALC offer or fulfillment unit | Connects catalog, pricing, and operations |
| Conversation | User or operator communication thread | Preserves context across handoffs |
| Operator Action | Internal action log and decision trace | Makes execution auditable and trainable |

## Object Relationship Model

The system should be understood in one chain:

`User -> Profile -> Intent -> Request -> Tasks / Quote / Booking -> Payment -> Membership / Repeat Request`

Supporting links:

- `Intent` can create one or more `Requests`.
- `Request` can generate many `Tasks`.
- `Request` may require a `Quote` before a `Booking`.
- `Booking` may map to one or multiple `Partners`.
- `Payment` can be attached to consultation, deposit, execution fee, package fee, membership, or commissionable service.
- `Operator Actions` and `Conversations` attach across the full lifecycle.

## Key APIs Required

These are the minimum APIs DALC needs to operate as a system rather than a collection of pages.

| API | Purpose | Required outcome |
| --- | --- | --- |
| `POST /api/intent` | Convert raw input into structured intent | Returns intent, flow recommendation, next action, and monetization signal |
| `POST /api/requests` | Create an execution case from intent | Opens a tracked request with ownership and SLA |
| `POST /api/quotes` | Create a commercial proposal | Converts high-intent requests into payable scope |
| `POST /api/bookings` | Confirm fulfillment | Moves from proposed to committed execution |
| `POST /api/payments` | Capture consultation, deposit, fee, or package payment | Creates a revenue event |
| `POST /api/membership/upgrade` | Upgrade user into recurring relationship | Changes priority and economics |
| `POST /api/operator/tasks` | Create and manage internal work | Enables operational execution |
| `POST /api/partners/assign` | Route work to partner supply | Connects demand to external capacity |
| `POST /api/conversations` | Persist communication context | Reduces handoff failure |
| `POST /api/events` | Track conversion and lifecycle signals | Feeds optimization and AI learning |

## AI Role In The Loop

AI is the DALC decision layer, not the DALC product surface.

AI should do five things well:

1. Classify user intent from messy natural language.
2. Score urgency, complexity, monetization potential, and handoff requirement.
3. Recommend the best flow: self-serve, assisted, quote-led, consultation-led, or operator-led.
4. Draft next steps for users and operators.
5. Keep context persistent across requests so DALC behaves like an operating system, not a one-off concierge.

AI should not:

1. Invent legal, visa, tax, or regulated advice.
2. Confirm supplier availability without system verification.
3. Promise pricing or timelines without rules or human confirmation.
4. Replace operator judgment in high-risk execution.

## Monetization Trigger Points

Revenue should be triggered when intent becomes expensive, urgent, high trust, or operationally complex.

| Trigger point | Monetization action |
| --- | --- |
| User requests expert guidance | Paid consultation |
| User needs a multi-step move or setup process | Package fee |
| User needs custom execution | Quote + deposit |
| User books transport, stays, experiences, or premium services | Booking fee, commission, or margin |
| User has repeated high-frequency needs | Membership upsell |
| User is a founder, agency, or business client | Retainer or B2B service fee |
| User needs urgency, priority, or out-of-hours execution | Rush fee or premium execution fee |

## Operator Involvement Points

Operators are not a fallback. They are the fulfillment engine behind DALC.

Operators should step in when:

| Situation | Required operator action |
| --- | --- |
| Intent is ambiguous or cross-category | Clarify scope and restructure the request |
| Request touches regulated or high-risk domains | Review, approve, and manage specialist routing |
| Request has multiple dependencies | Build task sequence and assign ownership |
| Pricing is custom or negotiated | Build and send quote |
| Supplier fulfillment is uncertain | Verify availability and control handoff |
| User is premium, urgent, or high-LTV | Prioritize, escalate, and manage white-glove execution |
| Service failure or delay occurs | Recover service, protect trust, and document actions |

## DALC Execution Modes

DALC should only support four execution modes.

| Mode | When to use it | Example |
| --- | --- | --- |
| Self-serve | Simple, low-risk, standardized demand | Standard experience booking |
| Assisted | Medium-complexity needs that need guidance | Business consultation booking |
| Operator-led | High-complexity or urgent needs | Family relocation with school and housing dependencies |
| Hybrid | User begins self-serve, operator closes the loop | User browses stays, then requests bundled transport and concierge support |

## System Priorities

If DALC has to choose what to optimize first, the order is:

1. Intent accuracy
2. Request creation speed
3. Operator clarity
4. Monetization capture
5. Fulfillment reliability
6. Retention and repeat demand

This order matters because DALC loses if it looks polished but cannot route, execute, and monetize real demand.

## Non-Negotiable Rules

1. Every serious user input should become an intent object.
2. Every monetizable intent should have a visible commercial path.
3. Every complex request should have an owner.
4. Every operator action should be logged.
5. Every premium promise should map to an actual operational capability.
6. DALC should optimize for fulfilled outcomes, not page views or listing depth.

## Reference Thesis

DALC wins by becoming the system that interprets Dubai demand better than anyone else, routes it faster than manual concierge businesses, fulfills it more reliably than fragmented service providers, and monetizes it across the full lifecycle of living, moving, operating, and spending in Dubai.