/* ── Badge Drawer (legacy, kept for completeness) ─────────── */
/* Badge buttons now navigate to the Verification Detail screen
   via showScreen(SCREENS.VERIFICATION_DETAIL) rather than
   opening an overlay drawer. The drawer HTML and close logic
   are retained so the Escape / overlay-click paths don't error. */

var drawerTrigger = null;

function openDrawer(key, triggerEl) {
  // Badge-btns now navigate to the Verification Detail screen
  showScreen(SCREENS.VERIFICATION_DETAIL);
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
  if (drawerTrigger) {
    drawerTrigger.setAttribute('aria-expanded', 'false');
    drawerTrigger.focus();
  }
  drawerTrigger = null;
}
