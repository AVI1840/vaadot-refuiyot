// Project DD — Client App (v2.1)
const API = '';
let currentChecklist = [];
let allDiagnoses = [];
let allDomains = [];
let feedbackItems = JSON.parse(localStorage.getItem('btl-feedback-medical-committees') || '[]');

// --- Navigation ---
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('view-' + btn.dataset.view).classList.add('active');
    if (btn.dataset.view === 'tracking') loadTracking();
  });
});

// --- Dashboard ---
async function loadDashboard() {
  try {
    const stats = await fetch(API + '/api/stats').then(r => r.json());
    const grid = document.getElementById('stats-grid');
    grid.innerHTML = `
      <div class="stat-card"><div class="stat-value">${stats.totalRecords.toLocaleString()}</div><div class="stat-label">רשומות אבחנה-מסמך</div></div>
      <div class="stat-card mvp"><div class="stat-value">${stats.totalAiRated}</div><div class="stat-label">רשומות AI 5/5</div></div>
      <div class="stat-card"><div class="stat-value">${stats.diagnosisGroupCount}</div><div class="stat-label">קבוצות אבחנות</div></div>
      <div class="stat-card"><div class="stat-value">${stats.domainCount}</div><div class="stat-label">תחומי תביעה</div></div>
    `;

    // Domain chart
    const maxDomain = Math.max(...Object.values(stats.domains));
    document.getElementById('domain-chart').innerHTML = Object.entries(stats.domains)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `
        <div class="bar-row">
          <span class="bar-label">${name}</span>
          <div class="bar-fill" style="width:${(count / maxDomain * 100).toFixed(0)}%"></div>
          <span class="bar-count">${count}</span>
        </div>`).join('');

    // Top diagnoses chart
    const topDiag = stats.topDiagnoses || [];
    const maxDiag = topDiag.length > 0 ? topDiag[0].count : 1;
    document.getElementById('top-diag-chart').innerHTML = topDiag.slice(0, 15)
      .map(d => `
        <div class="bar-row">
          <span class="bar-label">${d.name}</span>
          <div class="bar-fill" style="width:${(d.count / maxDiag * 100).toFixed(0)}%"></div>
          <span class="bar-count">${d.count}</span>
        </div>`).join('');

    // MVP diagnoses
    const mvpList = stats.mvpDiagnoses || [];
    document.getElementById('mvp-list').innerHTML = mvpList.map((name, i) => `
      <div class="mvp-item">
        <div class="mvp-num">#${i + 1}</div>
        <div class="mvp-name">${name}</div>
      </div>`).join('');
  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

// --- Checklist View ---
async function loadDomains() {
  try {
    allDomains = await fetch(API + '/api/domains').then(r => r.json());
    const sel = document.getElementById('sel-domain');
    sel.innerHTML = '<option value="">כל התחומים</option>' +
      allDomains.map(d => `<option value="${d}">${d}</option>`).join('');
  } catch (err) { console.error('Domains load error:', err); }
}

async function loadDiagnoses(domain) {
  try {
    const url = domain ? `${API}/api/diagnoses?domain=${encodeURIComponent(domain)}` : `${API}/api/diagnoses`;
    allDiagnoses = await fetch(url).then(r => r.json());
    const sel = document.getElementById('sel-diagnosis');
    sel.innerHTML = '<option value="">בחר אבחנה...</option>' +
      allDiagnoses.map(d => `<option value="${d}">${d}</option>`).join('');
  } catch (err) { console.error('Diagnoses load error:', err); }
}

async function loadChecklist() {
  const diagnosis = document.getElementById('sel-diagnosis').value;
  const domain = document.getElementById('sel-domain').value;
  if (!diagnosis) { alert('יש לבחור אבחנה'); return; }

  try {
    let url = `${API}/api/checklist?diagnosis=${encodeURIComponent(diagnosis)}`;
    if (domain) url += `&domain=${encodeURIComponent(domain)}`;
    currentChecklist = await fetch(url).then(r => r.json());
    renderChecklist();
  } catch (err) { console.error('Checklist load error:', err); }
}

function renderChecklist() {
  const container = document.getElementById('checklist-results');
  if (!currentChecklist.length) {
    container.innerHTML = '<div class="empty-state">לא נמצאו תוצאות לאבחנה זו</div>';
    document.getElementById('message-panel').style.display = 'none';
    return;
  }

  container.innerHTML = currentChecklist.map((group, gi) => {
    const docs = group.documents || [];
    return `
      <div class="checklist-card" data-group="${gi}">
        <h4>${group.diagnosisGroup || 'אבחנה'}</h4>
        <span class="domain-tag">${group.domain || ''}</span>
        <ul class="doc-list">
          ${docs.map((d, di) => `
            <li class="doc-item">
              <input type="checkbox" id="doc-${gi}-${di}" data-group="${gi}" data-doc="${di}" onchange="updateCompleteness(${gi})">
              <label for="doc-${gi}-${di}" class="doc-name">${d.docName}</label>
              <span class="doc-id">#${d.docId}</span>
              ${d.ai ? `<span class="ai-badge">AI ${d.ai.rating || '5'}/5</span>` : ''}
            </li>`).join('')}
        </ul>
        <div class="completeness-bar">
          <div class="completeness-track"><div class="completeness-fill" id="fill-${gi}" style="width:0%"></div></div>
          <span class="completeness-pct" id="pct-${gi}">0%</span>
        </div>
        <div class="checklist-actions">
          <button class="btn-small" onclick="saveCase(${gi})">💾 שמור מעקב</button>
        </div>
      </div>`;
  }).join('');

  document.getElementById('message-panel').style.display = 'block';
}

function updateCompleteness(gi) {
  const checks = document.querySelectorAll(`input[data-group="${gi}"]`);
  const total = checks.length;
  const checked = [...checks].filter(c => c.checked).length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  const fill = document.getElementById(`fill-${gi}`);
  const label = document.getElementById(`pct-${gi}`);
  fill.style.width = pct + '%';
  fill.className = 'completeness-fill ' + (pct >= 80 ? 'status-green' : pct >= 50 ? 'status-yellow' : 'status-red');
  label.textContent = pct + '%';
  label.className = 'completeness-pct ' + (pct >= 80 ? 'text-green' : pct >= 50 ? 'text-yellow' : 'text-red');
}

async function saveCase(gi) {
  const group = currentChecklist[gi];
  if (!group) return;
  const checks = document.querySelectorAll(`input[data-group="${gi}"]`);
  const total = checks.length;
  const checked = [...checks].filter(c => c.checked).length;
  const missing = [...checks].filter(c => !c.checked).map(c => {
    const di = parseInt(c.dataset.doc);
    return group.documents[di]?.docName || '';
  }).filter(Boolean);

  const entry = {
    caseId: 'T-' + Date.now().toString(36).toUpperCase(),
    diagnosis: group.diagnosisGroup,
    domain: group.domain,
    submitted: checked,
    missing: total - checked,
    missingDocs: missing,
    completeness: total > 0 ? Math.round((checked / total) * 100) : 0,
    status: checked === total ? 'הושלם' : checked > 0 ? 'חלקי' : 'חסר'
  };

  try {
    await fetch(API + '/api/tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    showToast('✅ התיק נשמר למעקב');
  } catch (err) {
    console.error('Save error:', err);
    showToast('❌ שגיאה בשמירה');
  }
}

// --- Message Generation ---
async function generateMessage() {
  const name = document.getElementById('claimant-name').value;
  const diagnosis = document.getElementById('sel-diagnosis').value;
  const missing = [];
  currentChecklist.forEach((group, gi) => {
    const checks = document.querySelectorAll(`input[data-group="${gi}"]`);
    [...checks].filter(c => !c.checked).forEach(c => {
      const di = parseInt(c.dataset.doc);
      const docName = group.documents[di]?.docName;
      if (docName) missing.push(docName);
    });
  });

  if (!missing.length) { showToast('כל המסמכים סומנו — אין חסרים'); return; }

  try {
    const res = await fetch(API + '/api/generate-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimantName: name, diagnosis, missingDocs: missing })
    });
    const data = await res.json();
    const msgEl = document.getElementById('generated-message');
    msgEl.textContent = data.message;
    document.getElementById('btn-copy-msg').style.display = 'inline-block';
  } catch (err) { console.error('Message error:', err); }
}

function copyMessage() {
  const text = document.getElementById('generated-message').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('📋 ההודעה הועתקה'));
}

