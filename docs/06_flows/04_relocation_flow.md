# Relocation Flow

## Flow Objective

The relocation flow should take a user from first expression of intent to fully executed move support without making the user coordinate the process manually.

DALC should own the sequence, surface the next action, and decide when humans need to step in.

## End-To-End Journey

| Stage | User journey | Frontend screens and states | Backend events and objects | AI actions | Human concierge actions | Monetization points |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Entry | User lands from search, referral, homepage, or concierge request and expresses intent to move | Homepage command input, relocation landing page, request form, consultation CTA | `intent_created` event, draft `intent` object | Classify relocation intent, detect family, timing, housing, schooling, and urgency signals | None unless the request is immediately high-risk or high-value | None yet or immediate consultation suggestion |
| 2. Qualification | User provides core move details | Qualification screen with timeline, nationality, family structure, budget band, move purpose | `profile_updated`, `intent_enriched`, possible `request_created` | Fill missing fields, score complexity, recommend consultation or operator-led route | Review high-complexity cases if handoff is required | Paid relocation consultation |
| 3. Planning | User receives an initial relocation path | Planning screen, request tracker, checklist UI | `request` opened, first `tasks` created, `conversation` thread started | Recommend next-step sequence and generate operator brief | Confirm scope, define service path, assign owner | Consultation converted into package or advisory fee |
| 4. Documentation | User uploads documents and missing information | Document checklist, upload state, missing-items state | `task_created`, `task_completed`, document status updates | Detect missing or inconsistent inputs, suggest next documents | Verify submissions, request corrections, coordinate partner requirements | Document handling or package fee included in plan |
| 5. Execution | Visa, housing, schooling, banking, and transport work begins | Request detail page with stage tracker and action cards | `quote_created`, `quote_sent`, partner assignment, service tasks | Prioritize subflows, surface risks, suggest bundled needs | Manage quotes, partner routing, follow-up, and scheduling | Package fee, referral revenue, execution fee, deposits |
| 6. Fulfillment | User confirms final move support outputs | Fulfillment timeline, booking confirmations, completion screen | `booking_created`, `payment_captured`, `request_fulfilled` | Detect adjacent upsells and repeat needs | Coordinate final delivery and recovery if anything slips | Referral, commission, transport, stay, and concierge revenue |
| 7. Post-move | User is now in Dubai and needs ongoing support | Post-move dashboard, concierge CTA, membership surface | Follow-up tasks, repeat request triggers, membership candidate flag | Detect repeat-need patterns and retention opportunities | Transition user to ongoing concierge support | Membership, concierge retainers, lifestyle upsells |

## Frontend Screens And States

| Screen | Required states |
| --- | --- |
| Relocation landing page | Cold visitor, command input active, consultation CTA, saved progress |
| Qualification flow | Empty, partially complete, validation error, handoff-required |
| Consultation booking | Available slot, paid confirmation, follow-up pending |
| Request tracker | New, in progress, waiting on user, waiting on partner, quoted, paid, fulfilled |
| Document center | Missing docs, uploaded, under review, correction required |
| Quote screen | Draft ready, sent, accepted, expired, paid |
| Completion screen | Fulfilled, follow-on support suggested |

## Documents And Dependency Logic

| Dependency area | Typical inputs | Dependency rule |
| --- | --- | --- |
| Residency or visa | Passport, nationality, purpose, timeline | Visa planning cannot finalize without identity and purpose context |
| Family move | Spouse and children details, school requirements | Schooling and housing support depend on family profile completeness |
| Housing support | Budget, preferred areas, family size, move date | Property recommendations should not start without timeline and budget band |
| Banking support | Residency status, company status if relevant | Banking introductions depend on user path and legal status |
| Transport setup | Arrival timing, family size, duration | Transport recommendations depend on move stage and budget |

## Edge Cases

1. User wants to move but has no confirmed date.
2. User wants family relocation but only provides personal details.
3. User mixes relocation with business setup in one request.
4. User asks for legal certainty DALC cannot automate.
5. User submits premium intent but refuses consultation.
6. User goes off-platform to compare with brokers and returns later.

## Risk States

| Risk state | Why it matters | Required response |
| --- | --- | --- |
| Incomplete profile | Execution will be low quality | Ask targeted questions before routing further |
| Misclassified move complexity | User may be forced into the wrong path | Escalate to operator review |
| Missing documents | Execution stalls silently | Convert into visible blocked task state |
| Partner delay | Trust can collapse quickly | Escalate and expose recovery path |
| Quote aging | High-intent user may go cold | Trigger follow-up task and urgency alert |
| Overpromised support | Brand damage | Limit claims to what DALC can truly fulfill |

## Required Admin Tools

1. Operator queue filtered by relocation priority
2. Request detail console with timeline, tasks, documents, and payments
3. Quote builder and approval flow
4. Partner assignment and SLA tracking
5. Document review workflow
6. Escalation controls for blocked or urgent cases
7. Follow-up reminders and renewal prompts

## Metrics That Define Success

| Metric | Why it matters |
| --- | --- |
| Intent-to-consultation conversion | Measures whether DALC captures serious relocation demand |
| Consultation-to-package conversion | Measures commercial clarity and trust |
| Time to first human response | Measures operational responsiveness |
| Time to quote | Measures execution discipline |
| Fulfillment completion rate | Measures whether DALC actually gets moves across the line |
| Follow-on service attachment rate | Measures expansion into housing, transport, schooling, and concierge |
| Post-move retention | Measures whether DALC becomes an operating relationship |

## v1 Version

1. Command input and relocation intake
2. Paid consultation
3. Manual operator case management
4. Document checklist
5. Quote and payment path
6. Basic partner coordination for a few approved workflows

## v2 Version

1. Smarter profile enrichment
2. Better dependency graph between visa, housing, schooling, and banking
3. Automated reminders and renewal logic
4. More structured partner routing and SLA optimization
5. Stronger membership conversion after fulfillment

## What To Fake Manually First

1. Visa recommendation logic behind an operator review
2. School shortlist creation through manual operator curation
3. Housing matching through partner-assisted workflows
4. Banking and transport introductions through controlled partner handoff

DALC should fake orchestration manually before it fakes intelligence publicly.