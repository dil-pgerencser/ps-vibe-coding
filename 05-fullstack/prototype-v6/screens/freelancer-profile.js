/* ── Freelancer Profile screen ────────────────────────────── */

/* ── Display maps ──────────────────────────────────────────── */

var BADGE_FULL_NAMES = {
  government_id:        'Government ID',
  portfolio_provenance: 'Portfolio Provenance',
  employment_history:   'Employment History',
  eo_insurance:         'E&O Insurance',
  payout_account:       'Payout Account',
  business_registration:'Business Registration',
  skills_test:          'Skills Test'
};

var BADGE_SUBLABELS = {
  government_id:        'Photo ID + live selfie match',
  portfolio_provenance: 'Projects verified by named clients',
  employment_history:   'Work history cross-referenced',
  eo_insurance:         'Insurance certificate reviewed',
  payout_account:       'Bank account on file',
  business_registration:'Registered sole trader / entity',
  skills_test:          'Category skills assessment'
};

var SOURCE_DISPLAY = {
  linkedin: { icon: 'in', color: '#0a66c2', label: 'LinkedIn' },
  github:   { icon: 'GH', color: '#24292e', label: 'GitHub' },
  behance:  { icon: 'Be', color: '#ff7262', label: 'Behance' }
};

var VOUCH_GRADIENTS = [
  'linear-gradient(135deg,#0ea5e9,#2563eb)',
  'linear-gradient(135deg,#10b981,#0ea5e9)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#f59e0b,#ef4444)'
];

var PORTFOLIO_GRADIENTS = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#0ea5e9,#6366f1)',
  'linear-gradient(135deg,#10b981,#0ea5e9)',
  'linear-gradient(135deg,#f59e0b,#ef4444)'
];

/* ── Helpers ───────────────────────────────────────────────── */

function initials2(name) {
  return (name || '').split(' ').map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase();
}

/* ── Main render ───────────────────────────────────────────── */

function renderProfile(provider) {
  if (!provider) return;
  var checks = provider.verification_checks || [];
  var el = function (id) { return document.getElementById(id); };

  if (el('prof-name'))      el('prof-name').textContent = provider.name;
  if (el('prof-title-loc')) el('prof-title-loc').textContent = provider.title + ' · ' + provider.location;

  var risingPill = el('prof-rising-pill');
  if (risingPill) {
    if (provider.is_rising_talent && provider.rising_talent_week) {
      risingPill.textContent = '⚡ Rising Talent — Week ' + provider.rising_talent_week;
      risingPill.style.display = '';
    } else {
      risingPill.style.display = 'none';
    }
  }

  if (el('prof-response-rate') && provider.response_rate_pct != null) {
    el('prof-response-rate').textContent = provider.response_rate_pct + '%';
  }
  if (el('prof-skills-stat')) {
    var sc = checks.find(function (c) { return c.category === 'skills_test'; });
    el('prof-skills-stat').textContent = sc
      ? (sc.status === 'verified' ? 'Passed' : sc.status === 'pending' ? 'Pending' : 'N/A')
      : 'N/A';
  }
  if (el('prof-reply-time') && provider.avg_reply_hours != null) {
    el('prof-reply-time').textContent = provider.avg_reply_hours < 2 ? '<2 hrs' : provider.avg_reply_hours + ' hrs';
  }

  if (el('prof-bio') && provider.bio) el('prof-bio').textContent = provider.bio;

  if (el('slot-note') && provider.avg_reply_hours != null) {
    var replyStr = provider.avg_reply_hours < 2 ? 'within 2 hours' : 'within ' + provider.avg_reply_hours + ' hours';
    el('slot-note').textContent = 'Available now · Usually replies ' + replyStr;
  }

  if (el('mob-cta-name')) el('mob-cta-name').textContent = provider.name;
  if (el('mob-cta-rate')) el('mob-cta-rate').textContent = '$' + provider.rate_usd + '/hr · Available now';

  renderBadgeList(checks, provider);
  renderPortfolioGrid(provider.portfolio_projects || []);
  renderImportedReputation(provider.imported_reputation || []);
  renderVouches(provider.vouches || []);
}

/* ── Badge list + ring ─────────────────────────────────────── */

function renderBadgeList(checks, provider) {
  var p          = provider || window.currentProvider;
  var verified   = checks.filter(function (c) { return c.status === 'verified'; }).length;
  var total      = checks.length || 1;
  var circumference = 301.6;

  var ringFill  = document.getElementById('ringFill');
  var ringLabel = document.getElementById('ringLabel');
  if (ringFill)  ringFill.style.strokeDashoffset = circumference * (1 - verified / total);
  if (ringLabel) ringLabel.textContent = verified + '/' + total;

  var risingChip = document.getElementById('prof-rising-chip');
  if (risingChip && p && p.is_rising_talent && p.rising_talent_week) {
    risingChip.textContent = '⚡ Rising Talent — Week ' + p.rising_talent_week;
  }
  var percEl = document.getElementById('prof-percentile');
  if (percEl && p && p.percentile != null) {
    percEl.textContent = 'Top ' + p.percentile + '% of new providers';
  }

  var list = document.getElementById('badge-list');
  if (!list) return;
  list.innerHTML = checks.map(function (c) {
    var iconClass = c.status === 'verified' ? 'ok' : c.status === 'pending' ? 'pending' : 'unavail';
    var iconText  = c.status === 'verified' ? '✓' : c.status === 'pending' ? '⏳' : '⚠';
    var name = BADGE_FULL_NAMES[c.category] || c.category;
    var sub  = BADGE_SUBLABELS[c.category] || '';
    return '<li><button class="badge-btn" onclick="showScreen(SCREENS.VERIFICATION_DETAIL)" aria-label="View ' + name + ' details">' +
      '<span class="b-icon ' + iconClass + '">' + iconText + '</span>' +
      '<span class="b-text"><strong>' + name + '</strong><span>' + sub + '</span></span>' +
      '<span class="b-arrow" aria-hidden="true">▶</span>' +
    '</button></li>';
  }).join('');
}

