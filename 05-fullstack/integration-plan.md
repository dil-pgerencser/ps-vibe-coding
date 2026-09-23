# Integration Plan — Prototype v6 → Full-Stack

> Module 5 · Full-Stack. Wire the prototype to a real backend.

---

## Current Status

The prototype has two distinct integration layers at different levels of completion.

**Done (live Supabase reads):**
- Search results grid — `providers` + `verification_checks` fetched via `Promise.all` in `screens/search-results.js`; static data pre-renders immediately as fallback, live data re-renders on top
- Platform metrics banner — `platform_metrics` table fetched in the same `Promise.all`
- Profile loading screen — `fetchProviderProfile(slug)` runs a full nested join (`providers` + `verification_checks` + `portfolio_projects` + `vouches` + `imported_reputation`) during the loading animation and stores the result in `window.currentProvider`

**Fetched but silently discarded:**
- `window.currentProvider` is written by `profile-loading.js` but read by nothing — the freelancer profile, verification detail, booking error, and booking modal screens are 100% static HTML for Marcus Reid

**Defined but never called:**
- `submitBooking()` in `lib/supabase.js` — booking modal collects four fields and discards them at `nextStep()`
- `trackEvent()` in `lib/supabase.js` — no call sites anywhere in the codebase

**No DB backing at all:**
- Portfolio modal reads from static `data/projects.js`; `portfolio_projects` table is never queried by the client
- Skills test verification (appears in profile HTML, trust pills, and Honest Limits) — not in the schema, not in the seed, no `CATEGORY_LABELS` entry
- User quotes (`USER_QUOTES`) — static JS array with no DB equivalent table

---

## Data Audit — Hardcoded Values to Replace

### A. Values that exist in the DB but aren't rendered from it

| Location | Hardcoded value | DB source |
|---|---|---|
| `index.html` demo bar | `"2.3% → 14% booking-rate gap"` | `platform_metrics` |
| Profile screen hero | `"Marcus Reid"`, `"UX Designer · San Francisco, CA"` | `providers` |
| Profile screen hero | `"0 Reviews · New Provider"`, `"Joined 3 weeks ago"` | `providers.reviews`, `providers.joined_at` |
| Profile screen hero | `"⚡ Rising Talent — Week 3"`, `"Top 12% of new providers"` | `providers.rising_talent_week`, `rising_talent_percentile` |
| Profile screen hero trust stats | `94%`, `Passed`, `<2 hrs` | `providers.response_rate_pct`, `providers.avg_reply_hours` |
| Profile screen bio | Full bio paragraph | `providers.bio` |
| Profile screen vouches | David Park / Stripe quote, Linda Torres / NovaCare quote | `vouches` table |
| Profile screen imported reputation | LinkedIn, GitHub, Behance rows | `imported_reputation` table |
| Profile screen portfolio tiles | `✓ Client-confirmed` vs `Self-reported` badges | `portfolio_projects.client_confirmed` |
| Verification detail heading | `"Marcus Reid · 4 verified · 1 pending · 1 unavailable"` | computed from `verification_checks` |
| All 6 `vd-proof` paragraphs and dates | Full text + `Aug 19, 2026` etc | `verification_checks.proof_detail`, `verified_at` |
| Booking error copy | `"Your request to book Marcus Reid"` | `window.currentProvider.name` |
| Booking modal step 2–3 | `"Marcus's first project"`, `"Request sent to Marcus"` | `window.currentProvider.name` |
| Profile sidebar ring | `"4/6"`, `"Top 12% of new providers"` | computed from `verification_checks.status` |
| Mobile sticky CTA | `"Marcus Reid"`, `"$75/hr · Available now"` | `providers.name`, `rate_usd`, `available` |
| Trust-off sidebar stat | `"68%"` | `platform_metrics.exit_without_booking` |

### B. Values with no DB backing yet

