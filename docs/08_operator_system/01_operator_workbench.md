# Operator Workbench

## Objective

The DALC operator workbench is the internal system that turns intent into delivered outcomes.

If the user-facing product is the promise, the operator workbench is the machinery that makes the promise credible.

## Main Dashboard

The main dashboard should answer one question immediately:

**What requires action right now?**

Core dashboard modules:

| Module | Purpose |
| --- | --- |
| Priority queue summary | Shows urgent, high-value, and membership-linked requests |
| SLA risk panel | Surfaces requests close to or past target response times |
| Payment attention panel | Highlights unpaid quotes, pending deposits, and failed payments |
| Partner issue panel | Highlights supplier delay, rejection, or low-confidence assignments |
| Operator workload view | Shows queue balance and ownership distribution |

## Queue View

The queue should be the heartbeat of operations.

Required columns:

1. request ID
2. user name or account
3. request type
4. priority
5. current stage
6. monetization stage
7. membership status
8. owner
9. SLA countdown
10. last activity

Default sort order should favor:

1. urgent and premium cases
2. requests waiting on DALC, not waiting on user
3. quotes close to expiring
4. high-value cases with no recent action

## Request Detail View

The request detail view should be the single source of truth for one case.

Required sections:

| Section | Required content |
| --- | --- |
| Request summary | Intent, user goal, complexity, urgency, monetization signal |
| User context | Profile, prior requests, membership status, preferences |
| Task panel | Open, blocked, completed, and overdue tasks |
| Quote panel | Current quote, version history, acceptance status |
| Payment panel | Deposits, captured payments, failures, refunds |
| Partner panel | Assigned partner, SLA, status, quality flags |
| Timeline | Communication, system actions, operator actions |
| Risk panel | Blockers, delays, missing info, service recovery alerts |

## Task Management

Task management should map requests into executable units.

Rules:

1. every complex request needs explicit tasks
2. blocked tasks must show what they are blocked by
3. task ownership must be visible
4. due dates must be explicit on time-sensitive work

## Quote Management

Quote management should support:

1. draft quotes
2. version history
3. send and resend actions
4. acceptance and expiry tracking
5. deposit requirements

Operators should never have to assemble quote state manually from messages.

## SLA Tracking

SLA tracking should exist at three levels:

| Level | Example |
| --- | --- |
| First response SLA | Time to first human or system-owned answer |
| Quote SLA | Time from qualified request to quote sent |
| Fulfillment SLA | Time from payment to delivery or milestone completion |

The dashboard should expose SLA risk before a failure occurs.

## Escalation Controls

Required escalation actions:

1. reassign owner
2. mark urgent
3. trigger partner escalation
4. trigger service recovery
5. request management approval for refund or exception

Escalation should create operator actions automatically so the timeline remains auditable.

## Partner Assignment

Partner assignment should show:

1. candidate partners
2. current partner
3. quality score
4. response SLA
5. fulfillment SLA
6. issue history

Operators should be able to compare fit, not just choose a name from a dropdown.

## Communication Timeline

The timeline should unify:

1. user messages
2. operator notes
3. system events
4. partner updates
5. quote events
6. payment events

Without a unified timeline, DALC will lose context every time ownership changes.

## Payment Visibility

Operators need instant visibility into:

1. whether the user has paid
2. whether a deposit is required
3. whether a payment failed
4. whether a refund is pending or complete

Execution should never start blindly on high-touch work.

## Membership Priority Handling

Membership should change queue behavior, not just branding.

The workbench should visibly adjust:

1. priority score
2. response SLA target
3. service recovery urgency
4. escalation path

## AI Copilot Support

AI support inside the workbench should include:

1. request summaries
2. missing-information prompts
3. suggested next tasks
4. likely upsell prompts
5. risk flags
6. draft user responses

Operators should always stay in control of final execution decisions.

## v1 Internal Operator Console

The v1 console only needs:

1. priority queue
2. request detail view
3. task list
4. quote panel
5. payment status
6. communication timeline

If those six elements work well, DALC can operate premium service with a relatively lean system.

## Nice To Have Later

1. workload balancing automation
2. partner performance scoring dashboards
3. SLA breach forecasting
4. deeper AI copiloting
5. advanced analytics views

## Biggest Mistakes To Avoid In Ops UX

1. building pretty dashboards without action controls
2. splitting one request across too many internal screens
3. hiding payment and quote state from operators
4. treating timeline history as optional
5. making the queue sort by recency instead of business priority
