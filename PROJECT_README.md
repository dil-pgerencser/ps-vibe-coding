# Roster — Marketplace Trust Problem

**Product School AI Vibe Coding · Scenario 03**

---

## Hypothesis

> We believe **review-independent verification badges and early social proof on new freelancer profiles** will cause **more and earlier first hires for zero-review freelancers** among **clients actively browsing new talent**. We'll know we're right when the first-hire rate for zero-review freelancers increases.

---

## The Problem

Marketplace bookings have flattened because buyers hesitate to take a chance on providers with no reviews, and that missing trust blocks new providers from ever getting started — a classic cold-start chicken-and-egg trap.

**Domain metrics driving the design:**

| Metric | Value |
|---|---|
| Booking rate — zero-review providers | 2.3% |
| Booking rate — reviewed providers | 14% |
| Median days to first booking (new provider) | 19 days |
| Search → profile → exit without booking | 68% |

**User voice (verbatim quotes embedded in the prototype):**

- *"I'm great at my job but I'll never get a review if no one books me first. It's a chicken-and-egg trap."* — New provider, 0 bookings
- *"I wish I could see something — a verified ID, a portfolio, anything — before I commit money."* — Buyer, abandoned search
- *"The established providers are booked out for weeks. I'd try someone new if I felt safe doing it."* — Repeat buyer

---

## Scenario

**Scenario 03 · The Marketplace Trust Problem** — a freelance professional marketplace where:
- New providers cannot get booked without reviews.
- New providers cannot get reviews without being booked first.
- Buyers abandon search at 68% when browsing zero-review profiles.

**Risk type tested:** Value — do buyers actually want trust signals enough to change their hiring behaviour?

**Kill switch:** If verified badges do not lift first-hire rates, trust is not the barrier — pivot.

---

## Key Screens

### Screen 1 — Search Results Page (v3)
A search results listing with a **problem context banner** at the top. The banner surfaces the 2.3 % vs 14 % booking gap, real user quotes, and frames the test for any Show & Swap viewer without verbal setup. Cards show a **baseline "reviewed" provider** alongside the **zero-review target provider** for direct comparison.

### Screen 2 — Freelancer Profile Page (Trust Layer ON)
The full trust layer for a zero-review provider:
- **5/6 verification ring** — six badge categories: Government ID, Employment History, Portfolio Provenance, Business Registration, E&O Insurance, Payout Account. The sixth badge is deliberately "pending" with a simulate-verification button that animates the ring to 6/6.
- **Rising Talent chip** — early social proof signal for providers not yet reviewed.
- **External vouches** — four identity-verified vouches with expandable quotes and relationship proofs.
- **Imported reputation** — off-platform signals (e.g. Toptal rating, LinkedIn recommendations).
- **Reliability stats** — shown at full resolution, N labelled honestly (*n = 1 — too little to prove consistency, shown so you can judge for yourself*).
- **"What we can't tell you yet"** block — explicitly admits limits before buyers ask.
- **Risk reversal** — founding-client escrow guarantee with a slot counter (2 of 5 remaining).
- **Booking modal** — three-step flow with protections review and a success/confirmation state.

### Screen 3 — Freelancer Profile Page (Trust Layer OFF)
The toggle collapses the sidebar to a near-empty state: badges downgrade from "Client-confirmed" to "Self-reported", the Request Project button becomes disabled, and the 68 % exit stat appears inline. The gap between ON and OFF is designed to be **visible and visceral** — this is the kill-switch observation state.

---

## User Flow

```
Search Results Page
  │
  ├─ Problem context banner (2.3 % gap, quotes, baseline card)
  │
  ├─ Click zero-review profile card
  │
  └─▶ Profile Page
        │
        ├─ Trust Layer ON  ──▶ Review badges, vouches, ring progress
        │                       ──▶ Click "Book now"
        │                              ──▶ 3-step booking modal
        │                                     ──▶ Success confirmation (loop closed)
        │
        └─ Trust Layer OFF ──▶ Badges → "Self-reported", button disabled
                                ──▶ Kill-switch observable: same booking rate
                                    in both states = trust is not the barrier
```

---

## Build Decisions

### Single-file, zero-dependency HTML
All three prototype versions (`index.html`) are self-contained — no server, no build step, no network calls. Opens directly in any browser. Chosen to maximise shareability and eliminate friction for Show & Swap partners.

### Trust layer toggle as hypothesis instrument
The toggle is not a UI feature — it is the test. Removing every trust signal in one click makes the A/B comparison immediate and requires no verbal setup from the presenter. The gap between the two states is the hypothesis made tangible.

### Real data, no placeholders
Domain metrics (2.3 %, 14 %, 19 days, 68 %) and verbatim user quotes are embedded directly in the UI — in the problem banner, in card footnotes, and in the trust-OFF sidebar. This satisfies the three-ingredient rule and gives Show & Swap reviewers enough context to react as a real user would.

### Honest N labelling
Reliability stats are shown with their sample size disclosed and a caveat note. This was a deliberate choice: hiding weak data would undermine the trust thesis; showing it honestly tests whether transparency itself is a trust signal.

### Design evolution (v1 → v2 → v3)

| Version | Key change | Purpose |
|---|---|---|
| v1 | Single profile, warm dark palette, full trust layer | Establish design language and core component set |
| v2 | Peerlist-inspired reskin — cool-slate / bright-green, pill chips, tighter hierarchy | Raise fidelity to "real product" level; pass VP-of-Design test |
| v3 | Added search results view, problem context banner, baseline comparison card, "Rising Talent" chip, booking success state | Shift from demo to hypothesis test — makes the 2.3 % → 14 % gap on-screen context, not background research |

### Show & Swap learnings applied
- **v1 feedback:** Purpose of the product was unclear; the problem context banner was added in v3 to fix this without verbal setup.
- **v2 feedback:** Felt like a real product; interactivity was present but incomplete on one action button.
- **v3 feedback:** "A marketplace with a lot of verification indicators" — the hypothesis was read correctly; numbers at the top needed more framing (addressed with the banner label copy).

---

## Prototype Links

| Version | Link |
|---|---|
| v1 | https://vibesharing.app/view/9a50c46d-519f-4e5f-8520-a8ea09f377e7 |
| v2 | https://vibesharing.app/view/4508a12b-e1a2-4fbf-97d5-5230c44614c4 |
| v3 | https://vibesharing.app/view/8bcca926-bbf2-45f3-93c7-99788ee4d7ab |

---

## Repo structure

```
ps-vibe-coding/
├── PROJECT_README.md               ← this file
├── README.md                       ← course template dashboard
├── 01-velocity/
│   ├── prototype-v1.md             ← M1 Lab 1: first build + Show & Swap read
│   ├── prototype-v2.md             ← M1 Lab 2: two upgrade passes
│   └── confidence-line-reflection.md
├── 02-validation/
│   ├── validation-brief.md         ← hypothesis · risk type · kill switch
│   ├── prototype-v3.md             ← the build that tests the hypothesis
│   └── show-and-swap-notes.md      ← peer feedback
├── 03-chaining/
│   └── PROMPTS.md                  ← Living Prompt Pack
├── 04-production/
│   ├── PRD.md                      ← Living PRD
│   └── handoff-note.md             ← engineering handoff
├── 05-fullstack/
│   └── fullstack.md
└── 06-iteration/
    └── iteration.md
```
