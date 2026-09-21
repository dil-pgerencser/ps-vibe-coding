# Engineering Handoff Note

> Module 4 · Production Specs. Open the black box, make the build legible to an engineer.

---

## What this is

This is a static HTML/CSS/JS prototype for **Roster's Trust Layer** — a feature designed to close a 6× booking-rate gap between zero-review and reviewed freelancers (2.3% vs 14%). It demonstrates the full buyer-side flow: searching new talent, loading a profile, reviewing trust signals and verification badges, drilling into verification detail, running the 3-step booking modal, and hitting a booking error. A kill-switch toggle in the demo bar collapses all trust signals to the bare baseline, making the A/B comparison visible in one click. There is no server, no API, no database — every state is hardcoded. The purpose of this build is to validate whether trust signals change buyer behaviour before any backend work is committed.

---

## Architecture (plain language)

**Frontend:** A single `index.html` shell imports one stylesheet and 13 script files. Navigation between the five screens (Search Results, Profile Loading, Freelancer Profile, Verification Detail, Booking Error) is handled by setting `data-screen` on `<body>`; CSS hides all screens except the active one. Two modals (Booking, Portfolio) layer on top via `position: fixed`. The trust-layer toggle adds/removes a `trust-off` class on `<body>`; CSS does the rest. No framework, no bundler, no build step.

**Backend / data:** There is no backend. All data lives in three JS files loaded as plain `<script>` tags:

- `data/metrics.js` — `METRICS` object (4 domain stats) and `USER_QUOTES` array (3 verbatim quotes). These power the problem-context banner.
- `data/providers.js` — `PROVIDERS` array (4 freelancer card definitions: 3 zero-review, 1 reviewed baseline).
- `data/projects.js` — `PROJECTS` array (3 portfolio case studies used by the portfolio modal).

Verification badge statuses (verified/pending/unavailable), vouch content, imported-reputation rows, and all profile copy are hardcoded directly in the HTML.

**Key flows:**

```
Search Results
  └─ click "View profile"
       └─ Profile Loading (1.8s setTimeout)
            └─ Freelancer Profile
                 ├─ click verification ring / badge → Verification Detail
                 │     └─ "Retry verification" (2s fake fetch, button re-enables)
                 └─ click "Request first project"
                       └─ Booking Modal step 1 (project details)
                            └─ step 2 (protections review)
                                 └─ step 3 (success — ring animates 4/6 → 6/6)
                                 OR
                                 └─ "Simulate booking failure" → Booking Error screen
                                       └─ "Try again" → reopens Booking Modal step 1
```

---

## What's solid vs. what's duct tape

| Area | State | Notes |
|---|---|---|
| Screen routing | Solid | `SCREENS` constants + `showScreen()` in `core/router.js`; named `data-screen` values throughout; easy to extend |
| CSS architecture | Solid | Single `css/main.css`; CSS custom properties for the design token set; `prefers-reduced-motion` respected; responsive breakpoints at 960 / 700 / 480 px |
| Trust-toggle kill switch | Solid | Pure CSS — `body.trust-off .trust-visible { display: none }` — zero JS coupling; reliable for show-and-swap demos |
| Data separation | Solid | METRICS, PROVIDERS, PROJECTS are clean data objects decoupled from display; ready to swap in a real API response |
| Booking modal | Solid | 3-step state machine with back/forward, step-dot progress, and ring animation on success; all edge cases handled |
| Accessibility | Mostly solid | ARIA labels, roles, focus management on modals, keyboard vouch accordion, Escape-to-close; focus trap on modals is absent |
| Profile Loading screen | Duct tape | A `setTimeout(1800ms)` simulates a real async profile fetch; in production this must be replaced with actual API latency handling and progressive rendering |
| Verification badge states | Duct tape | All six badge statuses (verified/pending/unavailable) are hardcoded in the HTML for Marcus Reid only; there is no logic that reads from PROVIDERS or computes states dynamically |
| Booking form data | Duct tape | Form fields are rendered into the modal via innerHTML template strings; input values are never read, validated, or submitted anywhere |
| Portfolio content | Duct tape | The "Client-confirmed" badge in the portfolio modal reflects `PROJECTS[n].status` but the trust-layer degradation (confirmed → self-reported) is hardcoded in the HTML, not driven by the data object |
| Retry verification | Duct tape | The button disables for 2 seconds then re-enables; no state actually changes; "Business Registration — Unavailable" remains unavailable after retry |
| Booking error | Duct tape | Reached only via the "Simulate booking failure" link, not by any real failure condition; the error copy says "your project details have been saved" — they aren't |
| Mobile CTA | Duct tape | Rendered in HTML for Marcus Reid only; not driven by PROVIDERS; shows at the `<960px` breakpoint but is untested interactively |

