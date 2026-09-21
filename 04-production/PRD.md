# PRD — Roster: Trust Layer for Zero-Review Providers

**Source:** Prototype v4 (03-chaining/prototype-v4/index.html) · Scenario 03 · Product School AI Vibe Coding

---

## Problem

New freelancer providers on Roster cannot get their first booking because buyers default to established (reviewed) providers, and providers cannot accumulate reviews without first being booked. This cold-start loop is quantified: zero-review providers convert at **2.3%** vs **14%** for reviewed providers — a **6× gap**. Median time to a new provider's first booking is **19 days**, and **68%** of buyers who visit a zero-review profile exit without taking action.

**Tie to the validated hypothesis:** The validation brief identified the riskiest assumption as *"clients won't trust, and therefore won't hire, a brand-new freelancer with zero reviews regardless of price."* The hypothesis tested in v3 and extended in v4 was: *review-independent verification badges and early social proof will cause more and earlier first hires for zero-review freelancers.* The prototype operationalises that hypothesis as a trust layer that can be toggled on/off; the 2.3% → 14% booking gap is the motivating metric displayed in-product. The kill switch is: if verified badges don't lift first-hire rates, trust is not the barrier and the team should pivot.

---

## Users & jobs

- **Primary user:** Buyers actively browsing the "New Talent" tab — clients who have an active project need, have searched and not found a satisfactory reviewed provider (often because top-rated providers are booked out weeks ahead), and are willing to consider a zero-review provider if they can be given enough signal to feel safe.
- **Secondary user (affected but not primary):** Zero-review freelancer providers seeking their first booking. They are the beneficiary of the feature but are not the decision-making user being tested.
- **Job to be done:** *When I'm evaluating a freelancer who has no reviews on this platform, I need enough credible, third-party-verified information about their identity, work history, and past clients that I feel comfortable committing money — so I can hire them with confidence rather than abandoning the search.*

---

## Scope

**In:**
- Trust layer on the zero-review provider profile page: verification badge list (6 categories), verification ring (4/6 → animated to 6/6 on first booking), Rising Talent chip, platform-protection / risk-reversal block.
- Verification Detail screen: full breakdown of all 6 badge categories (Government ID, Employment History, Portfolio Provenance, Business Registration, E&O Insurance, Payout Account) with verified / pending / unavailable states and a "Retry verification" action.
- Profile Loading screen: skeleton/shimmer state shown between search list click and profile render, labelled "Verifying trust signals…"
- Search results page: problem-context banner surfacing the 2.3% / 14% / 19-day / 68% metrics and three verbatim user quotes; baseline "reviewed" provider card for direct comparison.
- Imported Reputation block: off-platform signals (LinkedIn work history, GitHub activity, Behance portfolio) shown as verified/linked rows.
- Vouches section: named past collaborators with expandable quotes and LinkedIn-relationship verification note.
- Portfolio section: tiles with "Client-confirmed" vs "Self-reported" badges.
- "What we can't tell you yet" / Honest Limits block: explicitly enumerates unavailable signals.
- 3-step booking modal: project details → protections review → success confirmation.
- Booking Error screen: clear failure explanation, saved-details assurance, and retry CTA.
- Trust layer toggle (kill-switch instrument): collapses all trust signals to reveal the baseline no-signal experience; disables the booking CTA in OFF state.

**Out (explicitly):**
- Any back-end verification infrastructure (Jumio ID check, LinkedIn cross-reference, HR data provider integration, insurance certificate review). All verification states are hardcoded in the prototype.
- Real booking or payment processing. The booking modal is a simulation; no payment is taken or held in escrow.
- Provider-side onboarding or badge-submission flows. The prototype shows the buyer-facing result only.
- Notification or messaging systems (shown as static copy).
- Any feature for reviewed / established providers. The trust layer is explicitly scoped to zero-review providers.
- Mobile-responsive behaviour below breakpoints (responsive CSS exists but is untested interactively).

---

## Requirements

| # | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| 1 | Zero-review provider profile displays a trust-signal sidebar with a verification ring, badge list, and platform-protection block | Must | Sidebar renders on profile view; ring shows correct n/6 fraction; each badge shows one of: verified (green), pending (amber), unavailable (grey); protections block is always visible |
| 2 | Clicking the verification ring or any badge navigates to the Verification Detail screen | Must | Tapping ring or any badge-button takes the user to View D; all 6 categories appear; each has the correct state label and a plain-language explanation of what the check proves |
| 3 | "Retry verification" action is present when any check is unavailable | Must | Button appears in the error banner on the Verification Detail screen; pressing it shows a brief "Checking…" state and re-enables after 2 seconds |
| 4 | Clicking "View profile" on a search result shows a skeleton loading screen before the profile | Should | View C (Profile Loading) appears for ~1.8 s with shimmer animation and "Verifying trust signals…" label before transitioning to View B |
| 5 | "No client reviews yet" empty state shown when marketplace reviews are absent | Must | Empty state renders with amber styling and the verified-signals fallback list when review count is 0 |
| 6 | "What we can't tell you yet" block is always visible on a zero-review profile | Must | Honest Limits block renders in the main column below marketplace reviews; lists unavailable items (reviews, earnings history, dispute record) and verified substitutes |
| 7 | 3-step booking modal guides buyer from project details → protections review → success confirmation | Must | Modal opens from "Request first project" CTA; step-dots advance correctly; success state names the provider and includes the "first client" social-loop note |
| 8 | Booking Error screen is reachable from the booking modal and provides a retry path | Should | "Simulate booking failure" link navigates to View E; error card explains no charge was made; "Try again" reopens the booking modal from step 1 |
| 9 | Trust layer toggle collapses all trust signals and disables the booking CTA | Must | With toggle OFF: badge pills disappear, sidebar shows the no-signal empty state with 68% exit stat, booking button is disabled, "Client-confirmed" badges downgrade to "Self-reported" |
| 10 | Imported Reputation block shows off-platform signals with verification status | Should | LinkedIn, GitHub, and Behance rows render with source icon, description, and a "Verified ✓ / Linked ✓ / Matched ✓" badge; block hidden in trust-OFF state |
| 11 | Vouches section shows named past collaborators with expandable quotes | Should | Each vouch item is collapsed by default; click/keyboard expands the quote and shows the LinkedIn-relationship verification line; second click collapses |
| 12 | Portfolio tiles distinguish client-confirmed from self-reported work | Should | "Client-confirmed" badge (green) shown in trust-ON state; degrades to "Self-reported" (grey) in trust-OFF state; clicking a tile opens a portfolio detail modal |
| 13 | Problem-context banner on the search results page surfaces the booking-rate gap and three user quotes | Should | Banner renders above the freelancer grid; shows four stat cells (2.3%, 14%, 19 days, 68%) and three quote chips with attribution |
| 14 | Baseline "reviewed" provider card is present in the search results for direct comparison | Should | Sarah Chen card renders at reduced opacity with "BASELINE — Reviewed" tag; booking button is disabled ("Unavailable") |

