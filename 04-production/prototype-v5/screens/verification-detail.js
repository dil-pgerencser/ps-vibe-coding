/* ── Verification Detail screen ───────────────────────────── */

function retryVerification() {
  var btn = document.getElementById('retryBtn');
  if (!btn) return;
  btn.textContent = 'Checking…';
  btn.disabled = true;
  setTimeout(function () {
    btn.textContent = '↻ Retry verification';
    btn.disabled = false;
  }, 2000);
}
