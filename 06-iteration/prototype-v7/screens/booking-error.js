/* ── Booking Error screen ─────────────────────────────────── */

function renderBookingError() {
  var name      = (window.currentProvider && window.currentProvider.name) || 'this provider';
  var providerId = (window.currentProvider && window.currentProvider.id) || null;
  trackEvent('booking_error_shown', { providerId: providerId });
  var firstName = name.split(' ')[0];

  var b1 = document.getElementById('error-body-1');
  if (b1) b1.textContent = 'Your request to book ' + name + ' didn\'t go through. Nothing has been charged and no request was sent.';

  var b2 = document.getElementById('error-body-2');
  if (b2) b2.textContent = 'You can try again now or come back to ' + firstName + '\'s profile and pick up where you left off. If the problem persists, our support team can help.';
}
