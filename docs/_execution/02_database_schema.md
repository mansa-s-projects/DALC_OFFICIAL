# Database Schema

## Schema Rules

This schema is designed for Supabase and should be implemented with these rules:

1. Use `auth.users` as the source of truth for authenticated users.
2. Put application tables in `public`.
3. Use `uuid` primary keys everywhere.
4. Use `timestamptz` for all timestamps.
5. Prefer explicit lifecycle states over loosely interpreted booleans.
6. Use `jsonb` only for flexible metadata, not for core relational entities.
7. Every execution-critical record must be traceable to user, request, operator, or partner context.

## Relationship Spine

The DALC schema should be understood through one main chain:

`auth.users -> profiles -> intents -> requests -> tasks / quotes / bookings -> payments`

Supporting relationships:

- `membership` attaches to `auth.users`
- `partners` and `services` support fulfillment
- `conversations` and `operator_actions` create the operational timeline

## users

DALC should not create a duplicate `public.users` table. Use Supabase `auth.users` as the users table.

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key from Supabase Auth |
| `email` | `text` | Managed by Supabase Auth |
| `phone` | `text` | Optional login/contact identifier |
| `raw_user_meta_data` | `jsonb` | Auth metadata |
| `created_at` | `timestamptz` | Auth creation time |
| `last_sign_in_at` | `timestamptz` | Last active timestamp |

### Relationships

- One `users` record maps to one `profiles` record.
- One `users` record can have many `intents`, `requests`, `quotes`, `bookings`, `payments`, and `membership` rows over time.

### Indexes

- Supabase manages the primary key and auth indexes.
- Add application-side lookup support through foreign key indexes on dependent tables.

### Lifecycle States

Use an application-level state on the profile instead of duplicating account status here.

## profiles

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key and foreign key to `auth.users.id` |
| `full_name` | `text` | Display name |
| `whatsapp_number` | `text` | Primary service channel |
| `nationality` | `text` | Useful for visa, relocation, and legal flows |
| `current_city` | `text` | Current user location |
| `target_move_date` | `date` | Target relocation date |
| `budget_band` | `text` | High-level spend capacity |
| `family_status` | `text` | Single, couple, family, etc. |
| `children_count` | `integer` | Relevant for school and housing support |
| `preferred_language` | `text` | Service preference |
| `lifecycle_stage` | `text` | Lead, active, fulfilled, retained, churned |
| `membership_tier` | `text` | None, core, premium, elite |
| `acquisition_source` | `text` | Attribution input |
| `notes` | `jsonb` | Non-core structured context |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Mutation timestamp |

### Relationships

- `profiles.id -> auth.users.id`
- One profile can support many intents and requests.

### Indexes

- `profiles(lifecycle_stage)`
- `profiles(membership_tier)`
- `profiles(acquisition_source)`

### Lifecycle States

- `lead`
- `active`
- `fulfilled`
- `retained`
- `churned`

## intents

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key to `auth.users.id` |
| `profile_id` | `uuid` | Foreign key to `profiles.id`, nullable |
| `source_channel` | `text` | Homepage, concierge, WhatsApp, admin, API |
| `raw_input` | `text` | Original user wording |
| `normalized_input` | `text` | Cleaned or summarized version |
| `intent_type` | `text` | Relocation, business_setup, concierge, booking, lifestyle |
| `intent_subtypes` | `text[]` | Villa, school, residency, yacht, etc. |
| `entities` | `jsonb` | Parsed structured entities |
| `urgency_score` | `integer` | Recommended scale 1-5 |
| `complexity_score` | `integer` | Recommended scale 1-5 |
| `monetization_score` | `integer` | Recommended scale 1-5 |
| `confidence_score` | `numeric(5,2)` | Confidence in classification |
| `recommended_flow` | `text` | Self_serve, consultation, quote, operator_led, hybrid |
| `recommended_next_action` | `text` | User-facing next step |
| `handoff_required` | `boolean` | Whether human review is mandatory |
| `handoff_reason` | `text` | Why human review is needed |
| `status` | `text` | New, analyzed, routed, converted, closed |
| `context` | `jsonb` | User or system context snapshot |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Mutation timestamp |
| `resolved_at` | `timestamptz` | Optional terminal timestamp |

