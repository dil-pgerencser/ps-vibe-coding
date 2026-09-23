/* ── Supabase client ───────────────────────────────────────
   Replace the placeholder values with your project's URL
   and anon key from: https://supabase.com/dashboard/project/<id>/settings/api

   For local dev:
     URL:      http://localhost:54321
     anon key: printed by `supabase start`

   For production:
     URL:      https://<project-id>.supabase.co
     anon key: from the Supabase dashboard (safe to expose — RLS enforces access)
─────────────────────────────────────────────────────────── */

const SUPABASE_URL  = 'https://guxainjrsxswcfwpvsio.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1eGFpbmpyc3hzd2Nmd3B2c2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5ODc4NTMsImV4cCI6MjEwNTU2Mzg1M30.aFV4srhMC-xfajQnmJIXMehgbsQm9CuUQTbI4yd3tps';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);


/* ── Providers ─────────────────────────────────────────────
   Replaces: data/providers.js hardcoded PROVIDERS array     */

async function fetchProviders() {
  const { data, error } = await db
    .from('providers')
    .select('*')
    .order('is_baseline', { ascending: true })
    .order('rate_usd', { ascending: true });
  if (error) throw error;
  return data;
}


/* ── Provider profile + trust signals ─────────────────────
   Replaces: hardcoded HTML in screen-freelancer-profile     */

async function fetchProviderProfile(slug) {
  const { data: provider, error } = await db
    .from('providers')
    .select(`
      *,
      verification_checks (*),
      portfolio_projects   (*),
      vouches              (*),
      imported_reputation  (*)
    `)
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return provider;
}


/* ── Platform metrics ──────────────────────────────────────
   Replaces: data/metrics.js hardcoded METRICS object        */

async function fetchPlatformMetrics() {
  const { data, error } = await db
    .from('platform_metrics')
    .select('*');
  if (error) throw error;
  return Object.fromEntries(data.map(m => [m.key, m]));
}


/* ── Submit booking ────────────────────────────────────────
   Replaces: booking modal that currently discards form data  */

async function submitBooking({ providerId, buyerId, projectTitle, projectDesc, budgetRange, targetStart, isFirstBooking }) {
  const { data, error } = await db
    .from('bookings')
    .insert({
      provider_id:      providerId,
      buyer_id:         buyerId,
      project_title:    projectTitle,
      project_desc:     projectDesc,
      budget_range:     budgetRange,
      target_start:     targetStart,
      is_first_booking: isFirstBooking,
      status:           'pending'
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}


/* ── Analytics events ──────────────────────────────────────
   Call this wherever showScreen() is called and at key
   interaction points (see PRD Data & events).               */

async function trackEvent(eventName, { providerId, buyerId, properties } = {}) {
  await db.from('events').insert({
    event_name:  eventName,
    provider_id: providerId  ?? null,
    buyer_id:    buyerId     ?? null,
    properties:  properties  ?? null
  });
  // fire-and-forget — don't await in the caller
}

/* Usage examples:
   trackEvent('profile_viewed',           { providerId, properties: { trust_layer_on: true } });
   trackEvent('trust_layer_toggled',      { providerId, properties: { direction: 'off' } });
   trackEvent('verification_detail_opened',{ providerId, properties: { trigger: 'ring' } });
   trackEvent('booking_completed',        { providerId, buyerId, properties: { is_first_booking: true } });
   trackEvent('booking_error_shown',      { providerId });
   trackEvent('search_exit_without_booking', { properties: { last_provider_slug: slug } });
*/


/* ── Auth helpers ──────────────────────────────────────────── */

async function signInWithPassword(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

async function signUpWithPassword(email, password) {
  const { data, error } = await db.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

async function signOut() {
  const { error } = await db.auth.signOut();
  if (error) throw error;
}

async function getCurrentUser() {
  const { data: { session } } = await db.auth.getSession();
  return session ? session.user : null;
}

async function ensureBuyerRow(user) {
  const { error } = await db.from('buyers').upsert(
    { id: user.id, email: user.email },
    { onConflict: 'id' }
  );
  if (error) console.error('ensureBuyerRow failed:', error);
}