| Location | Hardcoded value | What to do |
|---|---|---|
| Profile HTML | `"Passed"` UX skills test, `"87th percentile"` | Add `skills_test` row to `verification_checks` |
| Profile Honest Limits | `"UX Design skills test: 87th percentile"` | Same |
| Search results trust pill | `"✓ Skills Tested"` (Cards 1, 3) | Map from `skills_test` check |
| Profile page portfolio modal | All three case studies via `data/projects.js` | Wire `portfolio-modal.js` to DB |
| Search results card | `"⏱ Avg. 19 days to first booking — be the first"` | `platform_metrics.median_days_first_booking` |
| Booking modal step 1 | `projDate` default `"2026-09-16"` | Use `new Date()` at render time |
| User quotes in banner | `USER_QUOTES` array | Add `user_quotes` table or embed in `platform_metrics` as JSON |

### C. Known data-shape mismatches to fix before wiring

| JS code | DB shape | Fix needed |
|---|---|---|
| `renderFromStaticData()` passes camelCase metric keys to `renderBanner()` which expects snake_case | Static fallback banner always renders empty stat cells | Translate keys in `renderFromStaticData()` or normalise `METRICS` keys to snake_case |
| `portfolio-modal.js` checks `p.status === 'Client-confirmed'` (string) | DB has `client_confirmed boolean` | Map `client_confirmed: true` → `status: 'Client-confirmed'` in the fetch adapter |
| `vouches` query returns `{ voucher_title, voucher_company, collaboration_year }` | Profile HTML constructs `"Product Lead · Stripe (worked together 2023)"` | Build concatenation in render function |
| `imported_reputation.source` is `'linkedin'` / `'github'` / `'behance'` (lowercase slug) | Profile HTML uses a coloured icon div labelled `"in"`, `"GH"`, `"Be"` | Add a `SOURCE_DISPLAY` map in the renderer |
| `providers.avg_reply_hours = 1.8` (numeric) | Profile shows `"<2 hrs"` | Format: `value < 2 ? '<2 hrs' : value + ' hrs'` |
| `providers.location = 'San Francisco, CA'` | Static cards show `San Francisco` (no state) | Decide: strip state from DB values, or update static HTML |

---

## Schema to Add

### `user_quotes` table

The three verbatim buyer/provider quotes displayed in the problem-context banner have no DB backing.

```sql
create table user_quotes (
  id         uuid primary key default gen_random_uuid(),
  text       text not null,
  cite       text not null,          -- attribution line, e.g. 'Buyer · abandoned search'
  sort_order integer not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

alter table user_quotes enable row level security;
create policy "user_quotes: public read" on user_quotes for select using (true);
```

Seed:
```sql
insert into user_quotes (text, cite, sort_order) values
  ('I''m great at my job but I''ll never get a review if no one books me first. It''s a chicken-and-egg trap.',
   'New provider · 0 bookings', 1),
  ('I wish I could see something — a verified ID, a portfolio, anything — before I commit money.',
   'Buyer · abandoned search', 2),
  ('The established providers are booked out for weeks. I''d try someone new if I felt safe doing it.',
   'Repeat buyer', 3);
```

### `verification_checks` — add `skills_test` row

```sql
insert into verification_checks
  (provider_id, category, status, proof_detail, verified_at)
values (
  '11111111-0000-0000-0000-000000000001',
  'skills_test',
  'verified',
  'UX Design assessment: scored 87th percentile across information architecture, interaction design, and usability heuristics. Completed via Roster Skills.',
  '2026-08-25 00:00:00+00'
);
```

Also add `'skills_test'` to the category comment in the schema (and to `CATEGORY_LABELS` in `search-results.js`).

### `bookings` — enable anon insert for prototype

The current RLS policy gates inserts on `auth.uid()`, which is null for unauthenticated users. The prototype has no login flow yet, so booking submission will fail RLS. Add a temporary anon-insert policy:

```sql
-- Temporary until auth is wired
create policy "bookings: anon insert"
  on bookings for insert with check (buyer_id is null);
```

