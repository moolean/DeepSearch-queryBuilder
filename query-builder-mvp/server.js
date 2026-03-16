const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4173;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (_, res) => {
  res.json({ ok: true, service: 'query-builder-mvp' });
});

// Optional: receive payload prepared for Feishu Bitable (manual paste to automation/webhook for MVP)
app.post('/api/export', (req, res) => {
  const payload = req.body || {};
  const required = ['title', 'category', 'targetEntity', 'question', 'answer'];
  const missing = required.filter((k) => !payload[k]);

  if (missing.length) {
    return res.status(400).json({ ok: false, message: `Missing fields: ${missing.join(', ')}` });
  }

  return res.json({ ok: true, message: 'Payload validated', payload });
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Query Builder MVP running at http://localhost:${PORT}`);
});