// --- Tracking View ---
async function loadTracking() {
  try {
    const data = await fetch(API + '/api/tracking').then(r => r.json());
    renderTracking(data);
  } catch (err) { console.error('Tracking load error:', err); }
}

function renderTracking(data) {
  // Stats
  const total = data.length;
  const complete = data.filter(d => d.status === 'הושלם').length;
  const partial = data.filter(d => d.status === 'חלקי').length;
  const avgPct = total > 0 ? Math.round(data.reduce((s, d) => s + (d.completeness || 0), 0) / total) : 0;

  document.getElementById('tracking-stats').innerHTML = `
    <div class="tracking-stat"><div class="ts-val">${total}</div><div class="ts-label">סה"כ תיקים</div></div>
    <div class="tracking-stat"><div class="ts-val">${complete}</div><div class="ts-label">הושלמו</div></div>
    <div class="tracking-stat"><div class="ts-val">${partial}</div><div class="ts-label">חלקיים</div></div>
    <div class="tracking-stat"><div class="ts-val">${avgPct}%</div><div class="ts-label">ממוצע שלמות</div></div>
  `;

  // Table
  const tbody = document.querySelector('#tracking-table tbody');
  if (!data.length) {
    tbody.innerHTML = '';
    document.getElementById('tracking-empty').style.display = 'block';
    return;
  }
  document.getElementById('tracking-empty').style.display = 'none';

  tbody.innerHTML = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(row => {
    const date = row.timestamp ? new Date(row.timestamp).toLocaleDateString('he-IL') : '';
    const statusClass = row.status === 'הושלם' ? 'text-green' : row.status === 'חלקי' ? 'text-yellow' : 'text-red';
    return `<tr>
      <td>${date}</td>
      <td>${row.caseId || ''}</td>
      <td>${row.diagnosis || ''}</td>
      <td>${row.domain || ''}</td>
      <td>${row.submitted || 0}</td>
      <td>${row.missing || 0}</td>
      <td>${row.completeness || 0}%</td>
      <td class="${statusClass}">${row.status || ''}</td>
    </tr>`;
  }).join('');
}

