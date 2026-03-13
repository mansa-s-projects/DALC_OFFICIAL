# Supplier Onboarding

## Overview

Supplier onboarding is the process by which new service providers join the DALC platform. Currently this is a fully manual, admin-managed process. This document describes the target self-service supplier onboarding experience.

---

## Current State

**All manual — no self-service portal exists.**

Process today:
1. Supplier contacts DALC via email or contact form
2. DALC team vets the supplier off-platform
3. Admin creates supplier record in `/admin/suppliers/new`
4. Admin creates service listings manually
5. Services reviewed and published

**Limitation:** Not scalable for multi-city expansion or large supplier base.

---

## Target State: Self-Service Onboarding

### Entry Point
- Homepage CTA: "List Your Business on DALC"
- Landing page: `/supplier/apply` (new route)
- Or through B2B-targeted marketing links

### Onboarding Steps

#### Step 1: Application Form
```
Business Name          [text]
Service Category       [select]
Contact Name           [text]
Contact Email          [email]
Phone Number           [phone]
Website                [URL]
Business Overview      [textarea, 500 chars]
Trade License Number   [text] (UAE required)
Social Media Links     [optional]
```

Submission: Creates a `suppliers` record with `status = 'pending'` and triggers an email notification to the DALC admin team.

#### Step 2: DALC Review
- Admin reviews submission in `/admin/suppliers`
- Admin may request additional documents
- Admin approves → `status = active` → supplier receives welcome email

#### Step 3: Account Setup
On approval, supplier receives an email with:
- Invitation link to create a DALC account
- The invitation sets `profiles.role = 'supplier'`
- Supplier creates password + completes profile

#### Step 4: Service Listing
Supplier logs into their portal at `/supplier/dashboard`:
- Creates service listings via form
- Uploads images
- Sets pricing + availability
- Submits listings for admin review

#### Step 5: Publishing
Admin reviews supplier-created listings → approves → `is_published = true` → supplier's services go live.

---

## Supplier Requirements (UAE)

| Document | Required? | Notes |
|----------|-----------|-------|
| Trade License | ✅ | UAE mainland or free zone license |
| VAT Registration | ✅ if applicable | Required if annual revenue > AED 375k |
| DTCM License | ✅ for experiences | Dept. of Tourism license for experience providers |
| KHDA License | For education experiences | Knowledge and Human Development Authority |
| Passport Copy | ✅ | Of business owner / authorized signatory |
| Company Profile / Brochure | Optional | Helping DALC assess quality |

---

## Supplier Types + Applicable Services

| Supplier Type | Service Tables | Examples |
|---------------|---------------|---------|
| Experience Provider | `experience_services` | Desert safari, skydive, spa, dining |
| Transport Operator | `transport_services` | Supercar rental, yacht charter, jet charter |
| Property Manager | `stays_properties` | Villa management, hotel group, residence developer |
| Business Service Firm | `business_services` | DMCC formation agent, accounting firm, law firm |
| Venue Operator | `venues` | Club, restaurant, beach club |

A supplier can only be in **one category** (current constraint). For multi-category suppliers, see scalability notes.

---

## Commission Agreement

Before activation, admin sets `commission_rate` on the supplier record.

**Standard tiers:**
| Supplier Type | Default Commission |
|---------------|--------------------|
| Experiences | 15% |
| Transport — Cars | 12% |
| Transport — Yachts/Jets | 8% |
| Stays | 10% |
| Business Services | 10–15% |

Commission terms are communicated via the DALC Supplier Agreement (legal document, outside scope of this spec).

---

## Post-Onboarding Workflow

```
Application submitted (status: pending)
  ↓
DALC admin review (1–3 business days)
  ↓
Approved (status: active)
  ↓
Supplier account created
  ↓
Service listings created (supplier or admin)
  ↓
Listings reviewed + approved
  ↓
Services published
  ↓
Bookings start flowing
  ↓
Monthly payouts processed
```

---

## Scalability Notes

- **Supplier Agreement e-signing:** Integrate with DocuSign or SignNow to send and collect signed agreements digitally.
- **KYC automation:** Integrate with a UAE KYC provider (e.g. Shufti Pro) to automate Trade License verification.
- **Multi-category suppliers:** Allow suppliers to have multiple categories. Add `supplier_categories` join table.
- **Supplier tiers:** Introduce `preferred` and `premium` supplier tiers with better placement, lower commission, dedicated account manager.
- **Supplier community:** Create a notification digest / newsletter for suppliers — new platform features, best practices, seasonal opportunities.
