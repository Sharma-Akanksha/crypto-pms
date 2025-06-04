const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  tradeId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminTradeId: { type: String, required: true },  // trade created by admin
  orderType: { type: String, enum: ['buy', 'sell'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'executed', 'failed'], default: 'pending' },
  placedAt: Date,
  exchangeOrderId: String,
  pnl: Number,  // Profit or Loss
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
