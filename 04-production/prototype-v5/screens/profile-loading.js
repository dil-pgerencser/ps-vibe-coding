/* ── Profile Loading screen ────────────────────────────────── */

var loadingTimer       = null;
var currentProviderSlug = 'marcus-reid';

function showProfileLoading(slug) {
  cancelLoading();
  currentProviderSlug = slug || 'marcus-reid';
  showScreen(SCREENS.PROFILE_LOADING);

  var fetchDone    = false;
  var minTimeDone  = false;

  function maybeNavigate() {
    if (fetchDone && minTimeDone) showScreen(SCREENS.FREELANCER_PROFILE);
  }

  // Minimum display time so the loading screen is always visible
  loadingTimer = setTimeout(function () {
    loadingTimer  = null;
    minTimeDone   = true;
    maybeNavigate();
  }, 1200);

  // Real fetch — result stored for the profile screen to consume
  fetchProviderProfile(currentProviderSlug)
    .then(function (data) {
      window.currentProvider = data;
      fetchDone = true;
      maybeNavigate();
    })
    .catch(function (err) {
      console.warn('Profile fetch failed, using static data:', err);
      window.currentProvider = null;
      fetchDone = true;
      maybeNavigate();
    });
}

function cancelLoading() {
  if (loadingTimer !== null) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
}
