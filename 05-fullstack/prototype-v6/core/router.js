/* ── Screen Router ────────────────────────────────────────── */

const SCREENS = {
  SEARCH_RESULTS:      'search-results',
  FREELANCER_PROFILE:  'freelancer-profile',
  PROFILE_LOADING:     'profile-loading',
  VERIFICATION_DETAIL: 'verification-detail',
  BOOKING_ERROR:       'booking-error'
};

function showScreen(screen) {
  document.body.dataset.screen = screen;
  window.scrollTo({ top: 0, behavior: 'instant' });
  trackEvent('screen_viewed', { properties: { screen: screen } });
}

function closeAll() {
  closeDrawer();
  closeBooking();
  closePortfolio();
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeAll();
});
