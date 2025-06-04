const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminUserId: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  // other admin fields
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
