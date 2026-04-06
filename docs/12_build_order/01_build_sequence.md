# Build Sequence

## Build Principle

DALC should be built in the order that proves the operating loop, not the order that makes the product look broad.

The correct sequence is:

1. capture demand
2. classify demand
3. open execution cases
4. close revenue
5. fulfill reliably
6. expand retention and supply depth

## Week 1

| Workstream | Priority work |
| --- | --- |
| Product | Finalize launch wedge: relocation, business setup, premium concierge |
| Engineering | Stabilize command input, `POST /api/intent`, request creation, and quote objects |
| AI | Lock v1 intent schema and routing logic |
| Ops | Define operator queue states and ownership rules |
| Monetization | Launch paid consultation product |
| Partner | Identify first 5-10 high-trust partners for relocation, setup, and premium fulfillment |

## Week 2

| Workstream | Priority work |
| --- | --- |
| Product | Ship relocation intake, business setup intake, and concierge request experience |
| Engineering | Build request tracker, task model, and initial operator console |
| AI | Add entity extraction and missing-information prompts |
| Ops | Define first SOPs for relocation, business setup, and custom concierge |
| Monetization | Add quote and deposit flow |
| Partner | Onboard first usable partner set with SLA expectations |

## Week 3

| Workstream | Priority work |
| --- | --- |
| Product | Add document intake and request stage visibility |
| Engineering | Build quote builder, payment capture, and request timeline |
| AI | Improve routing for multi-dependency and high-value intents |
| Ops | Start working from the real internal queue, not ad hoc messages |
| Monetization | Launch package sales for relocation and business setup |
| Partner | Implement structured partner assignment and feedback loop |

## Week 4

| Workstream | Priority work |
| --- | --- |
| Product | Tighten homepage positioning around command and execution |
| Engineering | Add basic event tracking for conversion and revenue visibility |
| AI | Add operator briefing and escalation flags |
| Ops | Measure response time, quote time, and fulfillment quality |
| Monetization | Start upsell logic for adjacent services |
| Partner | Remove weak partners and double down on reliable ones |

## Month 2

| Workstream | Priority work |
| --- | --- |
| Product | Expand from wedge into controlled lifestyle and booking support |
| Engineering | Add partner economics tracking, better payment attribution, and blocked-task handling |
| AI | Improve monetization scoring and follow-on request suggestions |
| Ops | Formalize recovery workflows and SLA enforcement |
| Monetization | Add execution fees, rush fees, and early repeat-user logic |
| Partner | Build stronger category depth where DALC already has demand |

## Month 3

| Workstream | Priority work |
| --- | --- |
| Product | Evaluate whether membership is operationally justified |
| Engineering | Add retention flows, renewal logic, and deeper operator tooling |
| AI | Use request outcomes and operator actions to improve routing quality |
| Ops | Mature internal console into a true workbench |
| Monetization | Launch membership only if service reliability is proven |
| Partner | Expand into agency and B2B referral channels |

## The Single Highest Leverage Milestone

The highest leverage milestone is:

**a working loop where a user submits a real request, DALC classifies it, opens a request, sends a quote, captures payment, and fulfills the outcome.**

Everything else is secondary until that loop is real.

## The Single Most Dangerous Distraction

The most dangerous distraction is building broad browsing surfaces and premium visual polish before the request, quote, payment, and fulfillment loop is proven.

## The Exact Critical Path

1. command capture
2. intent classification
3. request creation
4. operator ownership
5. quote generation
6. payment capture
7. fulfillment tracking

If any one of these breaks, DALC becomes a presentation layer instead of an operating system.
