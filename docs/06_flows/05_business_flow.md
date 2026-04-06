# Business Setup Flow

## Flow Objective

The business setup flow should convert founder intent into a commercially realistic execution path that moves from consultation to jurisdiction decision, document collection, payment, setup completion, and renewal support.

## Discovery Entry Points

| Entry point | Why it matters |
| --- | --- |
| Homepage command input | Best for users who already know what they want but not how to get there |
| Business setup landing page | Best for high-intent inbound search traffic |
| Founder consultation CTA | Best for monetizing ambiguity early |
| Concierge request form | Best for cross-category requests that include business setup |
| Partner or referral channel | Best for warm, conversion-ready demand |

## End-To-End Flow

| Stage | User experience | Backend objects and events | AI involvement | Operator involvement | Commercial logic |
| --- | --- | --- | --- | --- | --- |
| 1. Discovery | User says they want to open a company, get licensed, or set up in Dubai | `intent_created`, `intent_scored` | Classify intent, detect business type and urgency | None unless ambiguity is high | Offer consultation if setup is not straightforward |
| 2. Consultation | User books a paid expert session or requests guided setup | `request_created`, `payment_captured` for consultation | Recommend consultation framing and initial question set | Run consultation, capture constraints, define likely path | Paid consultation is the first clean monetization point |
| 3. Recommendation | DALC returns recommended jurisdiction, likely setup path, and next actions | `request_updated`, `quote_prepared`, `task_created` | Draft recommended setup path and complexity score | Validate recommendation and prepare commercial scope | Move to package or quote |
| 4. Document collection | User uploads required docs and answers setup questions | Task timeline, document tasks, conversation entries | Detect missing information and surface blockers | Review documents, coordinate corrections | Package remains active or deposit is collected |
| 5. Payment and initiation | User accepts quote or package and pays deposit or full amount | `quote_sent`, `quote_accepted`, `payment_captured` | Suggest urgency or premium handling where relevant | Confirm scope, lock execution, assign partner or internal owner | Deposit, package fee, rush fee if applicable |
| 6. Execution | DALC coordinates registration, banking intros, and admin follow-through | `task_completed`, partner assignments, booking or specialist actions | Monitor progress signals and recommend next tasks | Drive process with partners and follow through on blockers | Additional upsells for admin support, banking, or founder concierge |
| 7. Completion and renewal | User gets confirmed setup and support for next-stage admin | `request_fulfilled`, renewal tasks scheduled | Flag renewal timeline and adjacent opportunities | Close request and transition to retention support | Renewal revenue, retainer, membership, concierge expansion |

## Consultation Flow

The consultation should not be a vague sales call. It should do three concrete things:

1. identify the correct commercial path
2. remove setup ambiguity
3. justify the next paid step

Minimum consultation output:

| Output | Required |
| --- | --- |
| Business profile snapshot | Yes |
| Jurisdiction recommendation | Yes |
| Scope of work | Yes |
| Timeline estimate | Yes |
| Quote or package recommendation | Yes |

## Recommendation Flow

DALC should not pretend the recommendation engine is fully automated at launch.

Recommendation logic should combine:

1. business type
2. founder goals
3. budget sensitivity
4. expected banking needs
5. visa requirements
6. speed requirements

The recommendation output should feed directly into a quote or package path.

## Jurisdiction Logic

| Question | Why it changes routing |
| --- | --- |
| Does the user need local market flexibility? | May favor mainland path |
| Does the user want cost efficiency and simplicity? | May favor free zone path |
| Is banking a key concern? | Needs stronger operator validation |
| Is residency bundled with the setup? | Increases setup complexity and monetization value |
| Is the business structure unusual? | Forces specialist review |

DALC should never claim final jurisdiction certainty without operator or partner validation.

## Document Collection

| Document area | Why it matters |
| --- | --- |
| Identity and passport info | Required for setup progression |
| Business activity details | Needed for licensing fit |
| Shareholder or team details | Needed for company structure |
| Residency or visa status | Affects setup pathway |
| Banking-related context | Affects downstream feasibility |

Document collection should be exposed as visible progress, not hidden email chasing.

## Payment Logic

The business setup flow should monetize in stages.

| Stage | Payment type |
| --- | --- |
| Early ambiguity | Paid consultation |
| Approved path | Quote acceptance or package payment |
| Complex custom work | Deposit before full execution |
| Renewal and admin continuity | Recurring service or retainer |

## Upsells

The right upsells are adjacent, not random.

1. residency support
2. admin and compliance follow-through
3. banking support
4. founder concierge support
5. membership for high-frequency users

## AI Involvement

AI should:

1. classify the setup need
2. extract entities and constraints
3. score complexity and monetization value
4. draft recommendation summaries
5. draft operator briefs and missing-information prompts

AI should not finalize jurisdiction, legal claims, or bankability promises.

## Operator Involvement

Operators should own:

1. consultation quality
2. recommendation validation
3. document review
4. quote creation
5. partner coordination
6. renewal and failure recovery

## Completion And Renewal Logic

Completion is not the moment the entity is formed. Completion is when the user has crossed the main setup objective and DALC has transitioned them into a next-stage support path.

Renewal logic should begin at setup completion, not a few days before expiry.

## Commercial Rule

The business setup flow should feel like a high-trust execution product, not a lead form for offshore agents.