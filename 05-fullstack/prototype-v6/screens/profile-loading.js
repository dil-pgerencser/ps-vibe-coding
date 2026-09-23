/* ── Profile Loading screen ────────────────────────────────── */

var loadingTimer        = null;
var currentProviderSlug = 'marcus-reid';

function showProfileLoading(slug) {
  cancelLoading();
  currentProviderSlug = slug || 'marcus-reid';
  showScreen(SCREENS.PROFILE_LOADING);

  // Restore skeleton in case a previous error replaced it
  var card = document.querySelector('.loading-card');
  if (card) card.innerHTML = _loadingCardHTML();

  var fetchDone   = false;
  var minTimeDone = false;
  var fetchFailed = false;

  function maybeNavigate() {
    if (fetchFailed) return;
    if (fetchDone && minTimeDone) showScreen(SCREENS.FREELANCER_PROFILE);
  }

  loadingTimer = setTimeout(function () {
    loadingTimer = null;
    minTimeDone  = true;
    maybeNavigate();
  }, 1200);

  fetchProviderProfile(currentProviderSlug)
    .then(function (data) {
      window.currentProvider = data;
      fetchDone = true;
      maybeNavigate();
    })
    .catch(function (err) {
      console.warn('Profile fetch failed:', err);
      fetchFailed = true;
      cancelLoading();
      var c = document.querySelector('.loading-card');
      if (c) {
        c.innerHTML =
          '<div style="text-align:center;padding:40px 16px;">' +
            '<div style="font-size:36px;margin-bottom:12px;">⚠️</div>' +
            '<h3 style="margin-bottom:8px;color:var(--ink1);">Couldn\'t load profile</h3>' +
            '<p style="font-size:14px;color:var(--ink2);margin-bottom:24px;">' +
              'Check your connection and try again.' +
            '</p>' +
            '<button class="btn btn-primary" onclick="showProfileLoading(\'' + currentProviderSlug + '\')">' +
              '↺ Retry' +
            '</button>' +
            '<button class="btn btn-secondary" style="margin-left:10px;"' +
              ' onclick="cancelLoading();showScreen(SCREENS.SEARCH_RESULTS)">' +
              'Back to search' +
            '</button>' +
          '</div>';
      }
    });
}

function cancelLoading() {
  if (loadingTimer !== null) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
}

function _loadingCardHTML() {
  return '' +
    '<div class="loading-hero-top">' +
      '<div class="loading-avatar" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);" aria-hidden="true">MR</div>' +
      '<div class="loading-meta">' +
        '<span class="skeleton" style="height:20px;width:55%;margin-bottom:8px;"></span>' +
        '<span class="skeleton" style="height:14px;width:38%;margin-bottom:12px;"></span>' +
        '<div style="display:flex;gap:6px;">' +
          '<span class="skeleton" style="height:22px;width:72px;border-radius:20px;"></span>' +
          '<span class="skeleton" style="height:22px;width:90px;border-radius:20px;"></span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="loading-trust-rows" aria-hidden="true">' +
      '<p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);margin-bottom:12px;">' +
        'Verifying trust signals…' +
      '</p>' +
      ['48%','54%','42%'].map(function(w) {
        return '<div class="loading-trust-row">' +
          '<span class="skeleton" style="width:28px;height:28px;border-radius:7px;flex-shrink:0;"></span>' +
          '<div style="flex:1;">' +
            '<span class="skeleton" style="height:13px;width:' + w + ';margin-bottom:5px;display:block;"></span>' +
            '<span class="skeleton" style="height:11px;width:32%;display:block;"></span>' +
          '</div>' +
          '<span class="skeleton" style="width:60px;height:22px;border-radius:20px;"></span>' +
        '</div>';
      }).join('') +
    '</div>' +
    '<p class="loading-caption" aria-hidden="true">Loading profile · verifications · reputation…</p>';
}