This allows an unauthenticated booking with no `buyer_id`. Revoke and replace with the `auth.uid()` policy once auth is live.

---

## RLS Rules

### Current policies (already applied)

| Table | Policy | Who can read/write |
|---|---|---|
| `providers` | Public read | Everyone |
| `verification_checks` | Public read | Everyone |
| `portfolio_projects` | Public read | Everyone |
| `vouches` | Public read | Everyone |
| `imported_reputation` | Public read | Everyone |
| `platform_metrics` | Public read | Everyone |
| `buyers` | Own row only | Authenticated user matching `auth.uid()` |
| `bookings` | Own rows | Authenticated user matching `auth.uid()` |
| `events` | Insert-only | Everyone (no reads via anon key) |

### Gaps and fixes

| Gap | Fix |
|---|---|
| `bookings` insert fails for unauthenticated callers | Add `"bookings: anon insert"` policy (above) as a bridge until auth is added |
| `user_quotes` table does not exist | Create with public-read RLS as shown above |
| No insert policy for `buyers` | Add when auth flow is built: `create policy "buyers: insert own" on buyers for insert with check (id = auth.uid())` |

---

## Three Sequential Build Prompts

### Prompt 1 — Schema & seed additions

```
Apply the following additions to the Supabase project (project ref: guxainjrsxswcfwpvsio).

1. Run this SQL in the Supabase SQL editor or via `supabase db query --linked`:

   -- user_quotes table
   create table user_quotes (
     id         uuid primary key default gen_random_uuid(),
     text       text not null,
     cite       text not null,
     sort_order integer not null default 0,
     active     boolean not null default true,
     created_at timestamptz not null default now()
   );
   alter table user_quotes enable row level security;
   create policy "user_quotes: public read" on user_quotes for select using (true);

   -- Seed user_quotes
   insert into user_quotes (text, cite, sort_order) values
     ('I''m great at my job but I''ll never get a review if no one books me first.',
      'New provider · 0 bookings', 1),
     ('I wish I could see something — a verified ID, a portfolio, anything — before I commit money.',
      'Buyer · abandoned search', 2),
     ('The established providers are booked out for weeks. I''d try someone new if I felt safe doing it.',
      'Repeat buyer', 3);

   -- Add skills_test verification check for Marcus Reid
   insert into verification_checks (provider_id, category, status, proof_detail, verified_at)
   values (
     '11111111-0000-0000-0000-000000000001',
     'skills_test',
     'verified',
     'UX Design assessment: 87th percentile across information architecture, interaction design, and usability heuristics.',
     '2026-08-25 00:00:00+00'
   );

   -- Temporary anon-insert for bookings (bridge until auth)
   create policy "bookings: anon insert"
     on bookings for insert with check (buyer_id is null);

2. In prototype-v6/data/metrics.js, rename the camelCase METRICS keys to snake_case to match the DB:
   booking_rate_zero_review, booking_rate_reviewed, median_days_first_booking, exit_without_booking

3. In prototype-v6/screens/search-results.js, add 'skills_test' → 'Skills Tested' to CATEGORY_LABELS.

4. In prototype-v6/lib/supabase.js, update fetchPlatformMetrics() and the DOMContentLoaded query to also
   fetch user_quotes: db.from('user_quotes').select('*').eq('active', true).order('sort_order').
   Replace USER_QUOTES static rendering in renderBanner() with the live result.

Do not change anything else. Verify by opening index.html: the stats row and quotes row should show live DB values.
```

---

### Prompt 2 — Wire `window.currentProvider` to the profile screens