/* ── Portfolio grid ────────────────────────────────────────── */

function renderPortfolioGrid(projects) {
  var grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  grid.innerHTML = projects.map(function (p, idx) {
    var gradient  = p.gradient || PORTFOLIO_GRADIENTS[idx % PORTFOLIO_GRADIENTS.length];
    var inits     = p.initials || initials2(p.title);
    var badgeHtml = p.client_confirmed
      ? '<span class="p-badge confirmed trust-visible">✓ Client-confirmed</span>' +
        '<span class="p-badge self-reported trust-off-msg" style="display:none;">Self-reported</span>'
      : '<span class="p-badge self-reported">Self-reported</span>';
    return '<div class="portfolio-tile" onclick="openPortfolio(' + idx + ',this)" role="button" tabindex="0" aria-label="Open ' + p.title + ' case study">' +
      '<div class="p-thumb" style="background:' + gradient + ';">' + inits + '</div>' +
      '<div class="p-info"><h4>' + p.title + '</h4>' + badgeHtml + '</div>' +
    '</div>';
  }).join('');
}

/* ── Imported reputation ───────────────────────────────────── */

function renderImportedReputation(items) {
  var container = document.getElementById('rep-rows');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<p style="font-size:13px;color:var(--ink3);font-style:italic;padding:8px 0;">No imported reputation signals available.</p>';
    return;
  }
  container.innerHTML = items.map(function (item) {
    var src = SOURCE_DISPLAY[item.source] || {
      icon: (item.source || '').slice(0, 2).toUpperCase(),
      color: '#475569',
      label: item.source
    };
    return '<div class="rep-row">' +
      '<div class="rep-icon" style="background:' + src.color + ';">' + src.icon + '</div>' +
      '<div class="rep-body"><strong>' + src.label + ' — ' + item.headline + '</strong><span>' + item.detail + '</span></div>' +
      '<span class="rep-badge">' + item.badge_text + '</span>' +
    '</div>';
  }).join('');
}

/* ── Vouches ───────────────────────────────────────────────── */

function renderVouches(vouches) {
  var container = document.getElementById('vouch-list');
  if (!container) return;
  if (!vouches.length) {
    container.innerHTML = '<p style="font-size:13px;color:var(--ink3);font-style:italic;padding:8px 0;">No vouches yet.</p>';
    return;
  }
  container.innerHTML = vouches.map(function (v, idx) {
    var inits    = initials2(v.voucher_name || 'V');
    var gradient = VOUCH_GRADIENTS[idx % VOUCH_GRADIENTS.length];
    var meta     = v.voucher_title + ' · ' + v.voucher_company + ' (worked together ' + v.collaboration_year + ')';
    var bodyId   = 'vouch-body-dyn-' + idx;
    return '<div class="vouch-item">' +
      '<div class="vouch-hdr" onclick="toggleVouch(this)" role="button" tabindex="0" aria-expanded="false" aria-controls="' + bodyId + '">' +
        '<div class="v-avatar" style="background:' + gradient + ';">' + inits + '</div>' +
        '<div class="v-meta"><strong>' + v.voucher_name + '</strong><span>' + meta + '</span></div>' +
        '<span class="v-chevron" aria-hidden="true">▶</span>' +
      '</div>' +
      '<div class="vouch-body" id="' + bodyId + '">' +
        '<blockquote>"' + v.quote_text + '"</blockquote>' +
        '<div class="vouch-verify">' +
          '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6.5" stroke="#00a550"/><path d="M4 7l2 2 4-4" stroke="#00a550" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          'LinkedIn relationship verified · Roster confirmed connection' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  container.querySelectorAll('.vouch-hdr').forEach(function (h) {
    h.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleVouch(h); }
    });
  });
}

/* ── Vouch accordion ───────────────────────────────────────── */

function toggleVouch(hdr) {
  var item   = hdr.closest('.vouch-item');
  var isOpen = item.hasAttribute('data-open');
  if (isOpen) {
    item.removeAttribute('data-open');
    hdr.setAttribute('aria-expanded', 'false');
  } else {
    item.setAttribute('data-open', '');
    hdr.setAttribute('aria-expanded', 'true');
  }
}

document.querySelectorAll('.vouch-hdr').forEach(function (h) {
  h.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleVouch(h); }
  });
});

/* ── showScreen intercept ──────────────────────────────────── */

(function () {
  var _orig = showScreen;
  window.showScreen = function (screen) {
    _orig(screen);
    if (screen === SCREENS.FREELANCER_PROFILE && window.currentProvider) {
      renderProfile(window.currentProvider);
    }
    if (screen === SCREENS.VERIFICATION_DETAIL && window.currentProvider) {
      if (typeof renderVerificationDetail === 'function') renderVerificationDetail(window.currentProvider);
    }
    if (screen === SCREENS.BOOKING_ERROR) {
      if (typeof renderBookingError === 'function') renderBookingError();
    }
  };
}());
