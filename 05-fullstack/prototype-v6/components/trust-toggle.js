/* ── Trust Toggle ─────────────────────────────────────────── */

var trustToggle = document.getElementById('trustToggle');
var ksLabel     = document.getElementById('ksLabel');

trustToggle.addEventListener('change', function () {
  var on = this.checked;
  document.body.classList.toggle('trust-off', !on);
  ksLabel.textContent = on ? 'Kill switch: ON' : 'Kill switch: OFF — baseline';
  ksLabel.style.color = on ? '' : '#f59e0b';
  trackEvent('trust_layer_toggled', { properties: { direction: on ? 'on' : 'off' } });
});
