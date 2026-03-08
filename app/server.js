const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Load data
const dataDir = path.join(__dirname, 'data');
const checklists = JSON.parse(fs.readFileSync(path.join(dataDir, 'checklists.json'), 'utf-8'));
const stats = JSON.parse(fs.readFileSync(path.join(dataDir, 'stats.json'), 'utf-8'));
const aiRated = JSON.parse(fs.readFileSync(path.join(dataDir, 'ai_rated.json'), 'utf-8'));

// Tracking file for case completeness
const trackingPath = path.join(dataDir, 'tracking.json');
if (!fs.existsSync(trackingPath)) fs.writeFileSync(trackingPath, '[]', 'utf-8');

// API: stats
app.get('/api/stats', (req, res) => res.json(stats));

// API: get checklist for diagnosis+domain
app.get('/api/checklist', (req, res) => {
  const { diagnosis, domain } = req.query;
  if (!diagnosis) return res.status(400).json({ error: 'diagnosis required' });
  
  let results = checklists.filter(c =>
    c.diagnosisGroup?.toLowerCase() === diagnosis.toLowerCase()
  );
  if (domain) {
    results = results.filter(c => c.domain === domain);
  }
  // Merge AI data into documents
  results = results.map(c => {
    const aiMap = {};
    (c.aiDocuments || []).forEach(a => { aiMap[a.docId] = a; });
    return {
      ...c,
      documents: c.documents.map(d => ({
        ...d,
        ai: aiMap[d.docId] || null
      }))
    };
  });
  res.json(results);
});

// API: list diagnosis groups (with optional domain filter)
app.get('/api/diagnoses', (req, res) => {
  const { domain } = req.query;
  let filtered = checklists;
  if (domain) filtered = filtered.filter(c => c.domain === domain);
  const groups = [...new Set(filtered.map(c => c.diagnosisGroup))].sort();
  res.json(groups);
});

// API: domains
app.get('/api/domains', (req, res) => {
  const domains = [...new Set(checklists.map(c => c.domain))].filter(Boolean).sort();
  res.json(domains);
});

// API: save case tracking
app.post('/api/tracking', (req, res) => {
  const tracking = JSON.parse(fs.readFileSync(trackingPath, 'utf-8'));
  const entry = { ...req.body, timestamp: new Date().toISOString() };
  tracking.push(entry);
  fs.writeFileSync(trackingPath, JSON.stringify(tracking, null, 2), 'utf-8');
  res.json({ ok: true, total: tracking.length });
});

// API: get tracking data
app.get('/api/tracking', (req, res) => {
  const tracking = JSON.parse(fs.readFileSync(trackingPath, 'utf-8'));
  res.json(tracking);
});

// API: generate missing-docs message for claimant
app.post('/api/generate-message', (req, res) => {
  const { claimantName, diagnosis, missingDocs } = req.body;
  const name = claimantName || 'מבוטח/ת יקר/ה';
  const docList = (missingDocs || []).map((d, i) => `  ${i + 1}. ${d}`).join('\n');
  const message = `שלום ${name},\n\nבהמשך לפנייתך בנושא ${diagnosis || 'הוועדה הרפואית'},\nלהשלמת הטיפול בתיקך, נדרשים המסמכים הבאים:\n\n${docList}\n\nנא להגיש את המסמכים בהקדם האפשרי.\nלשאלות ניתן לפנות למוקד השירות.\n\nבברכה,\nוועדות רפואיות`;
  res.json({ message });
});

app.listen(PORT, () => {
  console.log(`🏥 Project DD running at http://localhost:${PORT}`);
});
