const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const seedData = require('./data/seedData');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Message = require('./models/Message');

const path = require('path');

dotenv.config();

const upload = multer();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CV Download endpoint matching .NET MVC route
app.get(['/Home/DownloadCv', '/api/download-cv', '/files/Muhammad_Saad_CV.pdf'], (req, res) => {
  const filePath = path.join(__dirname, '../client/public/files/Muhammad_Saad_CV.pdf');
  res.download(filePath, 'Muhammad_Saad_CV.pdf');
});

// Executive Dossier Download endpoint
app.get(['/Home/DownloadDossier', '/api/download-dossier', '/files/Muhammad_Saad_Executive_Dossier.zip'], (req, res) => {
  const filePath = path.join(__dirname, '../client/public/files/Muhammad_Saad_Executive_Dossier.zip');
  res.download(filePath, 'Muhammad_Saad_Executive_Dossier.zip');
});

let isMongoConnected = false;

// Connect MongoDB if URI provided
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      isMongoConnected = true;
      console.log('⚡ Connected to MongoDB Atlas successfully.');
      
      const projectCount = await Project.countDocuments();
      if (projectCount === 0) {
        await Project.insertMany(seedData.projects);
        console.log('✅ Seeded initial projects into MongoDB');
      }
      const skillCount = await Skill.countDocuments();
      if (skillCount === 0) {
        await Skill.insertMany(seedData.skills);
        console.log('✅ Seeded initial skills into MongoDB');
      }
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB connection error, running in local fallback mode:', err.message);
    });
} else {
  console.log('ℹ️ No MONGODB_URI provided in .env, running with built-in high-performance fallback data.');
}

// In-memory state store (synced with seedData for zero-delay instant mutations)
const db = JSON.parse(JSON.stringify(seedData));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    database: isMongoConnected ? 'MongoDB (Connected)' : 'Built-in Data Mode',
    timestamp: new Date().toISOString()
  });
});

// Settings & Profile Info
app.get('/api/settings', (req, res) => {
  res.json({
    success: true,
    data: db.settings,
    statistics: db.statistics,
    education: db.education,
    featureFlags: db.featureFlags
  });
});

// Projects
app.get(['/api/projects', '/Portfolio/GetProjects'], async (req, res) => {
  try {
    if (isMongoConnected) {
      const projects = await Project.find().sort({ displayOrder: 1 });
      return res.json({ success: true, data: projects });
    }
    res.json({ success: true, data: db.projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, data: db.projects });
  }
});

// Skills
app.get('/api/skills', async (req, res) => {
  try {
    if (isMongoConnected) {
      const skills = await Skill.find().sort({ displayOrder: 1 });
      return res.json({ success: true, data: skills });
    }
    res.json({ success: true, data: db.skills });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, data: db.skills });
  }
});

// Contact Form Submission (Supports both FormData and JSON)
const handleContact = async (req, res) => {
  try {
    const name = req.body.Name || req.body.name;
    const email = req.body.Email || req.body.email;
    const subject = req.body.Subject || req.body.subject || 'Portfolio Inquiry';
    const message = req.body.Body || req.body.message || req.body.Message;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        errors: ['Name and Email are required fields.']
      });
    }

    const newMsg = {
      id: Date.now(),
      name,
      email,
      subject,
      message: message || '',
      isRead: false,
      replyText: '',
      createdDate: new Date().toISOString()
    };
    db.messages.unshift(newMsg);

    if (isMongoConnected) {
      const mongoMsg = new Message({ name, email, subject, message: message || '' });
      await mongoMsg.save();
    }

    console.log(`📩 [Contact Dispatch]: From ${name} (${email}) - ${subject}: ${message}`);

    return res.status(200).json({
      success: true,
      message: 'Transmission approved! Packet recorded in database.'
    });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({
      success: false,
      errors: ['Failed to record transmission payload.']
    });
  }
};

app.post('/Home/ContactSubmit', upload.none(), handleContact);
app.post('/api/contact', upload.none(), handleContact);

// ==========================================
// ADMIN API ENDPOINTS (A to Z Full Replication)
// ==========================================

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const u = (username || '').toLowerCase().trim();
  const p = (password || '').trim();

  const validUsers = ['saad', 'admin', 'saad.sa9112@gmail.com', 'admin@portfolio.com', 'admin@corenode.io', 'hms'];
  const validPasses = ['saad@9112', 'saad9112', 'admin123', 'admin', 'saad', 'admin@123456!'];

  if (validUsers.includes(u) && validPasses.map(p => p.toLowerCase()).includes(p.toLowerCase())) {
    const token = 'SEC_LINK_' + Math.random().toString(36).substring(2) + Date.now();
    return res.json({
      success: true,
      token,
      user: { name: 'Hafiz Muhammad Saad', email: 'saad.sa9112@gmail.com', role: 'ROOT_ADMIN' }
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials or security keycode.' });
});

// 2. Full Admin Data Bundle
app.get('/api/admin/data', (req, res) => {
  res.json({
    success: true,
    data: db
  });
});

// 3. Projects CRUD
app.post('/api/admin/projects', (req, res) => {
  const newProj = { id: Date.now(), ...req.body };
  db.projects.push(newProj);
  res.json({ success: true, data: newProj });
});
app.put('/api/admin/projects/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.projects.findIndex(p => p.id === id);
  if (idx !== -1) {
    db.projects[idx] = { ...db.projects[idx], ...req.body };
    return res.json({ success: true, data: db.projects[idx] });
  }
  res.status(404).json({ success: false, message: 'Project not found' });
});
app.delete('/api/admin/projects/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.projects = db.projects.filter(p => p.id !== id);
  res.json({ success: true, message: 'Project deleted' });
});

