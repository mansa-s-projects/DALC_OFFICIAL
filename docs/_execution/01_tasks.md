# Tasks

## Scope

This is the DALC MVP task list derived from the system map.

It excludes speculative platform work, low-value polish, and anything that does not improve one of the following:

1. Intent capture
2. Request execution
3. Operator control
4. Revenue capture
5. Fulfillment reliability

## MVP Decision Rule

A task belongs in MVP only if it does at least one of these things:

| Test | Keep in MVP if true |
| --- | --- |
| It turns raw user demand into structured intent | Yes |
| It helps DALC close and fulfill paid requests | Yes |
| It reduces operator confusion or failure | Yes |
| It improves revenue capture on high-intent demand | Yes |
| It exists mainly for brand theatre, browsing depth, or fake automation | No |

## Frontend Tasks

| Title | Description | Dependencies | Priority | What defines completion |
| --- | --- | --- | --- | --- |
| Command Capture Entry | Build the primary DALC input surface across homepage, relocation, business, concierge, travel, and nightlife entry points so every serious user need can be submitted as raw intent. | Intent API contract | High | Users can submit freeform needs from all major entry pages and receive a consistent next-step response. |
| Intent Result Screen | Build the post-submission result state that shows interpreted need, recommended flow, next action, and whether DALC will handle the request directly or route to concierge. | Intent API, routing rules | High | Every successful submission lands on a response screen with actionable next steps rather than a dead confirmation page. |
| Request Tracker | Build a user-facing request detail and status page for quote, task, payment, and fulfillment visibility. | Requests schema, operator actions, conversations | High | A user can see request stage, next required action, assigned flow, and payment status from one screen. |
| Quote Approval and Payment UI | Build the UI for quote review, acceptance, deposit payment, and proof of confirmed execution. | Quotes, payments, booking flow | High | User can accept a quote and complete payment without leaving DALC. |
| Consultation Booking Surfaces | Build paid consultation entry states for relocation, business setup, and custom concierge requests. | Pricing logic, payments | High | DALC can sell consultation time as a structured, payable product. |
| Document Intake UI | Build a simple upload and checklist interface for relocation and business setup flows. | Requests, tasks, storage conventions | Medium | User can upload required documents and see missing items by request. |
| Membership Surfaces | Add upgrade surfaces only where they increase trust and speed for high-value users, not as a generic banner. | Membership rules, monetization logic | Medium | Membership is shown in context at relevant moments with clear value and not as a random upsell. |

## Backend Tasks

| Title | Description | Dependencies | Priority | What defines completion |
| --- | --- | --- | --- | --- |
| Intent Orchestration Endpoint | Build `POST /api/intent` to validate input, call AI classification, apply business rules, store intent, and return next action. | Intent schema, AI service | High | Endpoint returns consistent structured output and persists intent records. |
| Request Creation Service | Build a service that converts qualifying intents into requests with priority, ownership rules, SLA deadlines, and monetization stage. | Requests schema, operator model | High | High-intent submissions reliably create request records with lifecycle state and audit trail. |
| Quote and Booking Engine | Build backend logic to create quotes, accept quotes, generate bookings, and tie them to payments. | Quotes, bookings, payments schema | High | DALC can move a complex request from commercial proposal to confirmed fulfillment. |
| Partner Assignment Layer | Build assignment logic for routing requests or tasks to internal operators or external partners with SLA tracking. | Partners, services, tasks | High | Requests can be assigned with visible ownership and timestamped assignment history. |
| Event and Revenue Tracking | Track intent creation, request creation, quote acceptance, payment events, failed fulfillment, and membership upgrades. | Event taxonomy, payments | High | DALC can attribute demand, conversion, and revenue by flow and segment. |
| Conversation Timeline Service | Persist user and operator communications into a unified request timeline. | Conversations schema | Medium | Every operational interaction is recoverable from a single request timeline. |
| Renewal and Follow-Up Jobs | Create scheduled logic for quote expiry, follow-up reminders, renewal prompts, and abandoned high-intent recovery. | Tasks, quotes, membership | Medium | DALC can follow up without relying on manual memory. |

## AI Tasks

