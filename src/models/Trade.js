const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number }, // optional for market orders
  status: { type: String, enum: ['placed', 'failed'], default: 'placed' },
  errorMessage: { type: String }, // if status is failed
  tradeId: { type: String, unique: true },
  bitgetOrderId: { type: String }, // optional
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