### Relationships

- `intents.user_id -> auth.users.id`
- `intents.profile_id -> profiles.id`
- One intent can create one or more requests.

### Indexes

- `intents(user_id, created_at desc)`
- `intents(intent_type, status)`
- `intents(handoff_required, created_at desc)`
- `intents(monetization_score desc, created_at desc)`

### Lifecycle States

- `new`
- `analyzed`
- `routed`
- `converted`
- `closed`

## requests

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key to `auth.users.id` |
| `intent_id` | `uuid` | Foreign key to `intents.id` |
| `request_type` | `text` | Relocation_case, consultation, custom_quote, booking_support |
| `title` | `text` | Short operational title |
| `summary` | `text` | Internal summary |
| `status` | `text` | Open, in_progress, waiting_user, waiting_partner, quoted, booked, fulfilled, cancelled, failed |
| `priority` | `text` | Low, normal, high, urgent, VIP |
| `current_stage` | `text` | Intake, qualification, quoting, payment, fulfillment, follow_up |
| `owner_operator_id` | `uuid` | Nullable operator owner |
| `source_channel` | `text` | Where it came from |
| `sla_deadline_at` | `timestamptz` | Operational deadline |
| `monetization_stage` | `text` | Unqualified, consultation, quoted, deposit_paid, paid, retained |
| `quoted_total_amount` | `numeric(12,2)` | Optional commercial value |
| `paid_total_amount` | `numeric(12,2)` | Collected amount to date |
| `metadata` | `jsonb` | Flexible request context |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Mutation timestamp |
| `closed_at` | `timestamptz` | Terminal timestamp |

### Relationships

- `requests.user_id -> auth.users.id`
- `requests.intent_id -> intents.id`
- One request can have many tasks, quotes, bookings, conversations, and operator actions.

### Indexes

- `requests(user_id, created_at desc)`
- `requests(status, priority, sla_deadline_at)`
- `requests(owner_operator_id, status)`
- `requests(intent_id)`
- `requests(monetization_stage, status)`

### Lifecycle States

- `open`
- `in_progress`
- `waiting_user`
- `waiting_partner`
- `quoted`
- `booked`
- `fulfilled`
- `cancelled`
- `failed`

## tasks

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `request_id` | `uuid` | Foreign key to `requests.id` |
| `parent_task_id` | `uuid` | Self-reference for nested work, nullable |
| `assigned_operator_id` | `uuid` | Nullable operator assignee |
| `partner_id` | `uuid` | Nullable assigned partner |
| `service_id` | `uuid` | Nullable service link |
| `task_type` | `text` | Collect_docs, prepare_quote, confirm_partner, etc. |
| `title` | `text` | Short task name |
| `description` | `text` | Explicit work detail |
| `status` | `text` | Pending, in_progress, blocked, completed, cancelled |
| `priority` | `text` | Low, normal, high, urgent |
| `blocked_by_task_id` | `uuid` | Nullable dependency link |
| `due_at` | `timestamptz` | Deadline |
| `output` | `jsonb` | Completion artifact |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Mutation timestamp |
| `completed_at` | `timestamptz` | Completion timestamp |

### Relationships

- `tasks.request_id -> requests.id`
- `tasks.partner_id -> partners.id`
- `tasks.service_id -> services.id`
- Tasks are the execution breakdown of a request.

### Indexes

- `tasks(request_id, status)`
- `tasks(assigned_operator_id, status, due_at)`
- `tasks(partner_id, status)`
- `tasks(blocked_by_task_id)`

### Lifecycle States

- `pending`
- `in_progress`
- `blocked`
- `completed`
- `cancelled`