```
The profile, verification detail, booking error, and booking modal screens are all static HTML hardcoded
for Marcus Reid. `window.currentProvider` already holds the full provider object from Supabase after the
profile loading screen completes — but nothing reads it. Wire it up.

Changes needed in prototype-v6:

1. screens/freelancer-profile.js — add a renderProfile(provider) function that fires on DOMContentLoaded
   (or after showScreen(SCREENS.FREELANCER_PROFILE) is called) and updates the following elements using
   window.currentProvider:
   - Provider name (hero h1, mobile CTA div, booking modal steps 2 and 3)
   - Title and location (hero p)
   - Rate (mobile CTA, booking-modal step 3 confirmation is not rate-dependent but the sidebar shows it)
   - Response rate pct, avg reply hours (trust stats grid — format avg_reply_hours < 2 as '<2 hrs')
   - Rising talent week and percentile
   - Bio paragraph text
   - The verification ring fraction (count verified checks from provider.verification_checks)
   - The badge list (render from provider.verification_checks — 7 possible categories including skills_test)

2. screens/verification-detail.js — add a renderVerificationDetail(provider) function that:
   - Updates the page subtitle counts (n verified, n pending, n unavailable) from verification_checks
   - Re-renders all vd-row elements from provider.verification_checks
   - Shows verified_at date formatted as 'MMM D, YYYY' for verified checks

3. screens/booking-error.js — replace the hardcoded "Marcus Reid" name references with
   (window.currentProvider && window.currentProvider.name) || 'this provider'

4. components/booking-modal.js — replace hardcoded "Marcus" in Steps 2 and 3 bodies with a helper:
   function providerFirstName() {
     return (window.currentProvider && window.currentProvider.name.split(' ')[0]) || 'the provider';
   }
   Use providerFirstName() in the template strings.

5. components/portfolio-modal.js — replace the PROJECTS array source with provider.portfolio_projects
   from window.currentProvider (if available); fall back to PROJECTS if null. Map client_confirmed boolean
   to status string: client_confirmed ? 'Client-confirmed' : 'Self-reported'.

6. Profile screen imported reputation rows — add a renderImportedReputation(items) function to
   screens/freelancer-profile.js. SOURCE_DISPLAY map:
   { linkedin: { icon: 'in', color: '#0a66c2', label: 'LinkedIn' },
     github:   { icon: 'GH', color: '#24292e', label: 'GitHub' },
     behance:  { icon: 'Be', color: '#ff7262', label: 'Behance' } }

7. Profile screen vouches — add a renderVouches(vouches) function.
   Concatenate: voucher_title + ' · ' + voucher_company + ' (worked together ' + collaboration_year + ')'

Maintain identical visual output for Marcus Reid. Verify by toggling the trust layer ON and OFF —
all dynamic values should appear/disappear correctly.
```

---

### Prompt 3 — Wire `submitBooking()` and `trackEvent()`

```
The booking flow collects project details (title, description, budget, start date) but discards them.
`lib/supabase.js` already has submitBooking() and trackEvent() — wire them in.

Changes needed in prototype-v6:

1. components/booking-modal.js — at the transition from Step 1 to Step 2 (inside nextStep() when
   bookingStep === 0), read and stash the form values before innerHTML is overwritten:
     window.pendingBooking = {
       projectTitle:  document.getElementById('projTitle').value,
       projectDesc:   document.getElementById('projDesc').value,
       budgetRange:   document.getElementById('projBudget').value,
       targetStart:   document.getElementById('projDate').value
     };

2. At the transition from Step 2 to Step 3 (nextStep() when bookingStep === 1), call submitBooking():
     var provider = window.currentProvider || {};
     submitBooking({
       providerId:      provider.id || null,
       buyerId:         null,          // no auth yet — buyer_id left null
       projectTitle:    window.pendingBooking.projectTitle,
       projectDesc:     window.pendingBooking.projectDesc,
       budgetRange:     window.pendingBooking.budgetRange,
       targetStart:     window.pendingBooking.targetStart || null,
       isFirstBooking:  (provider.reviews || 0) === 0
     }).catch(function(err) {
       console.error('Booking submission failed:', err);
       // Don't block the user — show Step 3 anyway; log silently
     });
     bookingStep++;
     renderStep();

3. Add trackEvent() calls at each key interaction. Add these to the relevant files:
   - core/router.js showScreen(): trackEvent('screen_viewed', { properties: { screen } })
   - components/trust-toggle.js: trackEvent('trust_layer_toggled', { properties: { direction: on ? 'on' : 'off' } })
   - screens/verification-detail.js open: trackEvent('verification_detail_opened', { providerId, properties: { trigger: 'ring_or_badge' } })
   - screens/verification-detail.js retry: trackEvent('retry_verification_clicked', { providerId })
   - components/booking-modal.js step 0 open: trackEvent('booking_modal_opened', { providerId })
   - components/booking-modal.js step 3 success: trackEvent('booking_completed', { providerId, properties: { is_first_booking: true/false } })
   - screens/booking-error.js show: trackEvent('booking_error_shown', { providerId })

4. Change the default projDate value from the hardcoded '2026-09-16' to:
     new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
   (one week from today, recalculated at render time)

Verify in the Supabase Table Editor: after a complete booking flow, a row should appear in the bookings
table with the correct project_title, budget_range, and is_first_booking = true.
Verify in the events table: a booking_completed event row should appear.
```

