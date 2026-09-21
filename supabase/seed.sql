-- ============================================================
-- Roster · Trust Layer — Seed Data
-- Mirrors the hardcoded data in prototype-v5/data/
-- Run after the initial schema migration.
-- ============================================================


-- ── platform_metrics ────────────────────────────────────────

insert into platform_metrics (key, value, modifier, label) values
  ('booking_rate_zero_review', '2.3%',    'danger', 'Booking rate, zero-review providers'),
  ('booking_rate_reviewed',    '14%',     'good',   'Booking rate, reviewed providers'),
  ('median_days_first_booking','19 days', 'warn',   'Median days to a new provider''s first booking'),
  ('exit_without_booking',     '68%',     'danger', 'Search → profile → exit without booking');


-- ── providers ───────────────────────────────────────────────

insert into providers
  (id, slug, name, title, location, rate_usd, avatar_gradient, avatar_initials,
   bio, response_rate_pct, avg_reply_hours, reviews, rating,
   is_rising_talent, rising_talent_week, rising_talent_percentile, is_baseline, available)
values
  (
    '11111111-0000-0000-0000-000000000001',
    'marcus-reid',
    'Marcus Reid',
    'UX Designer',
    'San Francisco, CA',
    75,
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'MR',
    'I''m a UX designer with 6 years of experience building product interfaces for fintech, health tech, and SaaS. I specialise in user research, information architecture, and high-fidelity Figma prototyping. I recently left a senior role at a Series B fintech to freelance full-time — I''m new to Roster but not new to the work.',
    94,
    1.8,
    0,
    null,
    true, 3, 12,
    false, true
  ),
  (
    '11111111-0000-0000-0000-000000000002',
    'priya-sharma',
    'Priya Sharma',
    'Content Strategist',
    'New York, NY',
    60,
    'linear-gradient(135deg,#ec4899,#f43f5e)',
    'PS',
    null,
    null, null,
    0, null,
    true, null, null,
    false, true
  ),
  (
    '11111111-0000-0000-0000-000000000003',
    'james-okafor',
    'James Okafor',
    'Full-Stack Developer',
    'Austin, TX',
    85,
    'linear-gradient(135deg,#0ea5e9,#06b6d4)',
    'JO',
    null,
    null, null,
    0, null,
    true, null, null,
    false, true
  ),
  (
    '11111111-0000-0000-0000-000000000004',
    'sarah-chen',
    'Sarah Chen',
    'Brand Designer',
    'Seattle, WA',
    95,
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'SC',
    null,
    null, null,
    18, 4.9,
    false, null, null,
    true, false   -- baseline reviewed provider; booked out
  );


-- ── verification_checks ─────────────────────────────────────
-- Six categories for Marcus Reid (the only fully-wired provider in the prototype).
-- Other providers get no checks seeded — add when their profiles are built.

insert into verification_checks
  (provider_id, category, status, proof_detail, verified_at)
values
  (
    '11111111-0000-0000-0000-000000000001',
    'government_id',
    'verified',
    'Confirms Marcus''s legal identity via a government-issued photo ID matched against a live selfie through Jumio.',
    '2026-08-19 00:00:00+00'
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    'employment_history',
    'verified',
    'Confirms job titles and tenures claimed on the profile were cross-referenced against LinkedIn and third-party HR records with high confidence.',
    '2026-09-01 00:00:00+00'
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    'portfolio_provenance',
    'verified',
    'Confirms that named clients (David Park / Stripe, Linda Torres / NovaCare) responded to Roster''s outreach and confirmed Marcus worked on those specific projects. Verifies participation, not quality.',
    '2026-09-01 00:00:00+00'
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    'business_registration',
    'unavailable',
    'Confirms the freelancer operates as a registered sole trader or business entity. Status temporarily unavailable — our registry data provider is experiencing an outage.',
    null
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    'eo_insurance',
    'pending',
    'Confirms active Errors & Omissions insurance coverage. Certificate submitted; currently under review. Typically completes within 3 business days of submission.',
    null
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    'payout_account',
    'verified',
    'Confirms a verified bank account is on file for disbursements.',
    '2026-09-02 00:00:00+00'
  );


-- ── portfolio_projects ──────────────────────────────────────

insert into portfolio_projects
  (provider_id, title, client_name, client_confirmed, is_confidential, year, role, outcome, tools, avatar_gradient, avatar_initials, sort_order)
values
  (
    '11111111-0000-0000-0000-000000000001',
    'Fintech Dashboard Redesign',
    'Meridian Pay (Series B fintech)',
    true, false,
    2023,
    'Lead UX Designer',
    'Reduced support tickets 34% after launch. Team adopted the new design system org-wide.',
    'Figma, Maze, Miro',
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'FD',
    1
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    'E-commerce Mobile App',
    'NovaCare (health startup)',
    true, false,
    2024,
    'UX Designer & Prototyper',
    'Shipped to users in 8 weeks. App Store rating: 4.6★ within first 90 days.',
    'Figma, Principle, UserTesting',
    'linear-gradient(135deg,#0ea5e9,#6366f1)',
    'EA',
    2
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    'SaaS Onboarding Flow',
    null,               -- confidential / NDA
    false, true,
    2022,
    'Contract UX Designer',
    'Improved trial-to-paid conversion approximately 18% (per client-shared analytics).',
    'Figma, Hotjar, Intercom',
    'linear-gradient(135deg,#10b981,#0ea5e9)',
    'SO',
    3
  );


-- ── vouches ─────────────────────────────────────────────────

insert into vouches
  (provider_id, voucher_name, voucher_title, voucher_company, collaboration_year, quote, linkedin_verified, roster_confirmed)
values
  (
    '11111111-0000-0000-0000-000000000001',
    'David Park',
    'Product Lead',
    'Stripe',
    2023,
    'Marcus redesigned our internal tools dashboard while embedded with the team. He ran discovery sessions, delivered clear specs, and shipped ahead of schedule. I''d hire him again without hesitation.',
    true, true
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    'Linda Torres',
    'Founder',
    'NovaCare',
    2024,
    'We hired Marcus for a health app prototype — six-week engagement. He was structured, communicative, and the output was genuinely impressive. We shipped it to users in two months.',
    true, true
  );


-- ── imported_reputation ─────────────────────────────────────

insert into imported_reputation
  (provider_id, source, description, badge_label, sort_order)
values
  (
    '11111111-0000-0000-0000-000000000001',
    'linkedin',
    'Senior UX Designer · Meridian Pay (2021–2024) · Lead Designer · Sprout Health (2019–2021)',
    'Matched ✓',
    1
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    'github',
    '3 public design-system repos · Active contributor · Last commit 4 days ago',
    'Verified ✓',
    2
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    'behance',
    '142 followers · 6 published projects',
    'Linked ✓',
    3
  );
