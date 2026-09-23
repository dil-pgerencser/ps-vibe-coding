/* ── Auth Modal ─────────────────────────────────────────────── */

var _authRetryCallback = null;

function openAuthModal(retryCallback) {
  _authRetryCallback = retryCallback || null;
  _renderAuthView('signin');
  document.getElementById('authModal').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
  _authRetryCallback = null;
}

function _renderAuthView(view) {
  var body   = document.getElementById('authBody');
  var footer = document.getElementById('authFooter');
  if (!body || !footer) return;

  var title = document.getElementById('authTitle');

  if (view === 'signin') {
    if (title) title.textContent = 'Sign in to Roster';
    body.innerHTML =
      '<div class="form-group">' +
        '<label for="authEmail">Email</label>' +
        '<input type="email" id="authEmail" placeholder="you@company.com" autocomplete="email" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="authPassword">Password</label>' +
        '<input type="password" id="authPassword" placeholder="Your password" autocomplete="current-password" />' +
      '</div>' +
      '<p id="authError" style="color:red;font-size:13px;margin-top:8px;display:none;"></p>';
    footer.innerHTML =
      '<button class="btn btn-secondary" onclick="closeAuthModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="_submitSignIn()">Sign in →</button>' +
      '<span style="font-size:12px;color:var(--ink3);margin-left:auto;">No account? <a href="#" onclick="_renderAuthView(\'signup\');return false;">Create one</a></span>';

  } else if (view === 'signup') {
    if (title) title.textContent = 'Create an account';
    body.innerHTML =
      '<div class="form-group">' +
        '<label for="authEmail">Email</label>' +
        '<input type="email" id="authEmail" placeholder="you@company.com" autocomplete="email" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="authPassword">Password</label>' +
        '<input type="password" id="authPassword" placeholder="Choose a password (6+ chars)" autocomplete="new-password" />' +
      '</div>' +
      '<p id="authError" style="color:red;font-size:13px;margin-top:8px;display:none;"></p>';
    footer.innerHTML =
      '<button class="btn btn-secondary" onclick="_renderAuthView(\'signin\')">← Back to sign in</button>' +
      '<button class="btn btn-primary" onclick="_submitSignUp()">Create account →</button>';
  }
}

function _authFormValues() {
  return {
    email:    (document.getElementById('authEmail')    || {}).value || '',
    password: (document.getElementById('authPassword') || {}).value || ''
  };
}

function _authSetError(msg) {
  var el = document.getElementById('authError');
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? '' : 'none';
}

function _authSetLoading(label) {
  var btn = document.querySelector('#authFooter .btn-primary');
  if (!btn) return;
  btn.textContent = label;
  btn.disabled    = !!label;
}

function _submitSignIn() {
  var v = _authFormValues();
  if (!v.email || !v.password) { _authSetError('Please fill in both fields.'); return; }
  _authSetError('');
  _authSetLoading('Signing in…');
  signInWithPassword(v.email, v.password).then(function (user) {
    _authSetLoading('');
    _onSignedIn(user);
  }).catch(function (err) {
    _authSetLoading('');
    var msg = (err && err.message) || 'Sign in failed.';
    if (msg.toLowerCase().indexOf('invalid') !== -1) msg = 'Wrong email or password.';
    _authSetError(msg);
  });
}

function _submitSignUp() {
  var v = _authFormValues();
  if (!v.email || !v.password) { _authSetError('Please fill in both fields.'); return; }
  if (v.password.length < 6)   { _authSetError('Password must be at least 6 characters.'); return; }
  _authSetError('');
  _authSetLoading('Creating account…');
  signUpWithPassword(v.email, v.password).then(function (user) {
    _authSetLoading('');
    if (user) {
      _onSignedIn(user);
    } else {
      _authSetError('Account created — check your email to confirm, then sign in.');
    }
  }).catch(function (err) {
    _authSetLoading('');
    _authSetError((err && err.message) || 'Sign up failed.');
  });
}

function _onSignedIn(user) {
  window.currentUser = user;
  _updateNavAuth(true);
  ensureBuyerRow(user);
  var cb = _authRetryCallback;
  _authRetryCallback = null;
  closeAuthModal();
  if (cb) setTimeout(cb, 100);
}

function authSignOut() {
  signOut().then(function () {
    window.currentUser = null;
    _updateNavAuth(false);
  }).catch(function (err) {
    console.error('Sign out failed:', err);
  });
}

function _updateNavAuth(isSignedIn) {
  var navSignIn  = document.getElementById('nav-sign-in');
  var navSignOut = document.getElementById('nav-sign-out');
  if (navSignIn)  navSignIn.style.display  = isSignedIn ? 'none' : '';
  if (navSignOut) navSignOut.style.display = isSignedIn ? ''     : 'none';
}

// Restore session on page load
db.auth.onAuthStateChange(function (event, session) {
  if (session && session.user) {
    window.currentUser = session.user;
    _updateNavAuth(true);
  } else {
    window.currentUser = null;
    _updateNavAuth(false);
  }
});
