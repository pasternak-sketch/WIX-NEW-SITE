import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory submissions store
const inquiries = [];

// Contact form API endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, phone, project, msg, source } = req.body || {};

  if (!name || (!phone && !email)) {
    return res.status(400).json({ error: 'נא להזין שם ופרטי קשר (טלפון או דוא"ל)' });
  }

  const inquiry = {
    id: Date.now().toString(),
    name,
    email: email || '',
    phone: phone || '',
    project: project || '',
    msg: msg || '',
    source: source || 'web',
    createdAt: new Date().toISOString()
  };

  inquiries.push(inquiry);
  console.log(`[Contact] New inquiry received from ${name} (${phone || email}) [${source || 'direct'}]`);

  return res.json({
    message: 'פנייתך התקבלה בהצלחה! צוות המומחים שלנו יחזור אליך בהקדם.',
    inquiryId: inquiry.id
  });
});

app.get('/api/contact', (req, res) => {
  res.json({ inquiries: inquiries.slice(-20) });
});

// Serve static assets and index.html
app.use(express.static(__dirname));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Shetef Environmental Engineering server running on http://0.0.0.0:${PORT}`);
});