---

### Prompt 4 — Auth + RLS hardening

```
The prototype submits bookings with buyer_id = null under a temporary anon-insert bridge policy.
Replace it with real Supabase Auth (magic link), a minimal sign-in modal, and locked-down RLS.

───────────────────────────────────────────────────────
PART A — SQL: drop bridge, add auth-gated policies
───────────────────────────────────────────────────────

Run in the Supabase SQL editor:

  -- 1. Drop the prototype bridge
  drop policy if exists "bookings: anon insert" on bookings;

  -- 2. Buyers can insert their own row (upserted on first sign-in)
  create policy "buyers: insert own"
    on buyers for insert
    with check (id = auth.uid());

  create policy "buyers: update own"
    on buyers for update
    using (id = auth.uid());

  create policy "buyers: read own"
    on buyers for select
    using (id = auth.uid());

  -- 3. Bookings require a real session
  create policy "bookings: buyer insert"
    on bookings for insert
    with check (buyer_id = auth.uid());

  create policy "bookings: buyer read own"
    on bookings for select
    using (buyer_id = auth.uid());

  -- 4. Events: keep insert-only for everyone (already exists; add if missing)
  create policy if not exists "events: anon insert"
    on events for insert
    with check (true);

───────────────────────────────────────────────────────
PART B — lib/supabase.js: add auth helpers
───────────────────────────────────────────────────────

Add these functions after the existing client setup:

  /* ── Auth ─────────────────────────────────────────────────── */

  async function signInWithMagicLink(email) {
    const { error } = await db.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });
    if (error) throw error;
  }

  async function signOut() {
    await db.auth.signOut();
  }

  async function getCurrentUser() {
    const { data: { session } } = await db.auth.getSession();
    return session ? session.user : null;
  }

  /* Upsert buyer row on first sign-in */
  async function ensureBuyerRow(user) {
    await db.from('buyers').upsert(
      { id: user.id, email: user.email },
      { onConflict: 'id', ignoreDuplicates: true }
    );
  }

───────────────────────────────────────────────────────
PART C — components/auth-modal.js  (new file)
───────────────────────────────────────────────────────

Create prototype-v6/components/auth-modal.js with:

  /* ── Auth Modal ───────────────────────────────────────────── */

  var authCallback = null; // function to call after successful sign-in

  function openAuthModal(onSuccess) {
    authCallback = onSuccess || null;
    document.getElementById('authModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    renderAuthForm();
  }

  function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    authCallback = null;
  }

  function renderAuthForm() {
    document.getElementById('authBody').innerHTML = `
      <p style="font-size:14px;color:var(--ink2);margin-bottom:16px;">
        Enter your email — we'll send a magic link. No password needed.
      </p>
      <div class="form-group">
        <label for="authEmail">Email address</label>
        <input type="email" id="authEmail" placeholder="you@example.com" autocomplete="email" />
      </div>
    `;
    document.getElementById('authFooter').innerHTML = `
      <button class="btn btn-secondary" onclick="closeAuthModal()">Cancel</button>
      <button class="btn btn-primary" id="authSubmitBtn" onclick="handleAuthSubmit()">Send magic link →</button>
    `;
  }

  function renderAuthSent(email) {
    document.getElementById('authBody').innerHTML = `
      <div class="success-wrap">
        <div class="success-icon">✉</div>
        <h2>Check your email</h2>
        <p>We sent a magic link to <strong>${email}</strong>.<br>
           Click it to sign in — this tab will update automatically.</p>
      </div>
    `;
    document.getElementById('authFooter').innerHTML = `
      <button class="btn btn-secondary" onclick="closeAuthModal()">Close</button>
    `;
  }

  async function handleAuthSubmit() {
    var email = (document.getElementById('authEmail') || {}).value || '';
    if (!email.includes('@')) {
      document.getElementById('authEmail').style.borderColor = 'var(--red)';
      return;
    }
    var btn = document.getElementById('authSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    try {
      await signInWithMagicLink(email);
      renderAuthSent(email);
    } catch (err) {
      console.error('Magic link failed:', err);
      if (btn) { btn.disabled = false; btn.textContent = 'Send magic link →'; }
    }
  }

  /* Listen for auth state changes (fires when magic link is clicked) */
  db.auth.onAuthStateChange(async function (event, session) {
    if (event === 'SIGNED_IN' && session) {
      window.currentUser = session.user;
      await ensureBuyerRow(session.user);
      updateAuthUI(session.user);
      closeAuthModal();
      if (typeof authCallback === 'function') {
        authCallback();
        authCallback = null;
      }
      trackEvent('user_signed_in', { buyerId: session.user.id });
    }
    if (event === 'SIGNED_OUT') {
      window.currentUser = null;
      updateAuthUI(null);
    }
  });

  function updateAuthUI(user) {
    var signInBtn = document.getElementById('nav-sign-in');
    var signOutBtn = document.getElementById('nav-sign-out');
    if (!signInBtn || !signOutBtn) return;
    if (user) {
      signInBtn.style.display = 'none';
      signOutBtn.style.display = '';
      signOutBtn.textContent = user.email.split('@')[0]; // show username
    } else {
      signInBtn.style.display = '';
      signOutBtn.style.display = 'none';
    }
  }

  /* Initialise session on page load */
  getCurrentUser().then(function (user) {
    window.currentUser = user || null;
    if (user) ensureBuyerRow(user);
    updateAuthUI(user);
  });

───────────────────────────────────────────────────────
PART D — index.html changes
───────────────────────────────────────────────────────

1. Replace the static "Sign in" nav link with two toggling elements:

     <!-- was: <a href="#" class="btn btn-secondary">Sign in</a> -->
     <a id="nav-sign-in" href="#" class="btn btn-secondary"
        onclick="openAuthModal(); return false;">Sign in</a>
     <button id="nav-sign-out" class="btn btn-secondary"
             onclick="signOut()" style="display:none;">Sign out</button>

2. Add the auth modal markup (before </body>, after the portfolio modal):

     <div class="modal-wrap" id="authModal" role="dialog"
          aria-modal="true" aria-labelledby="authTitle">
       <div class="modal">
         <div class="modal-hdr">
           <h2 id="authTitle">Sign in to book</h2>
           <button class="modal-close" onclick="closeAuthModal()" aria-label="Close">×</button>
         </div>
         <div class="modal-body"   id="authBody"></div>
         <div class="modal-footer" id="authFooter"></div>
       </div>
     </div>

3. Add the script tag after portfolio-modal.js:

     <script src="components/auth-modal.js"></script>

───────────────────────────────────────────────────────
PART E — components/booking-modal.js: gate on auth
───────────────────────────────────────────────────────

Replace the openBooking() function:

  function openBooking() {
    if (!window.currentUser) {
      // Not signed in — open auth modal; retry booking on success
      openAuthModal(function () { openBooking(); });
      return;
    }
    var providerId = (window.currentProvider && window.currentProvider.id) || null;
    trackEvent('booking_modal_opened', { providerId: providerId });
    bookingStep = 0;
    window.pendingBooking = {};
    renderStep();
    document.getElementById('bookingModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
  }

Replace the submitBooking call in nextStep() — change buyerId from null to the session user:

  submitBooking({
    providerId:     provider.id || null,
    buyerId:        (window.currentUser && window.currentUser.id) || null,
    projectTitle:   pending.projectTitle,
    projectDesc:    pending.projectDesc,
    budgetRange:    pending.budgetRange,
    targetStart:    pending.targetStart || null,
    isFirstBooking: isFirst
  }).catch(function (err) {
    console.error('Booking submission failed:', err);
  });

───────────────────────────────────────────────────────
VERIFY
───────────────────────────────────────────────────────

1. Click "Request first project →" without signing in.
   Expected: auth modal opens asking for email.

2. Enter a real email, click "Send magic link".
   Expected: confirmation state shows; email arrives within 30s.

3. Click the magic link in email.
   Expected: tab signs in automatically; auth modal closes; booking modal
   opens for the same provider; nav shows the user's email prefix.

4. Complete the booking flow (fill Step 1, confirm Step 2).
   Expected: bookings table row has buyer_id = auth.uid() (not null);
   is_first_booking = true; status = 'pending'.

5. Open Supabase Table Editor → buyers.
   Expected: one row with id = auth.uid() and correct email.

6. Open events table.
   Expected: user_signed_in, booking_modal_opened, booking_completed rows
   all with correct provider_id and buyer_id.

7. Sign out (nav button). Click "Request first project →" again.
   Expected: auth modal re-appears (session cleared).
```

