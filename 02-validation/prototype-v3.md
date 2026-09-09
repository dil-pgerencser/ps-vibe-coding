# Prototype (v3): The Build That Tests the Hypothesis

> Module 2 · Validation. The prototype is a hypothesis test, not a demo.

## Link

`02-validation/prototype-v3/index.html` — open directly in browser, no server required.

## What it tests

**Riskiest assumption:** Clients won't trust, and therefore won't hire, a brand-new freelancer with zero reviews — regardless of price.

**Hypothesis being tested:** Review-independent verification badges (identity, portfolio confirmation, skills test, LinkedIn match, response rate) plus early social proof signals (Rising Talent chip, external vouches) will cause more and earlier first hires for zero-review freelancers among clients actively browsing new talent.

The prototype puts a real decision in front of the user: a zero-review freelancer profile with the full trust layer visible. The toggle removes every trust signal instantly, collapsing the sidebar to a "no information" empty state and changing portfolio badges from "Client-confirmed" to "Self-reported". The gap becomes visible and visceral — 5/6 badges vs. a disabled "Request project" button.

**Kill switch observable:** Toggle the trust layer OFF. If users still won't hire with all signals removed, that's baseline. If they won't hire even with all signals ON, trust signals aren't the barrier — the pivot signal is the same booking rate in both toggle states.

## Context injected (no placeholders)

- **Real user quotes on screen:**
  - "I'm great at my job but I'll never get a review if no one books me first. It's a chicken-and-egg trap." — New provider, 0 bookings (About card on profile)
  - "I wish I could see *something* — a verified ID, a portfolio, anything — before I commit money." — Buyer, abandoned search (problem banner on search page)
  - "The established providers are booked out for weeks. I'd try someone new if I felt safe doing it." — Repeat buyer (problem banner on search page)
- **Domain metrics on screen:**
  - 2.3% — Booking rate, zero-review providers (problem banner + demo bar)
  - 14% — Booking rate, reviewed providers (problem banner)
  - 19 days — Median to first booking (problem banner + card footnotes)
  - 68% — Search → profile → exit without booking (problem banner + trust-OFF sidebar)

## Iteration log (v1 → v3)

| Version | Change | Why |
|---|---|---|
| v1 | Single freelancer profile, warm dark palette, all trust signals visible | Establish the design language and core component set |
| v2 | Visual reskin to cool-slate / bright-green palette, pill meta chips, crisper hierarchy | Higher-fidelity reference closer to production quality |
| v3 | Added search results view with problem context banner, real user quotes, baseline card for comparison; trust toggle now has observable kill switch; profile shows 5/6 ring, "Rising Talent" early social proof, booking success closes the loop | Tests the hypothesis rather than just demonstrating the design — exposes the 2.3% → 14% gap as on-screen context, not background research |
