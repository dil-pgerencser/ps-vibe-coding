-- ============================================================
-- Roster · Trust Layer — Initial Schema
-- Supports: providers, verification checks, portfolio,
--           vouches, imported reputation, bookings, events
-- ============================================================

-- ── Types ───────────────────────────────────────────────────

create type verification_status as enum ('verified', 'pending', 'unavailable');
create type booking_status       as enum ('pending', 'accepted', 'completed', 'cancelled', 'disputed');


-- ── providers ───────────────────────────────────────────────
-- One row per freelancer. Zero-review providers have reviews = 0.

create table providers (
  id                        uuid primary key default gen_random_uuid(),
  slug                      text unique not null,        -- url-safe id, e.g. 'marcus-reid'
  name                      text not null,
  title                     text not null,
  location                  text not null,
  rate_usd                  integer not null,             -- hourly rate in whole dollars
  avatar_gradient           text,                         -- CSS gradient string for avatar
  avatar_initials           text,                         -- 2-letter display initials
  bio                       text,
  response_rate_pct         integer,                      -- 0-100
  avg_reply_hours           numeric(4,1),
  reviews                   integer not null default 0,
  rating                    numeric(2,1),                 -- null until first review
  is_rising_talent          boolean not null default false,
  rising_talent_week        integer,                      -- week number in the programme
  rising_talent_percentile  integer,                      -- e.g. 12 = top 12%
  is_baseline               boolean not null default false, -- reviewed baseline card
  available                 boolean not null default true,
  joined_at                 timestamptz not null default now(),
  created_at                timestamptz not null default now()
);

comment on table providers is 'Freelancer provider profiles. Zero-review providers are the primary target of the trust layer.';
comment on column providers.is_baseline is 'True for the reviewed comparison card shown in search results to illustrate the booking-rate gap.';


-- ── verification_checks ─────────────────────────────────────
-- Six categories per provider. Status drives the badge display.

create table verification_checks (
  id           uuid primary key default gen_random_uuid(),
  provider_id  uuid not null references providers(id) on delete cascade,
  category     text not null,     -- 'government_id' | 'employment_history' | 'portfolio_provenance'
                                  -- | 'business_registration' | 'eo_insurance' | 'payout_account'
  status       verification_status not null,
  proof_detail text,              -- human-readable explanation of what was confirmed
  verified_at  timestamptz,       -- null if pending or unavailable
  created_at   timestamptz not null default now(),
  unique (provider_id, category)
);

comment on table verification_checks is 'One row per verification category per provider. Drives the 4/6 ring and badge list.';
comment on column verification_checks.category is 'Fixed set: government_id, employment_history, portfolio_provenance, business_registration, eo_insurance, payout_account';


-- ── portfolio_projects ──────────────────────────────────────
-- Case studies shown on the freelancer profile.

create table portfolio_projects (
  id               uuid primary key default gen_random_uuid(),
  provider_id      uuid not null references providers(id) on delete cascade,
  title            text not null,
  client_name      text,
  client_confirmed boolean not null default false,  -- true = "Client-confirmed" badge
  is_confidential  boolean not null default false,  -- true = client_name hidden (NDA)
  year             integer,
  role             text,
  outcome          text,
  tools            text,
  avatar_gradient  text,
  avatar_initials  text,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now()
);

comment on table portfolio_projects is 'Portfolio case studies. client_confirmed drives the badge state shown to buyers.';


-- ── vouches ─────────────────────────────────────────────────
-- Named past-collaborator endorsements, expandable on profile.

create table vouches (
  id                  uuid primary key default gen_random_uuid(),
  provider_id         uuid not null references providers(id) on delete cascade,
  voucher_name        text not null,
  voucher_title       text,
  voucher_company     text,
  collaboration_year  integer,
  quote               text,
  linkedin_verified   boolean not null default false,
  roster_confirmed    boolean not null default false,
  created_at          timestamptz not null default now()
);

comment on table vouches is 'Expandable vouch cards on the provider profile. linkedin_verified drives the verification line.';


-- ── imported_reputation ─────────────────────────────────────
-- Off-platform signals: LinkedIn, GitHub, Behance, etc.

