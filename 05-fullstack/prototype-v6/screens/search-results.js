/* ── Search Results screen ─────────────────────────────────── */

var CATEGORY_LABELS = {
  government_id:        'ID Verified',
  portfolio_provenance: 'Portfolio Confirmed',
  employment_history:   'Employment Verified',
  eo_insurance:         'Insurance Verified',
  payout_account:       'Payout Verified',
  business_registration:'Business Reg.',
  skills_test:          'Skills Tested'
};

function showSearchResults() {
  showScreen(SCREENS.SEARCH_RESULTS);
}

/* ── Card renderer ─────────────────────────────────────────── */

function buildTrustPillsHtml(checks) {
  if (!checks || !checks.length) return '';
  return checks
    .filter(function (c) { return c.status === 'verified'; })
    .slice(0, 3)
    .map(function (c) {
      return '<span class="pill pill-green trust-visible">✓ ' +
             (CATEGORY_LABELS[c.category] || c.category) + '</span>';
    })
    .join('');
}

function buildBaselineCard(p) {
  return '<div class="f-card" role="listitem" tabindex="0"' +
         ' style="opacity:.82;cursor:default;"' +
         ' aria-label="' + p.name + ' - established provider baseline">' +
    '<span class="baseline-tag">BASELINE — Reviewed</span>' +
    '<div class="f-card-top">' +
      '<div class="avatar" style="background:' + p.avatar_gradient + ';">' + p.avatar_initials + '</div>' +
      '<div class="f-card-meta">' +
        '<h2>' + p.name + '</h2>' +
        '<p>' + p.title + ' · ' + p.location + '</p>' +
        '<div class="f-card-pills">' +
          '<span class="pill pill-green">★ ' + p.rating + ' · ' + p.reviews + ' reviews</span>' +
          '<span class="pill">Top Rated</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="trust-strip">' +
      '<span class="pill pill-green">✓ ' + p.reviews + ' verified reviews</span>' +
      '<span class="pill">Next available: 3 weeks</span>' +
    '</div>' +
    '<div class="f-card-footer">' +
      '<div>' +
        '<div class="price">$' + p.rate_usd + ' <small>/ hr</small></div>' +
        '<div style="font-size:11px;color:var(--ink3);margin-top:3px;">Booked out 3 weeks</div>' +
      '</div>' +
      '<button class="btn btn-secondary" style="font-size:13px;opacity:.5;cursor:not-allowed;"' +
              ' disabled aria-disabled="true">Unavailable</button>' +
    '</div>' +
  '</div>';
}