// 4. Skills CRUD
app.post('/api/admin/skills', (req, res) => {
  const newSkill = { id: Date.now(), ...req.body };
  db.skills.push(newSkill);
  res.json({ success: true, data: newSkill });
});
app.put('/api/admin/skills/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.skills.findIndex(s => s.id === id);
  if (idx !== -1) {
    db.skills[idx] = { ...db.skills[idx], ...req.body };
    return res.json({ success: true, data: db.skills[idx] });
  }
  res.status(404).json({ success: false, message: 'Skill not found' });
});
app.delete('/api/admin/skills/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.skills = db.skills.filter(s => s.id !== id);
  res.json({ success: true, message: 'Skill deleted' });
});

// 5. Tech Logs (Blogs) CRUD
app.post('/api/admin/blogs', (req, res) => {
  const newBlog = { id: Date.now(), views: 0, createdDate: new Date().toISOString().split('T')[0], ...req.body };
  db.blogs.push(newBlog);
  res.json({ success: true, data: newBlog });
});
app.put('/api/admin/blogs/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.blogs.findIndex(b => b.id === id);
  if (idx !== -1) {
    db.blogs[idx] = { ...db.blogs[idx], ...req.body };
    return res.json({ success: true, data: db.blogs[idx] });
  }
  res.status(404).json({ success: false, message: 'Blog not found' });
});
app.delete('/api/admin/blogs/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.blogs = db.blogs.filter(b => b.id !== id);
  res.json({ success: true, message: 'Blog deleted' });
});

// 6. Experience CRUD
app.post('/api/admin/experiences', (req, res) => {
  const newExp = { id: Date.now(), ...req.body };
  db.experiences.push(newExp);
  res.json({ success: true, data: newExp });
});
app.put('/api/admin/experiences/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.experiences.findIndex(e => e.id === id);
  if (idx !== -1) {
    db.experiences[idx] = { ...db.experiences[idx], ...req.body };
    return res.json({ success: true, data: db.experiences[idx] });
  }
  res.status(404).json({ success: false, message: 'Experience not found' });
});
app.delete('/api/admin/experiences/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.experiences = db.experiences.filter(e => e.id !== id);
  res.json({ success: true, message: 'Experience deleted' });
});

// 7. Education CRUD
app.post('/api/admin/educations', (req, res) => {
  const newEdu = { id: Date.now(), ...req.body };
  db.education.push(newEdu);
  res.json({ success: true, data: newEdu });
});
app.put('/api/admin/educations/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.education.findIndex(e => e.id === id);
  if (idx !== -1) {
    db.education[idx] = { ...db.education[idx], ...req.body };
    return res.json({ success: true, data: db.education[idx] });
  }
  res.status(404).json({ success: false, message: 'Education not found' });
});
app.delete('/api/admin/educations/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.education = db.education.filter(e => e.id !== id);
  res.json({ success: true, message: 'Education deleted' });
});

// 8. Certificates CRUD
app.post('/api/admin/certificates', (req, res) => {
  const newCert = { id: Date.now(), ...req.body };
  db.certificates.push(newCert);
  res.json({ success: true, data: newCert });
});
app.put('/api/admin/certificates/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.certificates.findIndex(c => c.id === id);
  if (idx !== -1) {
    db.certificates[idx] = { ...db.certificates[idx], ...req.body };
    return res.json({ success: true, data: db.certificates[idx] });
  }
  res.status(404).json({ success: false, message: 'Certificate not found' });
});
app.delete('/api/admin/certificates/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.certificates = db.certificates.filter(c => c.id !== id);
  res.json({ success: true, message: 'Certificate deleted' });
});

// 9. Testimonials CRUD
app.post('/api/admin/testimonials', (req, res) => {
  const newTest = { id: Date.now(), ...req.body };
  db.testimonials.push(newTest);
  res.json({ success: true, data: newTest });
});
app.put('/api/admin/testimonials/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.testimonials.findIndex(t => t.id === id);
  if (idx !== -1) {
    db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
    return res.json({ success: true, data: db.testimonials[idx] });
  }
  res.status(404).json({ success: false, message: 'Testimonial not found' });
});
app.delete('/api/admin/testimonials/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.testimonials = db.testimonials.filter(t => t.id !== id);
  res.json({ success: true, message: 'Testimonial deleted' });
});

