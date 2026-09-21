/* ── Portfolio Modal ──────────────────────────────────────── */

var portfolioTrigger = null;

function openPortfolio(idx, triggerEl) {
  var p = PROJECTS[idx];
  if (!p) return;
  portfolioTrigger = triggerEl;

  document.getElementById('portfolioTitle').textContent = p.title;

  var statusBadge = p.status === 'Client-confirmed'
    ? '<span class="p-badge confirmed">✓ Client-confirmed</span>'
    : '<span class="p-badge self-reported">' + p.status + '</span>';

  document.getElementById('portfolioBody').innerHTML = `
    <div class="p-modal-thumb" style="background:${p.gradient};">${p.initials}</div>
    ${statusBadge}
    <div class="p-detail-grid">
      <div class="p-stat"><div class="val">${p.year}</div><div class="lbl">Year</div></div>
      <div class="p-stat"><div class="val" style="font-size:13px;">${p.role.split(' ').slice(0,3).join(' ')}</div><div class="lbl">Role</div></div>
      <div class="p-stat"><div class="val" style="font-size:12px;">${p.client.split('(')[0].trim()}</div><div class="lbl">Client</div></div>
    </div>
    <div style="background:var(--paper2);border-radius:var(--radius-sm);padding:14px 16px;margin-bottom:10px;">
      <p style="font-size:12px;font-weight:700;color:var(--ink2);margin-bottom:4px;">Outcome</p>
      <p style="font-size:14px;color:var(--ink);line-height:1.6;">${p.outcome}</p>
    </div>
    <p style="font-size:12px;color:var(--ink3);">Tools: ${p.tools}</p>
  `;

  document.getElementById('portfolioModal').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}

function closePortfolio() {
  document.getElementById('portfolioModal').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
  if (portfolioTrigger) portfolioTrigger.focus();
  portfolioTrigger = null;
}