---

## Risks & assumptions for the team

1. **All verification is cosmetic.** Government ID (Jumio), Employment History (LinkedIn cross-reference), Portfolio Provenance (client-outreach confirmation), Business Registration (registry API), E&O Insurance (certificate review), and Payout Account (banking API) are display states only. The integrations, SLAs, failure modes, and data-retention obligations for each are undefined.

2. **Platform protections are aspirational copy.** Escrow, free revision, 48-hour cancellation, and dispute resolution are shown as active guarantees in the booking modal. None are implemented. Legal review is required before any of this copy goes live.

3. **Only Marcus Reid is fully wired.** Clicking Priya Sharma or James Okafor navigates to Marcus Reid's profile. PROVIDERS has the right data shape but the profile screen reads hardcoded HTML, not the array. The first real engineering task is connecting the profile screen renderer to PROVIDERS.

4. **The 2.3% / 14% booking gap is the hypothesis, not a proven result.** These metrics are real platform data used to motivate the design, but the trust layer has not yet been A/B tested. The kill-switch toggle is the instrument for that test — shipping it to production without instrumentation would waste the validation opportunity. Wire the `trust_layer_toggled` event before launch.

5. **No event tracking exists.** The PRD defines nine events (`profile_viewed`, `trust_layer_toggled`, `verification_detail_opened`, `booking_completed`, `booking_error_shown`, etc.). None are implemented. Without them, the hypothesis cannot be confirmed or killed.

6. **No authentication, sessions, or buyer identity.** The booking flow collects a project title, description, budget, and start date — then discards them. There is no concept of a logged-in buyer.

7. **file:// protocol only.** The prototype is built without a server. Adding ES modules, fetch calls, or any import/export syntax will break it when opened directly. Use a local server (e.g. `npx serve` or VS Code Live Server) the moment any real data loading is introduced.

---

## How to run it

**No setup required — open directly in a browser:**

```
open 04-production/prototype-v5/index.html
```

Or via a local server to prepare for the next iteration:

```bash
# Node
npx serve 04-production/prototype-v5

# Python
python -m http.server 8080 --directory 04-production/prototype-v5
```

Then open `http://localhost:3000` (serve) or `http://localhost:8080` (Python).

**File map for the first engineer:**

| If you want to… | Go to… |
|---|---|
| Change a screen name or add a screen | `core/router.js` (SCREENS) + `css/main.css` (view router) + `index.html` (add screen div) |
| Update domain metrics or user quotes | `data/metrics.js` |
| Add or edit a provider | `data/providers.js` — then wire the profile renderer to read from it |
| Edit portfolio case studies | `data/projects.js` |
| Change booking modal copy or steps | `components/booking-modal.js` |
| Change design tokens (colors, radius, shadow) | `css/main.css` `:root` block at the top |
| Add a real verification API call | Replace `screens/profile-loading.js` setTimeout with a fetch; update badge states from the response |
| Add event tracking | Each screen JS file is the right place — instrument at the `showScreen()` call site in `core/router.js` or at the interaction site in the relevant screen file |

---

*Handoff written against prototype v5 · [04-production/prototype-v5/index.html](prototype-v5/index.html) · September 2026*
