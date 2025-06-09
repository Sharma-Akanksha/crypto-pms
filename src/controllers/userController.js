const User = require('../models/User');
const Trade = require('../models/Trade');
const exchangeService = require('../services/exchangeService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { standardResponse } = require('../utils/apiResponse');


exports.getBalance = async (req, res) => {
  try {
    const user = req.user; // comes from auth middleware
    const balance = await exchangeService.getBalance(user);

    res.json({ success: true, data: balance });

  } catch (err) {

    console.error('Balance error:', err.response?.data || err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch Bitget balance' });
  }
};


exports.getTrades = async (req, res) => {
  try {
    const user = req.user;

    const trades = await Trade.find({ userId: user._id });

    return res.json(standardResponse(true, 'Trades fetched', trades));
  } catch (error) {
    console.error('Trades fetch error:', error);
    return res.status(500).json(standardResponse(false, 'Internal server error'));
  }
};

exports.setTradeLimit = async (req, res) => {
  try {
    const { tradeLimit } = req.body;
    const user = req.user;

    if (tradeLimit < 1 || tradeLimit > 100)
      return res.status(400).json({ success: false, message: 'Limit must be between 1 and 100' });

    user.tradeLimit = tradeLimit;
    await user.save();

    res.json({ success: true, message: 'Trade limit updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to set limit' });
  }
};


exports.toggleService = async (req, res) => {
  try {
    const user = req.user;
    user.serviceEnabled = !user.serviceEnabled;
    await user.save();

    res.json({ success: true, message: `Service ${user.serviceEnabled ? 'enabled' : 'disabled'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Toggle failed' });
  }
};


exports.getPLReports = async (req, res) => {
  try {
    const user = req.user;

    // You may implement filter by daily/monthly via query params
    const trades = await Trade.find({ userId: user._id });

    let totalPL = 0;
    trades.forEach(trade => {
      totalPL += trade.pnl || 0;
    });

    return res.json(standardResponse(true, 'P/L report fetched', { totalPL, trades }));
  } catch (error) {
    console.error('P/L report error:', error);
    return res.status(500).json(standardResponse(false, 'Internal server error'));
  }
};

exports.getAccountInfo = async (req, res) => {
  try {
    const user = req.user;

    const accountInfo = {
      email: user.email,
      mobile: user.mobile,
      tradeLimit: user.tradeLimit || 100,
      serviceEnabled: user.serviceEnabled !== false,
    };

    const balance = await exchangeService.getBalance(user);
    accountInfo.balance = balance?.data || [];

    res.json({ success: true, data: accountInfo });
  } catch (err) {
    console.error('Account info error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch account info' });
  }
};

exports.updateApiKeys = async (req, res) => {
  try {
    const user = req.user;
    const { bitgetApiKey, bitgetSecretKey, bitgetPassphrase } = req.body;

    if (!bitgetApiKey || !bitgetSecretKey || !bitgetPassphrase) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    user.bitgetApiKey = bitgetApiKey;
    user.bitgetSecretKey = bitgetSecretKey;
    user.bitgetPassphrase = bitgetPassphrase;
    await user.save();

    res.json({ success: true, message: 'API keys updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Password update failed' });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const user = req.user;
    const { symbol, side, orderType } = req.body;

    if (!symbol || !side || !orderType)
      return res.status(400).json({ success: false, message: 'Missing required fields' });

    // Fetch balance
    const balanceData = await exchangeService.getBalance(user);
    const usdt = balanceData.data.find(c => c.coin === 'USDT');
    const available = parseFloat(usdt?.available || 0);

    // Calculate order quantity (as per tradeLimit)
    const percent = user.tradeLimit || 100;
    const amount = (available * (percent / 100)).toFixed(2);

    if (amount <= 0) return res.status(400).json({ success: false, message: 'Insufficient balance' });

    const orderPayload = {
      symbol,
      side,
      orderType,
      force: "gtc",
      quantity: amount
    };

    const result = await exchangeService.placeOrder(user, orderPayload);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Place order error:', err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data?.msg || 'Order failed' });
  }
};





