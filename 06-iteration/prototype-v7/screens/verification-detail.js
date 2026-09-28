/* ── Verification Detail screen ─────────────────────────────── */

var VD_NAMES = {
  government_id:        'Government ID',
  portfolio_provenance: 'Portfolio Provenance',
  employment_history:   'Employment History',
  eo_insurance:         'E&O Insurance',
  payout_account:       'Payout Account',
  business_registration:'Business Registration',
  skills_test:          'Skills Test'
};

var VD_PROOFS = {
  government_id:        'Confirms legal identity via a government-issued photo ID matched against a live selfie through Jumio.',
  portfolio_provenance: 'Named clients responded to Roster\'s outreach and confirmed participation on the listed projects. Verifies participation, not quality.',
  employment_history:   'Job titles and tenures claimed on the profile were cross-referenced against LinkedIn and third-party HR records with high confidence.',
  eo_insurance:         'Confirms active Errors & Omissions insurance coverage. Certificate under review — typically completes within 3 business days.',
  payout_account:       'Confirms a verified bank account is on file for disbursements.',
  business_registration:'Confirms the freelancer operates as a registered sole trader or business entity. Status temporarily unavailable — data provider outage.',
  skills_test:          'Confirms the provider passed Roster\'s skills assessment for their primary service category.'
};

function fmtDate(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear();
}

function renderVerificationDetail(provider) {
  if (!provider) return;
  trackEvent('verification_detail_opened', { providerId: provider.id || null, properties: { trigger: 'ring_or_badge' } });
  var checks   = provider.verification_checks || [];
  var nVerified = checks.filter(function (c) { return c.status === 'verified'; }).length;
  var nPending  = checks.filter(function (c) { return c.status === 'pending'; }).length;
  var nUnavail  = checks.filter(function (c) { return c.status === 'unavailable'; }).length;

  var sub = document.getElementById('vd-page-sub');
  if (sub) {
    sub.textContent = provider.name + ' · ' + nVerified + ' verified · ' + nPending + ' pending · ' + nUnavail + ' unavailable';
  }

  var banner = document.getElementById('vd-error-banner');
  if (banner) banner.style.display = nUnavail > 0 ? 'flex' : 'none';

  var list = document.getElementById('vd-checks-list');
  if (!list) return;
  list.innerHTML = checks.map(function (c) {
    var iconClass, iconText, pillHtml;
    if (c.status === 'verified') {
      iconClass = 'ok'; iconText = '✓';
      var dateStr = fmtDate(c.verified_at);
      pillHtml = '<span class="pill pill-green" style="font-size:11px;">Verified</span>' +
        (dateStr ? '<span style="font-size:11px;color:var(--ink3);margin-left:6px;">' + dateStr + '</span>' : '');
    } else if (c.status === 'pending') {
      iconClass = 'pending'; iconText = '⏳';
      pillHtml = '<span class="pill pill-amber" style="font-size:11px;">Pending</span>';
    } else {
      iconClass = 'unavail'; iconText = '⚠';
      pillHtml = '<span class="pill" style="font-size:11px;">Unavailable</span>';
    }
    var name  = VD_NAMES[c.category]  || c.category;
    var proof = VD_PROOFS[c.category] || '';
    return '<div class="vd-row">' +
      '<span class="b-icon ' + iconClass + '" aria-hidden="true">' + iconText + '</span>' +
      '<div class="vd-body">' +
        '<div class="vd-body-top"><span class="vd-name">' + name + '</span>' + pillHtml + '</div>' +
        '<p class="vd-proof">' + proof + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}

function retryVerification() {
  var btn = document.getElementById('retryBtn');
  if (!btn) return;
  var providerId = (window.currentProvider && window.currentProvider.id) || null;
  trackEvent('retry_verification_clicked', { providerId: providerId });
  btn.textContent = 'Checking…';
  btn.disabled = true;
  setTimeout(function () {
    btn.textContent = '↻ Retry verification';
    btn.disabled = false;
  }, 2000);
}