---

## Edge Cases to Handle

### Data availability

| Case | Current behaviour | Required handling |
|---|---|---|
| Supabase unreachable at page load | Static data renders (grid OK); stats banner shows **empty cells** (bug — camelCase key mismatch) | Fix key mismatch in `renderFromStaticData()` first (Prompt 1) |
| Provider slug not found (e.g. direct URL to unknown provider) | `fetchProviderProfile()` throws; `window.currentProvider = null`; static profile renders | Add a "Provider not found" screen or redirect to search results |
| `verification_checks` returns empty array for a provider | `buildTrustPillsHtml()` returns `''`; card shows "Verification in progress" italic text | Acceptable for now; ensure it doesn't break the grid |
| All 6 verification checks unavailable | Ring shows `0/6`; `renderVerificationDetail` shows all unavailable | Ensure "Retry verification" banner always shows when any check is unavailable |
| `platform_metrics` table returns fewer than 4 rows | Missing stat cells silently render as `''` in `renderBanner()` | Add a null check: skip missing keys rather than inserting blank cells |
| `user_quotes` returns 0 rows | `quotes-row` renders empty | Keep `USER_QUOTES` static fallback; only replace if DB returns ≥ 1 row |

### Booking flow

| Case | Current behaviour | Required handling |
|---|---|---|
| `submitBooking()` fails (network, RLS rejection) | Will throw; booking modal advances to Step 3 anyway (catch logs silently) | Acceptable for prototype; log error; do not block Step 3 |
| `projTitle` left blank | Empty string submitted to DB | Add `required` attribute to `#projTitle` input; block `nextStep()` if blank |
| `projDate` is in the past | DB accepts it; no validation | Add client-side check: `targetStart >= today`, show inline error if not |
| Booking submitted twice (double-click) | Two rows inserted | Disable the "Confirm & send request" button after first click |

