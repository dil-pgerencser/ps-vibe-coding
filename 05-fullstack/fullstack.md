# Full-Stack: Data, Access Rules, Edge Cases, Deploy

> Module 5 · Full-Stack. Add data schemas, access rules, and edge cases; stress-test and deploy.

## Deployed link
[https://vibesharing.app/view/b6a7348a-f22f-4972-b2de-ac4b418abeb3](https://vibesharing.app/view/b6a7348a-f22f-4972-b2de-ac4b418abeb3)

## Data schema
| Entity | Key fields | Notes |
|---|---|---|
| `providers` | id, slug, name, title, location, rate_usd, bio, is_rising_talent, response_rate, reply_time_hours, skills_percentile, reviews | Core provider record; slug is the URL key |
| `verification_checks` | provider_id, category, status, verified_at | One row per check (7 categories); status ∈ verified / pending / unavailable |
| `portfolio_projects` | provider_id, title, client, role, outcome, tools, client_confirmed | Portfolio items with provenance flag; `client_confirmed` drives the trust pill |
| `vouches` | provider_id, voucher_name, voucher_title, voucher_company, collaboration_year | Peer endorsements with year and relationship context |
| `imported_reputation` | provider_id, source, url, headline, relationship_verified | Linked external profiles (LinkedIn, GitHub, Behance) |
| `buyers` | id (= auth.uid()), email | Auto-created on first sign-in via `ensureBuyerRow` upsert |
| `bookings` | provider_id, buyer_id, project_title, project_desc, budget_range, target_start, is_first_booking, status | Booking requests; buyer_id enforced by RLS to match the signed-in user |
| `events` | event_name, provider_id, buyer_id, properties | Fire-and-forget analytics; one row per tracked interaction |
| `platform_metrics` | key, value, label, modifier | Stats powering the problem-context banner on the search screen |

## Access rules
**Public (anon key):** `providers`, `verification_checks`, `portfolio_projects`, `vouches`, `imported_reputation`, `platform_metrics`, `user_quotes` — read-only, no client writes.

**Authenticated only:**

- `buyers` — each user can read and write only their own row (`auth.uid() = id`). The `ensureBuyerRow` upsert runs on every sign-in so the row always exists before a booking is submitted.
- `bookings` (insert) — `WITH CHECK (auth.uid() = buyer_id)` enforced at the database level; no client can submit a booking on behalf of another user even if they manipulate the payload.
- `bookings` (select) — buyers see only their own rows.

The temporary anon-insert bridge policy (`buyer_id = null`) used during earlier prototyping was dropped as part of this module.

## Edge cases hardened
| Case | Before | After |
|---|---|---|
| Empty / first-run state | Profile screen and search grid could be blank while Supabase resolved | `renderFromStaticData()` fires synchronously on load so the page is never blank; live data overwrites silently when ready |
| Bad / malicious input | Booking submitted with `buyer_id = null`; no auth check before opening modal | `openBooking()` gates on `window.currentUser`; if not signed in, auth modal opens first with a retry callback. RLS enforces `auth.uid() = buyer_id` at the DB level regardless of client state |
| Failure / offline | Profile loading screen would silently fall through to static Marcus Reid data; booking confirm advanced to the success screen even if the DB write failed | Profile loading shows an error card with ↺ Retry + Back to search. Booking confirm shows "Sending…" while in-flight; on failure replaces the footer with an inline error message and ↺ Retry — the step does not advance until the write succeeds |

## Stress test results

- **Auth flow end-to-end:** signed up a new account via the in-prototype modal; auto-confirm was on so sign-in completed immediately; nav switched from "Sign in" to "Sign out"; `buyers` row was upserted correctly.
- **Booking with real auth:** opened the booking modal after sign-in; form data collected across two steps; "Confirm & send request" held the button in "Sending…" state during the write; booking row appeared in Supabase with the correct `buyer_id` (matching `auth.users.id`).
- **RLS enforcement:** confirmed via SQL that the old anon bridge policy was dropped; an unauthenticated insert attempt returns a 403.
- **Failure state:** with DevTools → Network → Offline, the profile loading screen showed the error card; Retry restored the skeleton and re-attempted the fetch; booking footer showed the inline error without advancing to the success screen.
- **Session restore:** refreshing the page re-establishes the session via `onAuthStateChange`; "Sign out" appears in the nav without re-authenticating.
