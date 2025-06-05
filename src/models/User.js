const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   exchangeUserId: { type: String, required: true },
//   exchangePassword: { type: String, required: true }, // hashed
//   emailOtp: { type: String, required: true },
//   mobileOtp: { type: String, required: true },
//   pmsCode: { type: String, required: true },

//   pmsUserId: { type: String, required: true },
//   pmsPassword: { type: String, required: true }, // hashed
//   email: { type: String, required: true, unique: true },
//   kycDocs: { type: String }, // Could be a file path or URL

// }, { timestamps: true });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  passwordHash: { type: String, required: true },

  bitgetApiKey: { type: String, required: true },
  bitgetSecretKey: { type: String, required: true },
  bitgetPassphrase: { type: String, required: true },

  otpVerified: { type: Boolean, default: true }, // optional if using OTPs later
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
