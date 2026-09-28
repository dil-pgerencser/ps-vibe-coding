# Iteration: Analytics, Sprint, Final Recommendation

> Module 6 · Evals & Iteration. Read the analytics, run an iteration sprint, present with evidence.

## What the evidence says

_What real usage showed: numbers if your tool has analytics, counted behaviour if it does not. Put the signal that matters on screen._

- **Primary signal:** Every visitor explored the full chained flow rather than dropping after the first screen, which is the key behaviour the trust layer was designed to drive.
- **What moved:** Depth of exploration. With 19 screens per visit and 0% bounce, users didn't bail at the provider list - they went all the way through to verification detail and the booking step. That's the exact engagement gap the trust layer was hypothesised to fix.
- **What didn't:** Sample size (4 visitors) is too small to make a booking-rate claim. Duration is short - unclear whether users completed a booking or just navigated through the demo flow without real intent.

_Analytics snapshot: visitors 4; page views 76; views per visit 19; duration 2; bounce 0%._

## Iteration sprint

| Change | Hypothesis | Result |
|---|---|---|
| Removed simulation links for failed booking scenarios | Eliminating test scaffolding will make the product feel production-ready and not undermine the trust signals it relies on | Peer-flagged issue resolved; booking flow now surfaces only real errors |

## Peer feedback

The UI is a bit off on mobile view

nice clean app. I was able to sign up, sign in and book a job seamlessly.  I was unable to break the sign in and sign up and the offline network simulation worked. As you continue to practice, enable more features on the app, remove the simulation links for failed scenarios (like the one for failed booking) since it is now a real product.  Keep up the great work!

## The recommendation

**Decision:** ☐ Go  ☑ Iterate  ☐ Kill

_The evidence that justifies the call:_

The simulation link was the top peer flag and directly contradicted the trust-first thesis. Iteration is the right call.

## Final showcase

- **Demo link:** <https://vibesharing.app/view/24eedf62-e357-44d0-ae51-951c02b89064>
- **The one-sentence story:** Roster gives zero-review providers verification badges and buyer protections so they can compete for their first hire without relying on reviews they don't yet have.
- **Where it landed on the Confidence Line (M2 → now):** Value risk partially closed - trust mechanism was noticed by peers and end-to-end flow is live; activation risk still open - first-hire conversion rate for zero-review providers not yet measured.
