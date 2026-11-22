const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  iconClass: { type: String, default: 'fas fa-code' },
  colorHex: { type: String, default: '#00D9FF' },
  displayOrder: { type: Number, default: 0 },
  category: { type: String, default: 'Core' }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