## quotes

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `request_id` | `uuid` | Foreign key to `requests.id` |
| `user_id` | `uuid` | Foreign key to `auth.users.id` |
| `version` | `integer` | Quote version number |
| `status` | `text` | Draft, sent, accepted, rejected, expired, paid |
| `currency` | `text` | Default `AED` |
| `subtotal_amount` | `numeric(12,2)` | Before fees |
| `fee_amount` | `numeric(12,2)` | DALC fee |
| `commission_amount` | `numeric(12,2)` | Commission component if relevant |
| `total_amount` | `numeric(12,2)` | Total due |
| `deposit_amount` | `numeric(12,2)` | Optional upfront payment |
| `line_items` | `jsonb` | Structured quote lines |
| `expires_at` | `timestamptz` | Quote expiry |
| `accepted_at` | `timestamptz` | Acceptance timestamp |
| `rejected_at` | `timestamptz` | Rejection timestamp |
| `created_by` | `uuid` | Operator or system creator |
| `approved_by` | `uuid` | Optional approver |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Mutation timestamp |

### Relationships

- `quotes.request_id -> requests.id`
- `quotes.user_id -> auth.users.id`
- One quote may lead to one or more payments and bookings.

### Indexes

- `quotes(request_id, version desc)`
- `quotes(user_id, status)`
- `quotes(status, expires_at)`

### Lifecycle States

- `draft`
- `sent`
- `accepted`
- `rejected`
- `expired`
- `paid`

## bookings

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `request_id` | `uuid` | Foreign key to `requests.id` |
| `quote_id` | `uuid` | Foreign key to `quotes.id`, nullable |
| `user_id` | `uuid` | Foreign key to `auth.users.id` |
| `partner_id` | `uuid` | Fulfillment partner |
| `service_id` | `uuid` | Booked service |
| `booking_type` | `text` | Stay, transport, experience, concierge_execution |
| `status` | `text` | Pending, confirmed, in_service, completed, cancelled, failed |
| `start_at` | `timestamptz` | Service start |
| `end_at` | `timestamptz` | Optional service end |
| `location_text` | `text` | Human-readable location |
| `headcount` | `integer` | Number of guests or users |
| `booking_reference` | `text` | External or internal reference |
| `supplier_cost` | `numeric(12,2)` | Underlying cost |
| `customer_price` | `numeric(12,2)` | What user pays |
| `margin_amount` | `numeric(12,2)` | DALC margin |
| `special_requirements` | `jsonb` | Notes and requirements |
| `confirmed_at` | `timestamptz` | Confirmation timestamp |
| `cancelled_at` | `timestamptz` | Cancellation timestamp |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Mutation timestamp |

### Relationships

- `bookings.request_id -> requests.id`
- `bookings.quote_id -> quotes.id`
- `bookings.partner_id -> partners.id`
- `bookings.service_id -> services.id`

### Indexes

- `bookings(user_id, start_at desc)`
- `bookings(partner_id, status, start_at)`
- `bookings(request_id, status)`

### Lifecycle States

- `pending`
- `confirmed`
- `in_service`
- `completed`
- `cancelled`
- `failed`

## payments

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key to `auth.users.id` |
| `request_id` | `uuid` | Nullable request link |
| `quote_id` | `uuid` | Nullable quote link |
| `booking_id` | `uuid` | Nullable booking link |
| `membership_id` | `uuid` | Nullable membership link |
| `payment_type` | `text` | Consultation, deposit, package, booking, membership, rush_fee |
| `provider` | `text` | Stripe or other provider |
| `provider_payment_ref` | `text` | External provider ID |
| `status` | `text` | Pending, authorized, captured, failed, refunded, partially_refunded |
| `amount` | `numeric(12,2)` | Gross amount |
| `currency` | `text` | Default `AED` |
| `fee_amount` | `numeric(12,2)` | Processor or DALC fee if tracked |
| `captured_at` | `timestamptz` | Capture time |
| `refunded_at` | `timestamptz` | Refund time |
| `failure_reason` | `text` | Optional failure detail |
| `metadata` | `jsonb` | Provider response snapshot |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Mutation timestamp |

### Relationships

- `payments.user_id -> auth.users.id`
- Optional links to `requests`, `quotes`, `bookings`, and `membership`

### Indexes