---

## Data & events

**What is mocked (all of it in the current prototype):**

All data is hardcoded. No API calls are made. The following would need real data sources in production:

| Data | Prototype state | Real source needed |
|---|---|---|
| Verification badge statuses (verified/pending/unavailable) | Hardcoded per provider | Jumio (ID), LinkedIn API (employment), client-outreach workflow (portfolio), Companies House / state registry (business reg), insurance cert review service (E&O), Stripe/banking API (payout) |
| Domain metrics (2.3%, 14%, 19 days, 68%) | Hardcoded in the problem banner | Booking analytics pipeline |
| User quotes | Hardcoded verbatim copy | User research repository |
| Provider profile data (name, title, rate, response stats) | Hardcoded for Marcus Reid | Provider profile database |
| Portfolio projects and client confirmations | Hardcoded PROJECTS array | Provider-submitted + client-confirmed workflow |
| Vouch content and LinkedIn relationship proof | Hardcoded for David Park and Linda Torres | Vouch-request and LinkedIn OAuth flow |
| Imported reputation (LinkedIn, GitHub, Behance) | Hardcoded rows | Third-party API integrations |
| Booking form data | Discarded on close | Booking/project database + payment processor |

**Events that should be tracked in production:**

- `profile_viewed` — provider id, trust_layer_on (bool), viewer buyer id
- `trust_layer_toggled` — direction (on/off), profile id, time on page at toggle
- `verification_detail_opened` — which badge or ring triggered it, provider id
- `retry_verification_clicked` — provider id, which badge was unavailable
- `booking_modal_opened` — provider id, step reached
- `booking_completed` — provider id, buyer id, is_first_booking (bool)
- `booking_error_shown` — provider id
- `booking_retried_after_error` — provider id
- `search_exit_without_booking` — session id, last provider viewed

The primary **north-star metric** is first-hire rate for zero-review providers (bookings where `is_first_booking = true`). The kill-switch metric is no statistically significant lift vs. the no-trust-layer baseline.

---

## Open questions

1. **Verification latency:** The Profile Loading screen simulates a 1.8 s wait. In production, how long do the real verification calls (Jumio, LinkedIn, insurance) take, and should the profile render progressively as each check resolves rather than gating the whole page?

2. **Graduated trust layer:** The current design is binary (trust ON / trust OFF). Should there be a middle state for providers who have completed 3 of 6 verifications — and what is the minimum viable badge count before the "Request project" CTA is enabled?

3. **Vouch authenticity:** Vouches are currently "LinkedIn relationship verified · Roster confirmed connection." What is the actual verification mechanism — does Roster send an email to the voucher and confirm a LinkedIn mutual connection, or is it OAuth-linked? What prevents fake vouches?

4. **Portfolio provenance confirmation:** The prototype shows "Client-confirmed" vs "Self-reported" but the confirmation flow (how Roster reaches out to named clients and records their response) is undefined. What is the opt-in rate for clients being contacted, and what is the fallback if a client declines?

5. **E&O insurance requirement:** E&O Insurance is shown as "Pending" for Marcus. Is this a hard requirement before a provider can be booked, or a displayed signal only? If hard-required, the booking CTA logic must change.

6. **Show & Swap feedback gap:** The v3 peer reviewer noted the metrics banner needed more context ("What are the numbers for?"). The v4 prototype adds a "Why this matters — real platform data" label. Has this copy been retested, or is it still an assumption?

7. **First-booking incentive loop:** The success confirmation tells the buyer "You're Marcus's first client on Roster — after the project, you'll be invited to leave a verified review." Is there a mechanism to enforce the review invitation, and what is the expected review completion rate from first-time buyers?

8. **Risk reversal scope:** Escrow, free revision, 48-hour cancellation, and dispute resolution are shown as platform protections. Are all four live policies, or is this aspirational copy included to test whether protections increase willingness to hire? If aspirational, legal review is needed before shipping.

---

*Extracted from prototype v4 · [03-chaining/prototype-v4/index.html](03-chaining/prototype-v4/index.html) · September 2026*
