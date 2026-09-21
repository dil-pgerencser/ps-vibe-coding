/* ── Profile Loading screen ───────────────────────────────── */

var loadingTimer = null;

function showProfileLoading() {
  // Cancel any previous pending transition
  cancelLoading();
  showScreen(SCREENS.PROFILE_LOADING);
  loadingTimer = setTimeout(function () {
    loadingTimer = null;
    showScreen(SCREENS.FREELANCER_PROFILE);
  }, 1800);
}

function cancelLoading() {
  if (loadingTimer !== null) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
}