create table imported_reputation (
  id           uuid primary key default gen_random_uuid(),
  provider_id  uuid not null references providers(id) on delete cascade,
  source       text not null,    -- 'linkedin' | 'github' | 'behance' | 'toptal' etc.
  description  text,
  badge_label  text,             -- e.g. 'Verified ✓' | 'Linked ✓' | 'Matched ✓'
  profile_url  text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

comment on table imported_reputation is 'Off-platform reputation signals shown in the Imported Reputation block.';


-- ── buyers ──────────────────────────────────────────────────
-- Clients who browse and book providers.

create table buyers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique,
  name       text,
  created_at timestamptz not null default now()
);

comment on table buyers is 'Buyer (client) accounts. Linked to bookings and events.';


-- ── bookings ────────────────────────────────────────────────
-- One row per booking request from a buyer to a provider.

create table bookings (
  id               uuid primary key default gen_random_uuid(),
  provider_id      uuid not null references providers(id),
  buyer_id         uuid references buyers(id),
  project_title    text,
  project_desc     text,
  budget_range     text,          -- e.g. '$3,000 – $5,000'
  target_start     date,
  status           booking_status not null default 'pending',
  is_first_booking boolean not null default false,  -- true when provider.reviews = 0 at time of booking
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table bookings is 'Booking requests. is_first_booking is the north-star metric for the trust-layer hypothesis.';
comment on column bookings.is_first_booking is 'Set true when the provider has 0 completed bookings at the time of this request. Key metric: first-hire rate for zero-review providers.';

-- Keep updated_at current
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();


-- ── events ──────────────────────────────────────────────────
-- Analytics events defined in the PRD. Insert-only.

create table events (
  id           uuid primary key default gen_random_uuid(),
  event_name   text not null,     -- e.g. 'profile_viewed', 'trust_layer_toggled'
  provider_id  uuid references providers(id),
  buyer_id     uuid references buyers(id),
  properties   jsonb,             -- event-specific payload (see PRD Data & events)
  created_at   timestamptz not null default now()
);

create index events_event_name_idx  on events (event_name);
create index events_provider_id_idx on events (provider_id);
create index events_created_at_idx  on events (created_at);

comment on table events is 'Analytics event log. Append-only. See PRD Data & events for the full event taxonomy.';


-- ── platform_metrics ────────────────────────────────────────
-- The four domain stats shown in the problem-context banner.
-- Updated by a scheduled job from the bookings/events tables.

create table platform_metrics (
  key        text primary key,    -- e.g. 'booking_rate_zero_review'
  value      text not null,       -- display value, e.g. '2.3%'
  modifier   text,                -- 'danger' | 'warn' | 'good' (drives CSS colour)
  label      text,
  updated_at timestamptz not null default now()
);

comment on table platform_metrics is 'Aggregated KPIs shown in the search-results problem banner. Refreshed by scheduled job; not computed on the fly.';


-- ── Row Level Security ──────────────────────────────────────

alter table providers           enable row level security;
alter table verification_checks enable row level security;
alter table portfolio_projects  enable row level security;
alter table vouches             enable row level security;
alter table imported_reputation enable row level security;
alter table buyers              enable row level security;
alter table bookings            enable row level security;
alter table events              enable row level security;
alter table platform_metrics    enable row level security;

-- Public read for all display tables
create policy "providers: public read"
  on providers for select using (true);

create policy "verification_checks: public read"
  on verification_checks for select using (true);

create policy "portfolio_projects: public read"
  on portfolio_projects for select using (true);

create policy "vouches: public read"
  on vouches for select using (true);

create policy "imported_reputation: public read"
  on imported_reputation for select using (true);

create policy "platform_metrics: public read"
  on platform_metrics for select using (true);

-- Buyers: each buyer sees only their own row
create policy "buyers: own row"
  on buyers for all using (id = auth.uid());

-- Bookings: buyers see and manage only their own bookings
create policy "bookings: own rows"
  on bookings for all using (buyer_id = auth.uid());

-- Events: anyone can insert; anon can read (prototype analytics panel)
create policy "events: insert only"
  on events for insert with check (true);

create policy "events: anon read"
  on events for select using (true);