// 10. Messages Inbox
app.get('/api/admin/messages', (req, res) => {
  res.json({ success: true, data: db.messages });
});
app.put('/api/admin/messages/:id/toggle-read', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const msg = db.messages.find(m => m.id === id);
  if (msg) {
    msg.isRead = !msg.isRead;
    return res.json({ success: true, data: msg });
  }
  res.status(404).json({ success: false, message: 'Message not found' });
});
app.delete('/api/admin/messages/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.messages = db.messages.filter(m => m.id !== id);
  res.json({ success: true, message: 'Message deleted' });
});

// 11. IP Firewall & Blacklist
app.post('/api/admin/firewall/block', (req, res) => {
  const { ip, reason } = req.body;
  if (!ip) return res.status(400).json({ success: false, message: 'IP required' });
  const entry = { id: Date.now(), ipAddress: ip, reason: reason || 'Manual Admin Blacklist', timestamp: new Date().toISOString() };
  db.blockedNodes.push(entry);
  res.json({ success: true, data: entry });
});
app.post('/api/admin/firewall/unblock', (req, res) => {
  const { ip } = req.body;
  db.blockedNodes = db.blockedNodes.filter(b => b.ipAddress !== ip);
  res.json({ success: true, message: 'Node unblocked' });
});

// 12. Settings & Feature Flags
app.post('/api/admin/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  res.json({ success: true, data: db.settings });
});
app.post('/api/admin/feature-flags', (req, res) => {
  db.featureFlags = { ...db.featureFlags, ...req.body };
  res.json({ success: true, data: db.featureFlags });
});

// 13. Factory Reset
app.post('/api/admin/reset', (req, res) => {
  Object.assign(db, JSON.parse(JSON.stringify(seedData)));
  res.json({ success: true, message: 'Database reset to seed state' });
});

// AI Assistant Chatbot Endpoint
app.post('/api/ai/chat', (req, res) => {
  const query = (req.body.message || "").toLowerCase().trim();

  if (query.includes("whatsapp") || query.includes("contact") || query.includes("phone") || query.includes("number") || query.includes("reach") || query.includes("email") || query.includes("location") || query.includes("address") || query.includes("rabta") || query.includes("baat")) {
    return res.json({
      success: true,
      reply: "### 📞 Connect Direct with Saad\n\nSaad is a Full-Stack Software Developer based in **Karachi, Pakistan**.\n\n• **WhatsApp Direct**: [+92 345 3937195](https://wa.me/923453937195?text=Hi%20Saad,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!)\n• **Email**: saad.sa9112@gmail.com\n• **Location**: Karachi, Pakistan\n\n[Chat on WhatsApp](https://wa.me/923453937195?text=Hi%20Saad,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!)"
    });
  }

  if (query.includes("cv") || query.includes("resume") || query.includes("download") || query.includes("pdf") || query.includes("file")) {
    return res.json({
      success: true,
      reply: "### 📄 Download Saad's Official CV\n\nClick below to download Hafiz Muhammad Saad's updated resume in PDF format:\n\n[Download CV (PDF)](/portfolio/files/Muhammad_Saad_CV.pdf)\n\n*Includes full details on C# ASP.NET Core 10 MVC, SQL Server, BSBC degree, and ADSE diploma.*"
    });
  }

  if (query.includes("project") || query.includes("work") || query.includes("built") || query.includes("created") || query.includes("portfolio") || query.includes("app") || query.includes("system") || query.includes("developed") || query.includes("kaam")) {
    return res.json({
      success: true,
      reply: "### 🚀 Featured System Deployments\n\n*   **[NED Academy Educational Management System](/portfolio/details/2/)**\n    *Enterprise educational ERP system engineered with ASP.NET Core 10 MVC and SQL Server 3NF relational databank.*\n\n*   **[Full-Stack Enterprise Developer Portfolio](/portfolio/)**\n    *Ultra-futuristic developer portfolio with cyber telemetry, command palette, and Light/Dark design system.*\n\n*   **[HMS Analytics & Telemetry Engine](/portfolio/details/2002/)**\n    *Real-time visitor analytics, IP geolocation lookup, and EF Core telemetry.*\n\n[Explore All Projects](/portfolio/)"
    });
  }

  return res.json({
    success: true,
    reply: `Hi! I'm Saad's AI Assistant 👋\n\nI can help you learn more about Hafiz Muhammad Saad's technical skills, enterprise projects, qualifications, or connect directly on WhatsApp:\n\n• **[Projects](/portfolio/)**: *View NED Academy UMS & other systems*\n• **[Tech Stack](/about/)**: *ASP.NET Core, C#, SQL Server, MERN*\n• **[CV / Resume](/portfolio/files/Muhammad_Saad_CV.pdf)**: *Download official CV*\n• **[WhatsApp](https://wa.me/923453937195)**: *Chat directly with Saad*`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MERN Backend Server running on http://localhost:${PORT}`);
});
