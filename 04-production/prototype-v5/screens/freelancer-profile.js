/* ── Freelancer Profile screen ────────────────────────────── */

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

/* Keyboard: vouch header accordion */
document.querySelectorAll('.vouch-hdr').forEach(function (h) {
  h.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleVouch(h); }
  });
});