### Profile rendering

| Case | Current behaviour | Required handling |
|---|---|---|
| `window.currentProvider` is null when profile screen renders | Static HTML shows (acceptable fallback) | `renderProfile()` should guard with `if (!window.currentProvider) return;` |
| Provider has no vouches | `renderVouches([])` called | Render the vouches card with an empty state: "No vouches yet" |
| Provider has no imported reputation | `renderImportedReputation([])` called | Hide the Imported Reputation card entirely |
| Provider has 0 verified portfolio projects | All tiles show `Self-reported` | Acceptable |
| `avg_reply_hours` is null | `"<2 hrs"` format check throws | Guard: `provider.avg_reply_hours != null ? formatReplyTime(v) : 'n/a'` |

### Trust toggle

| Case | Current behaviour | Required handling |
|---|---|---|
| Trust toggle flipped before Supabase data returns | CSS classes applied; JS-rendered content may not have `.trust-visible` on dynamically-built elements | Ensure `buildProviderCard()` always emits `.trust-visible` on trust pill spans |
| Trust toggle OFF + profile screen opened | Static profile shows; trust-off CSS hides `.trust-visible` elements | Already handled by CSS; verify after dynamic rendering is added |

---

## Stress Tests to Run

### 1. Supabase latency / offline

- Open `index.html` with network throttled to "Slow 3G" in DevTools. Confirm: (a) static data renders immediately, (b) live data replaces it after ~3–5 seconds, (c) no layout shift on re-render.
- Disable network entirely before page load. Confirm: static fallback renders correctly with no empty stat cells (verifies the key-mismatch fix from Prompt 1).
- Open DevTools → Network → block `*.supabase.co`. Confirm `catch` handler fires, console shows the warning, and the page remains usable.

