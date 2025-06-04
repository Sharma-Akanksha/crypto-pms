const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  exchangeUserId: { type: String, required: true },
  exchangePassword: { type: String, required: true }, // hashed
  emailOtp: { type: String, required: true },
  mobileOtp: { type: String, required: true },
  pmsCode: { type: String, required: true },

  pmsUserId: { type: String, required: true },
  pmsPassword: { type: String, required: true }, // hashed
  email: { type: String, required: true, unique: true },
  kycDocs: { type: String }, // Could be a file path or URL

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
