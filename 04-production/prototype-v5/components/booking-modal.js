/* ── Booking Modal ────────────────────────────────────────── */

var bookingStep = 0;

var STEPS = [
  {
    title: 'Request a project',
    body: function () { return `
      <div class="form-group">
        <label for="projTitle">Project title</label>
        <input type="text" id="projTitle" placeholder="e.g. Redesign our onboarding flow" />
      </div>
      <div class="form-group">
        <label for="projDesc">What do you need?</label>
        <textarea id="projDesc" placeholder="Describe the project, goals, and timeline..."></textarea>
      </div>
      <div class="form-group">
        <label for="projBudget">Budget range</label>
        <select id="projBudget">
          <option>$500 – $1,000</option>
          <option>$1,000 – $3,000</option>
          <option selected>$3,000 – $5,000</option>
          <option>$5,000 – $10,000</option>
          <option>$10,000+</option>
        </select>
      </div>
      <div class="form-group">
        <label for="projDate">Target start date</label>
        <input type="date" id="projDate" value="2026-09-16" />
      </div>
    `; },
    footer: function () { return `
      <button class="btn btn-secondary" onclick="closeBooking()">Cancel</button>
      <button class="btn btn-primary"   onclick="nextStep()">Next: Review protections →</button>
      <div class="modal-failure-link">
        <a onclick="simulateBookingFailure()">Simulate booking failure →</a>
      </div>
    `; }
  },
  {
    title: 'Your protections',
    body: function () { return `
      <p style="font-size:14px;color:var(--ink2);margin-bottom:16px;">
        Because this is Marcus's first project on Roster, all of these apply automatically.
      </p>
      <ul class="prot-list">
        <li class="prot-item">
          <div class="prot-icon" style="background:var(--green-bg);">🔒</div>
          <div class="prot-body">
            <strong>Escrow payment</strong>
            <p>Funds are held until you approve the deliverable. Marcus is paid only when you're satisfied.</p>
          </div>
        </li>
        <li class="prot-item">
          <div class="prot-icon" style="background:var(--blue-bg);">🔄</div>
          <div class="prot-body">
            <strong>Free revision guarantee</strong>
            <p>If the first delivery doesn't match the agreed scope, one full revision is included at no charge.</p>
          </div>
        </li>
        <li class="prot-item">
          <div class="prot-icon" style="background:var(--amber-bg);">⏱</div>
          <div class="prot-body">
            <strong>48-hour cancellation window</strong>
            <p>Cancel within 48 hours of project start for a full refund — no questions asked.</p>
          </div>
        </li>
        <li class="prot-item">
          <div class="prot-icon" style="background:var(--red-bg);">🛡️</div>
          <div class="prot-body">
            <strong>Dispute resolution</strong>
            <p>If something goes wrong, Roster mediates and guarantees a fair outcome within 5 business days.</p>
          </div>
        </li>
      </ul>
    `; },
    footer: function () { return `
      <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
      <button class="btn btn-primary"   onclick="nextStep()">Confirm &amp; send request</button>
    `; }
  },
  {
    title: 'Request sent!',
    body: function () { return `
      <div class="success-wrap">
        <div class="success-icon">✓</div>
        <h2>Request sent to Marcus</h2>
        <p>Marcus typically replies within 2 hours. You'll get a notification when he accepts.</p>
        <div class="first-note">
          🎉 <strong>You're Marcus's first client on Roster.</strong><br>
          After the project, you'll be invited to leave a verified review. Your review will directly
          help the next buyer decide — and unlock Marcus's access to more work.
        </div>
      </div>
    `; },
    footer: function () { return `
      <button class="btn btn-primary" onclick="closeBooking()">Done</button>
    `; }
  }
];

function openBooking() {
  bookingStep = 0;
  renderStep();
  document.getElementById('bookingModal').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}

function closeBooking() {
  document.getElementById('bookingModal').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

function simulateBookingFailure() {
  closeBooking();
  showScreen(SCREENS.BOOKING_ERROR);
}

function nextStep() {
  if (bookingStep < STEPS.length - 1) { bookingStep++; renderStep(); }
}

function prevStep() {
  if (bookingStep > 0) { bookingStep--; renderStep(); }
}

function renderStep() {
  var s = STEPS[bookingStep];
  document.getElementById('bookingTitle').textContent  = s.title;
  document.getElementById('bookingBody').innerHTML     = s.body();
  document.getElementById('bookingFooter').innerHTML   = s.footer();

  for (var i = 0; i < 3; i++) {
    document.getElementById('dot' + i).classList.toggle('active', i === bookingStep);
  }

  // On success: complete the ring 4/6 → 6/6
  if (bookingStep === 2) {
    var ring  = document.getElementById('ringFill');
    var label = document.getElementById('ringLabel');
    if (ring)  ring.style.strokeDashoffset = '0';
    if (label) label.textContent = '6/6';
  }
}