- `payments(user_id, created_at desc)`
- `payments(status, payment_type)`
- `payments(request_id)`
- `payments(provider, provider_payment_ref)` unique

### Lifecycle States

- `pending`
- `authorized`
- `captured`
- `failed`
- `refunded`
- `partially_refunded`

## membership

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key to `auth.users.id` |
| `tier` | `text` | Core, premium, elite |
| `status` | `text` | Trialing, active, past_due, cancelled, expired |
| `billing_interval` | `text` | Monthly or annual |
| `amount` | `numeric(12,2)` | Recurring charge |
| `currency` | `text` | Default `AED` |
| `billing_provider` | `text` | Payment backend |
| `external_subscription_id` | `text` | Provider reference |
| `priority_multiplier` | `numeric(5,2)` | Used in queue ranking |
| `benefits_snapshot` | `jsonb` | Locked feature entitlement snapshot |
| `starts_at` | `timestamptz` | Start timestamp |
| `renews_at` | `timestamptz` | Renewal timestamp |
| `cancelled_at` | `timestamptz` | Cancellation timestamp |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Mutation timestamp |

### Relationships

- `membership.user_id -> auth.users.id`
- Payments can reference membership.

### Indexes

- `membership(user_id, status)`
- `membership(status, renews_at)`
- `membership(tier, status)`

### Lifecycle States

- `trialing`
- `active`
- `past_due`
- `cancelled`
- `expired`

## partners

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `partner_type` | `text` | Venue, transport, legal, business_setup, school_consultant, etc. |
| `name` | `text` | Display name |
| `legal_entity_name` | `text` | Contracting identity |
| `contact_name` | `text` | Primary human contact |
| `email` | `text` | Primary email |
| `phone` | `text` | Primary phone |
| `whatsapp_number` | `text` | Preferred response channel |
| `coverage_areas` | `text[]` | Geographic coverage |
| `categories` | `text[]` | Fulfillment categories |
| `status` | `text` | Active, paused, blocked |
| `onboarding_status` | `text` | Prospect, verifying, approved, live |
| `commission_model` | `text` | Fixed, percentage, markup, referral |
| `default_commission_rate` | `numeric(5,2)` | Standard commission percent |
| `payout_terms` | `text` | Settlement terms |
| `sla_response_minutes` | `integer` | Response SLA |
| `sla_fulfillment_hours` | `integer` | Delivery SLA |
| `quality_score` | `numeric(5,2)` | Internal score |
| `metadata` | `jsonb` | Extra partner data |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Mutation timestamp |

### Relationships

- One partner can support many services, tasks, bookings, and request assignments.

### Indexes

- `partners(partner_type, status)`
- `partners(onboarding_status)`
- `partners(quality_score desc)`

### Lifecycle States

- `prospect`
- `verifying`
- `approved`
- `live`
- `paused`
- `blocked`

## services

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `partner_id` | `uuid` | Nullable if DALC-owned service |
| `service_category` | `text` | Relocation, business_setup, stay, transport, experience, concierge |
| `name` | `text` | Service name |
| `slug` | `text` | Public reference |
| `service_mode` | `text` | Self_serve, assisted, operator_led |
| `pricing_model` | `text` | Fixed, quote, package, commission |
| `base_price` | `numeric(12,2)` | Optional starting price |
| `currency` | `text` | Default `AED` |
| `commissionable` | `boolean` | Whether partner commission applies |
| `commission_rate` | `numeric(5,2)` | Optional rate |
| `requires_quote` | `boolean` | Whether quote is required |
| `requires_operator` | `boolean` | Whether operator is required |
| `active` | `boolean` | Availability flag |
| `fulfillment_sla_hours` | `integer` | Expected fulfillment timing |
| `metadata` | `jsonb` | Flexible details |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Mutation timestamp |

### Relationships

- `services.partner_id -> partners.id`
- Services can be attached to tasks and bookings.

### Indexes

- `services(service_category, active)`
- `services(slug)` unique
- `services(partner_id, active)`
- `services(requires_quote, requires_operator)`

### Lifecycle States

- `draft`
- `active`
- `paused`
- `retired`