### 2. Provider grid re-render

- Add a fifth provider to the `providers` table in Supabase. Reload. Confirm: a fifth card appears without any code changes.
- Update Marcus Reid's `rate_usd` to `100` in the DB. Reload. Confirm the card shows `$100 / hr`.
- Set Priya Sharma's `is_rising_talent` to `false`. Reload. Confirm: no "⚡ Rising Talent" pill on her card.

### 3. Verification ring accuracy

- In the DB, change Marcus Reid's `eo_insurance` check from `pending` to `verified`. Reload and navigate to the profile. Confirm the ring shows `5/6` (or `6/6` if `business_registration` is also resolved) before any booking is made.
- Add a seventh `verification_checks` row with an unexpected category. Confirm the badge list renders an extra row without crashing.

### 4. Booking submission (after Prompt 3)

- Complete the full booking flow (fill all four fields, advance to Step 3). Open Supabase Table Editor → `bookings`. Confirm: one row with correct `project_title`, `budget_range`, `target_start`, `is_first_booking = true`, `status = pending`.
- Open Table Editor → `events`. Confirm: rows for `booking_modal_opened`, `booking_completed` with the correct `provider_id`.
- Submit a booking with `projTitle` blank. Confirm: `nextStep()` is blocked (after Prompt 3 validation is added).

### 5. Analytics events (after Prompt 3)

- Open page. Confirm `screen_viewed` event logged with `screen = 'search-results'`.
- Toggle trust layer OFF and back ON. Confirm two `trust_layer_toggled` events in `events` table.
- Click a badge in the verification detail. Confirm `verification_detail_opened` event.
- Hit "Simulate booking failure". Confirm `booking_error_shown` event.

### 6. Multi-provider navigation

- After Prompt 2 is complete, click Priya Sharma's card. Confirm: profile loading screen fetches `priya-sharma` slug (check network tab), `window.currentProvider.name === 'Priya Sharma'`, profile screen shows Priya's name (once dynamic rendering is wired).
- Rapidly click two different provider cards. Confirm: only the second provider's profile appears (cancel-loading correctly aborts the first fetch timer).

### 7. Trust-toggle + live data interaction

- Load the page and wait for live data to render. Toggle trust layer OFF. Confirm: dynamically built cards show `"No verified data available"` in the trust strip and hide Rising Talent chips — identical to what static cards did before.
- Toggle trust layer ON again. Confirm trust pills reappear without a page reload.

---

*Integration Plan written against prototype v6 · [05-fullstack/prototype-v6/](prototype-v6/) · September 2026*