// --- Tracking Search/Filter ---
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('tracking-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('#tracking-table tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }
});

// --- Feedback System ---
function openFeedback() {
  document.getElementById('feedback-modal').style.display = 'flex';
}

function closeFeedback() {
  document.getElementById('feedback-modal').style.display = 'none';
}

function selectCategory(btn) {
  document.querySelectorAll('#fb-categories .fb-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function selectSeverity(btn) {
  document.querySelectorAll('#fb-severity .fb-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function submitFeedback() {
  const category = document.querySelector('#fb-categories .fb-option.selected')?.textContent || '';
  const severity = document.querySelector('#fb-severity .fb-option.selected')?.textContent || '';
  const text = document.getElementById('fb-text').value.trim();
  if (!text) { showToast('יש להזין תוכן משוב'); return; }

  feedbackItems.push({
    id: Date.now(),
    category,
    severity,
    text,
    timestamp: new Date().toISOString(),
    view: document.querySelector('.nav-btn.active')?.dataset.view || ''
  });
  localStorage.setItem('btl-feedback-medical-committees', JSON.stringify(feedbackItems));

  // Reset form
  document.getElementById('fb-text').value = '';
  document.querySelectorAll('.fb-option').forEach(b => b.classList.remove('selected'));
  renderFeedbackList();
  showToast('✅ המשוב נשמר');
}

function renderFeedbackList() {
  const list = document.getElementById('fb-list');
  if (!list) return;
  if (!feedbackItems.length) { list.innerHTML = '<p class="empty-state">אין משובים עדיין</p>'; return; }

  list.innerHTML = feedbackItems.slice().reverse().map(fb => {
    const sevClass = fb.severity === 'קריטי' ? 'sev-critical' : fb.severity === 'שיפור' ? 'sev-improvement' : 'sev-minor';
    return `<div class="fb-item">
      <div class="fb-item-header">
        ${fb.category ? `<span class="fb-tag cat">${fb.category}</span>` : ''}
        ${fb.severity ? `<span class="fb-tag ${sevClass}">${fb.severity}</span>` : ''}
        <span style="font-size:.7rem;color:var(--text-secondary)">${new Date(fb.timestamp).toLocaleString('he-IL')}</span>
      </div>
      <p style="font-size:.85rem;margin-top:.3rem">${fb.text}</p>
    </div>`;
  }).join('');
}

function exportFeedback() {
  if (!feedbackItems.length) { showToast('אין משובים לייצוא'); return; }
  const lines = feedbackItems.map(fb =>
    `[${new Date(fb.timestamp).toLocaleString('he-IL')}] [${fb.category}] [${fb.severity}] ${fb.text}`
  );
  const text = `משובי פיילוט — פרויקט DD ועדות רפואיות\nאביעד יצחקי, מינהל גמלאות | ביטוח לאומי\n${'='.repeat(50)}\n\n${lines.join('\n\n')}`;
  navigator.clipboard.writeText(text).then(() => showToast('📋 כל המשובים הועתקו'));
}

// --- Toast ---
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#1B3A5C;color:#fff;padding:.7rem 1.5rem;border-radius:10px;font-size:.88rem;z-index:999;opacity:0;transition:opacity .3s;font-family:inherit;box-shadow:0 4px 16px rgba(0,0,0,.2)';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

// --- Init ---
document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboard();
  await loadDomains();
  await loadDiagnoses();

  // Domain filter change
  document.getElementById('sel-domain').addEventListener('change', (e) => {
    loadDiagnoses(e.target.value);
  });

  // Load checklist button
  document.getElementById('btn-load').addEventListener('click', loadChecklist);

  // Generate message
  document.getElementById('btn-generate-msg').addEventListener('click', generateMessage);
  document.getElementById('btn-copy-msg').addEventListener('click', copyMessage);
});