| Title | Description | Dependencies | Priority | What defines completion |
| --- | --- | --- | --- | --- |
| Intent Classification Model Layer | Build the prompt and response schema that turns raw user requests into structured DALC intent objects. | Intent schema, LLM provider | High | AI output is schema-valid and production-safe for core request types. |
| Routing and Scoring Policy Layer | Implement deterministic logic on top of AI output for urgency, complexity, monetization score, and handoff decision. | Intent object, business rules | High | DALC no longer depends on pure model judgment for execution-critical routing. |
| Operator Copilot Drafting | Generate operator-ready summaries, missing information prompts, and recommended next steps for each request. | Requests, tasks, conversations | Medium | Operators receive usable briefs instead of raw user text. |
| Follow-Up and Upsell Suggestions | Suggest consultation, membership, package, or add-on offers based on request state and user profile. | Monetization rules, membership logic | Medium | DALC can propose the right commercial next step without random upsells. |
| Failure and Escalation Detection | Detect ambiguous, risky, or stalled requests and force human intervention. | Operator actions, SLA rules | High | The system flags risky requests before users experience silent failure. |

## Database Tasks

| Title | Description | Dependencies | Priority | What defines completion |
| --- | --- | --- | --- | --- |
| Canonical Core Schema | Create production tables for profiles, intents, requests, tasks, quotes, bookings, payments, membership, partners, services, conversations, and operator actions. | System map | High | All DALC flows use one schema instead of feature-local objects. |
| Lifecycle State Enums | Add strict state models for requests, tasks, quotes, bookings, payments, and membership. | Core schema | High | DALC lifecycle transitions are explicit and queryable. |
| Index and Query Design | Add indexes for user activity, open work queues, quote conversion, payment lookup, partner routing, and SLA monitoring. | Core schema | High | Admin and operator queries are fast enough for live operational use. |
| Audit and Timeline Storage | Ensure operator actions and conversations are first-class relational records. | Core schema | High | Any request can be reconstructed from system history. |
| Service and Partner Catalog | Normalize fulfillment supply so DALC can route requests without hardcoding every path. | Partners, services schema | Medium | Internal routing can query real service and partner inventory. |

## Operator System Tasks

| Title | Description | Dependencies | Priority | What defines completion |
| --- | --- | --- | --- | --- |
| Operator Queue | Build a work queue sorted by priority, SLA risk, monetization potential, and membership status. | Requests, tasks, scoring rules | High | Ops staff can immediately see what must be handled now. |
| Request Detail Console | Build the internal request view with user context, intent summary, tasks, quote status, payment state, partner status, and timeline. | Core schema, conversations, operator actions | High | Operators no longer need to jump between disconnected tools to manage one request. |
| Manual Fulfillment SOP Layer | Convert recurring work into repeatable internal steps for relocation, business setup, and concierge fulfillment. | Tasks, operator actions | High | High-value requests can be executed consistently by different operators. |
| Escalation and Recovery Controls | Build controls for urgent escalation, supplier failure, refund handling, and VIP prioritization. | Tasks, payments, partner assignment | High | DALC can recover failing service requests before trust is lost. |
| Internal Performance Metrics | Track response time, time to quote, time to payment, fulfillment success, and recovery rate. | Events, requests, tasks | Medium | Operators are managed on real operational outputs rather than anecdotes. |

## Monetization Tasks

| Title | Description | Dependencies | Priority | What defines completion |
| --- | --- | --- | --- | --- |
| Paid Consultation Product | Launch consultation as the fastest revenue path for relocation, business setup, and custom high-value requests. | Frontend booking, payments, request creation | High | DALC can collect money before long-cycle fulfillment begins. |
| Package Pricing for High-Complexity Flows | Define and operationalize package-based offers for relocation and business setup rather than hiding behind vague concierge language. | Quotes, pricing rules | High | DALC can sell scoped packages with clear commercial terms. |
| Execution Fees and Deposits | Implement deposit capture and execution fees for complex or urgent concierge work. | Quotes, payments | High | High-touch work no longer starts without commercial commitment. |
| Commission Capture | Track supplier commissions on transport, stays, experiences, nightlife, and selected partner services. | Bookings, partners, services | Medium | Revenue from partner-side fulfillment is visible and auditable. |
| Membership Launch Gate | Define when membership should be sold and what must exist before launch. | Membership rules, operator SLA | Medium | DALC avoids launching a fake subscription with no operational advantage. |
| Segment-Level Revenue Reporting | Report revenue by customer segment, flow type, and acquisition path. | Events, payments, requests | Medium | DALC can see which segments produce real money and repeat demand. |

## Critical Path

The true MVP critical path is short:

1. Command capture
2. Intent API
3. Request creation
4. Operator queue and request console
5. Quote and payment flow
6. One or two monetizable fulfillment flows that actually close

If these six things work, DALC is a real operating system.

If they do not, DALC is only premium presentation.