## conversations

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `request_id` | `uuid` | Foreign key to `requests.id` |
| `user_id` | `uuid` | Nullable user reference |
| `operator_id` | `uuid` | Nullable internal actor |
| `channel` | `text` | In_app, email, whatsapp, phone_note |
| `direction` | `text` | Inbound or outbound |
| `message_type` | `text` | Message, note, file, system_update |
| `body` | `text` | Message content |
| `attachments` | `jsonb` | Optional file references |
| `visibility` | `text` | Internal or user_visible |
| `sent_at` | `timestamptz` | Event timestamp |
| `created_at` | `timestamptz` | Record creation |

### Relationships

- `conversations.request_id -> requests.id`
- Conversation entries form the request timeline.

### Indexes

- `conversations(request_id, sent_at desc)`
- `conversations(channel, sent_at desc)`

### Lifecycle States

Conversation rows are append-only. No state machine is needed beyond visibility and message type.

## operator_actions

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `request_id` | `uuid` | Foreign key to `requests.id` |
| `task_id` | `uuid` | Nullable task reference |
| `operator_id` | `uuid` | Internal actor |
| `action_type` | `text` | Assign, escalate, quote_sent, payment_marked, partner_changed |
| `action_summary` | `text` | Human-readable audit entry |
| `payload` | `jsonb` | Structured event details |
| `previous_state` | `jsonb` | Optional before snapshot |
| `new_state` | `jsonb` | Optional after snapshot |
| `visible_to_user` | `boolean` | Whether surfaced externally |
| `created_at` | `timestamptz` | Event timestamp |

### Relationships

- `operator_actions.request_id -> requests.id`
- `operator_actions.task_id -> tasks.id`

### Indexes

- `operator_actions(request_id, created_at desc)`
- `operator_actions(operator_id, created_at desc)`
- `operator_actions(action_type, created_at desc)`

### Lifecycle States

Operator actions are append-only audit records. No mutable state machine should exist here.

## How Intent Connects To Everything

Intent is the central DALC object.

It should connect to the system in this order:

1. User submits raw need.
2. DALC stores an `intent`.
3. DALC decides whether the intent is informational, monetizable, urgent, complex, or operator-bound.
4. If the intent is actionable, DALC creates a `request`.
5. The request spawns `tasks`, possibly a `quote`, later a `booking`, and finally one or more `payments`.
6. All operator and communication history attaches back to the request created from the intent.

If DALC ever creates requests without durable intents, it loses the core decision layer.

## How Requests Connect To Tasks

Requests are case containers. Tasks are execution units.

Use this rule:

- One request represents one user outcome.
- Many tasks represent the work required to fulfill that outcome.

Examples:

- A relocation request may generate tasks for consultation, visa document collection, school shortlist, housing shortlist, and airport pickup coordination.
- A business setup request may generate tasks for jurisdiction recommendation, quote prep, document verification, license submission, bank intro, and renewal reminders.

Requests should never be used as vague notes. If there is work to do, it should be represented as tasks.

## How Money Flows Through The System

DALC should support four main revenue paths:

| Flow | Trigger | Tables involved |
| --- | --- | --- |
| Consultation revenue | User needs expert guidance before execution | `requests`, `payments` |
| Package revenue | User commits to relocation or business setup scope | `quotes`, `payments`, `requests` |
| Execution revenue | User pays deposit, fee, or margin for service delivery | `quotes`, `bookings`, `payments` |
| Recurring revenue | User upgrades to membership or retainer | `membership`, `payments` |

Commercial rule:

1. Every serious high-value request should have a monetization stage.
2. Every quote acceptance should map to a payment record.
3. Every booking should have either direct revenue, commission revenue, or strategic retention value.

## Implementation Notes

1. Use Postgres enums for lifecycle states if the team wants strict schema enforcement.
2. Add RLS policies so users can only see their own records and operators can see assigned or authorized records.
3. Add triggers to maintain `updated_at` automatically.
4. Store provider payloads in `jsonb`, but keep payment status and amount in typed columns.
5. Avoid building separate schemas per vertical. DALC should run on a unified operating schema.