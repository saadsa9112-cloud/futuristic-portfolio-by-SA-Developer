const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, required: true },
  technologies: { type: String, required: true },
  githubLink: { type: String, default: '' },
  liveDemoLink: { type: String, default: '' },
  status: { type: String, default: 'Published' },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  thumbnailPath: { type: String, default: '' },
  category: { type: String, default: 'General' },
  challenges: { type: String, default: '' },
  solutions: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