function buildProviderCard(p) {
  if (p.is_baseline) return buildBaselineCard(p);

  var isPrimary = p.slug === 'marcus-reid';
  var trustPills = buildTrustPillsHtml(p.verification_checks);
  var cta = isPrimary
    ? '<button class="btn btn-primary"' +
      ' onclick="event.stopPropagation();showProfileLoading(\'' + p.slug + '\')"' +
      ' style="font-size:13px;">View profile →</button>'
    : '<button class="btn btn-secondary"' +
      ' onclick="event.stopPropagation();"' +
      ' style="font-size:13px;">View profile</button>';

  return '<div class="f-card" role="listitem button" tabindex="0"' +
         ' onclick="showProfileLoading(\'' + p.slug + '\')"' +
         ' onkeydown="if(event.key===\'Enter\')showProfileLoading(\'' + p.slug + '\')"' +
         ' aria-label="View ' + p.name + '\'s profile">' +
    '<div class="f-card-top">' +
      '<div class="avatar" style="background:' + p.avatar_gradient + ';">' + p.avatar_initials + '</div>' +
      '<div class="f-card-meta">' +
        '<h2>' + p.name + '</h2>' +
        '<p>' + p.title + ' · ' + p.location + '</p>' +
        '<div class="f-card-pills">' +
          '<span class="pill pill-amber">0 reviews</span>' +
          (p.is_rising_talent ? '<span class="pill trust-visible pill-green">⚡ Rising Talent</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="trust-strip trust-visible">' +
      (trustPills || '<span style="font-size:12px;color:var(--ink3);font-style:italic;">Verification in progress</span>') +
    '</div>' +
    '<div class="trust-off-msg trust-strip">' +
      '<span class="trust-strip-empty">No verified data available</span>' +
    '</div>' +
    '<div class="f-card-footer">' +
      '<div>' +
        '<div class="price">$' + p.rate_usd + ' <small>/ hr</small></div>' +
        '<div class="first-note trust-visible">⏱ Avg. 19 days to first booking — be the first</div>' +
      '</div>' +
      cta +
    '</div>' +
  '</div>';
}

/* ── Banner renderer ───────────────────────────────────────── */

function renderBanner(metricsMap, quotes) {
  var statsRow  = document.getElementById('stats-row');
  var quotesRow = document.getElementById('quotes-row');
  if (!statsRow || !quotesRow) return;

  var keys = [
    'booking_rate_zero_review',
    'booking_rate_reviewed',
    'median_days_first_booking',
    'exit_without_booking'
  ];

  statsRow.innerHTML = keys.map(function (key) {
    var m = metricsMap[key];
    if (!m) return '';
    return '<div class="stat-cell">' +
      '<span class="stat-val ' + m.modifier + '">' + m.value + '</span>' +
      '<span class="stat-lbl">' + m.label + '</span>' +
    '</div>';
  }).join('');

  var activeQuotes = (quotes && quotes.length) ? quotes : USER_QUOTES;
  quotesRow.innerHTML = activeQuotes.map(function (q) {
    return '<div class="quote-chip">' + q.text + '<cite>' + q.cite + '</cite></div>';
  }).join('');
}

/* ── Grid renderer ─────────────────────────────────────────── */

function renderGrid(providers) {
  var grid = document.getElementById('freelancer-grid');
  if (!grid) return;
  grid.innerHTML = providers.map(buildProviderCard).join('');
}

/* ── Static fallback ───────────────────────────────────────── */

function renderFromStaticData() {
  var metricsMap = {};
  Object.keys(METRICS).forEach(function (k) { metricsMap[k] = METRICS[k]; });
  renderBanner(metricsMap);

  // Map static PROVIDERS shape to what renderGrid expects
  var mapped = PROVIDERS.map(function (p) {
    return {
      slug:           p.id,
      name:           p.name,
      title:          p.title,
      location:       p.location,
      rate_usd:       parseInt(p.rate.replace('$', ''), 10),
      avatar_gradient:p.avatarGradient,
      avatar_initials:p.avatarInitials,
      reviews:        p.reviews,
      rating:         p.rating || null,
      is_rising_talent: p.risingTalent,
      is_baseline:    p.isBaseline,
      available:      p.available,
      verification_checks: (p.trustPills || [])
        .filter(function (tp) { return tp.cls === 'pill-green'; })
        .map(function (tp) {
          return { status: 'verified', category: tp.label.replace('✓ ', '').toLowerCase().replace(/ /g, '_') };
        })
    };
  });
  renderGrid(mapped);
}

/* ── Init ──────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function () {
  // Render static data immediately so the page is never blank
  renderFromStaticData();

  // Then fetch live data from Supabase and re-render
  Promise.all([
    db.from('providers')
      .select('*, verification_checks(*)')
      .order('is_baseline', { ascending: true })
      .order('rate_usd',    { ascending: true }),
    db.from('platform_metrics').select('*'),
    db.from('user_quotes').select('*').eq('active', true).order('sort_order')
  ]).then(function (results) {
    var providers   = results[0];
    var metrics     = results[1];
    var quotesResult= results[2];

    if (!providers.error && providers.data && providers.data.length) {
      renderGrid(providers.data);
    }

    var metricsMap = {};
    if (!metrics.error && metrics.data && metrics.data.length) {
      metrics.data.forEach(function (m) { metricsMap[m.key] = m; });
    }
    var liveQuotes = (!quotesResult.error && quotesResult.data) ? quotesResult.data : null;
    renderBanner(metricsMap, liveQuotes);
  }).catch(function (err) {
    console.warn('Supabase unavailable, keeping static data:', err);
  });
});
