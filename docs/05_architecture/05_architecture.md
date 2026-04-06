# Architecture And Intent Engine

## Architecture Thesis

DALC should be built as a controlled execution system, not as a loose collection of vertical pages.

The architecture should optimize for one thing above everything else: the speed and reliability with which DALC can turn high-value user intent into fulfilled, monetized outcomes.

## Core Architectural Layers

| Layer | Responsibility | What must never happen here |
| --- | --- | --- |
| Capture layer | Collect raw user input through command entry, forms, and request surfaces | Hardcoded business logic spread across UI components |
| Intent layer | Convert raw demand into structured intent and decision signals | Final execution, pricing promises, or hidden magic logic |
| Orchestration layer | Create requests, tasks, quotes, and routing decisions | Unstructured ad hoc ops behavior |
| Execution layer | Manage operators, partners, bookings, documents, and fulfillment | Natural-language decisioning without system state |
| Revenue layer | Capture consultations, deposits, commissions, packages, and memberships | Revenue that is disconnected from execution objects |
| Learning layer | Store outcomes, timelines, operator actions, and performance data | Analytics that do not map back to real objects |

## Intent Engine Role

The intent engine is the DALC control plane.

Every serious request should pass through it before DALC decides what to show, who should own the case, whether money should be collected, and how fulfillment should start.

If DALC does not centralize this layer, the product drifts into disconnected vertical logic and broken monetization paths.

## Intent Engine Input Schema

The input schema should stay minimal in v1.

| Field | Type | Purpose |
| --- | --- | --- |
| `user_input` | `string` | Raw user request |
| `user_id` | `uuid \| null` | Optional user identity |
| `context.source` | `string` | Page or channel source |
| `context.membership_tier` | `string \| null` | Priority and upsell signal |
| `context.known_profile` | `object \| null` | Existing user context |
| `context.session_id` | `string \| null` | Session continuity |

## Intent Engine Output Schema

| Field | Type | Purpose |
| --- | --- | --- |
| `intent` | `object` | Structured interpretation of user need |
| `recommended_flow` | `object` | The execution model DALC should use |
| `next_action` | `object` | What the user or system should do now |
| `monetization_signal` | `object` | Commercial opportunity linked to the request |
| `request_creation` | `boolean` | Whether DALC should open an operational case immediately |

## Intent Object Requirements

Every intent object should contain at least:

| Field | Meaning |
| --- | --- |
| `intent_type` | Relocation, business setup, lifestyle, concierge, or mixed |
| `intent_subtypes` | Specific sub-needs like schooling, housing, yacht, visa, banking |
| `entities` | Extracted facts such as dates, budget, people count, urgency markers |
| `urgency_score` | Time sensitivity |
| `complexity_score` | Operational complexity |
| `monetization_score` | Likely commercial value |
| `handoff_required` | Whether human ownership is needed |
| `recommended_owner` | Self-serve, operator, partner, or hybrid |

## Scoring Logic

### Priority Scoring

Priority should increase when a request is:

1. urgent
2. high-value
3. high-trust
4. membership-linked
5. commercially close to payment

Recommended priority output:

| Score range | Priority |
| --- | --- |
| 1-2 | Low |
| 3 | Normal |
| 4 | High |
| 5 | Urgent |

### Complexity Scoring

Complexity should increase when a request has:

1. multiple dependencies
2. multiple people involved
3. regulated or specialist work
4. unclear scope
5. partner coordination requirements

### Monetization Scoring

Monetization should increase when a request:

1. implies premium spend
2. requires expert advice
3. creates a package opportunity
4. has repeat-value potential
5. can lead to recurring concierge or membership revenue

## Human Handoff Logic

Force human handoff when any of the following is true:

| Condition | Handoff? |
| --- | --- |
| Regulated or legal ambiguity | Yes |
| High-value custom request | Yes |
| Family relocation with multiple dependencies | Yes |
| Business setup with unclear jurisdiction | Yes |
| Supplier-side availability must be manually confirmed | Yes |
| Low-complexity standard booking | No, unless requested |

## Membership Upsell Logic

DALC should not pitch membership randomly.

Membership should be suggested when users display one of these patterns:

1. repeated premium requests
2. urgent recurring needs
3. high-value concierge dependency
4. desire for priority response and continuity
5. multi-category use across business, relocation, and lifestyle

## Routing Logic

| Request type | Preferred route |
| --- | --- |
| Simple nightlife or experience booking | Self-serve or assisted booking |
| Complex stay, transport, or bundle request | Hybrid or operator-led |
| Relocation | Operator-led with consultation or package path |
| Business setup | Consultation-led, then quote or package |
| Cross-category premium request | Request creation and operator ownership |

## Ten Real Input Examples

| User input | Intent type | Complexity | Recommended flow | Monetization path |
| --- | --- | --- | --- | --- |
| I want to move to Dubai with my family in September | Relocation | 5 | Operator-led relocation | Consultation then package |
| I need a school, driver, and villa next week | Relocation | 5 | Operator-led concierge relocation hybrid | Quote or premium execution fee |
| I want to start a mainland company in Dubai | Business setup | 4 | Consultation-led business flow | Consultation then setup package |
| I need help choosing between free zone and mainland | Business setup | 4 | Consultation-led business flow | Paid advisory |
| I need a yacht tomorrow for 12 people | Lifestyle | 4 | Custom quote flow | Booking margin plus rush fee |
| Find me a hotel and airport pickup for the weekend | Lifestyle | 3 | Hybrid booking flow | Booking margin and add-ons |
| I want a residence visa and a bank account | Relocation | 4 | Operator-led relocation | Package or staged services |
| I need a driver every week and restaurant bookings | Lifestyle | 4 | Concierge-led recurring flow | Membership candidate |
| I want to launch my creator business in Dubai | Business setup | 4 | Consultation-led business flow | Setup package and retainer |
| What should I do tonight in Dubai | Lifestyle | 1 | Lightweight recommendation or self-serve | None or booking margin |

## Recommended v1 Implementation Shape

1. One entrypoint API for intent classification and decisioning
2. One canonical intent object
3. One request creation service
4. One operator queue
5. One quote and payment path

Anything beyond that is secondary until DALC proves the core operating loop.

## Architectural Rule

DALC should never let vertical-specific logic become the real decision layer.

The decision layer belongs to the intent engine.

The verticals exist to fulfill what the intent engine decides.