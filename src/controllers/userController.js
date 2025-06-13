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

exports.getActiveTrades = async (req, res) => {
  const user = req.user;
  try {
    const activeTrades = await Trade.find({ userId: user._id, status: 'active' });
    res.json({ success: true, data: activeTrades });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching active trades' });
  }
};

exports.getLast30DayProfit = async (req, res) => {
  const user = req.user;
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);

  try {
    const trades = await Trade.find({ userId: user._id, createdAt: { $gte: fromDate } });
    const totalProfit = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    res.json({ success: true, data: { totalProfit } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error calculating 30d profit' });
  }
};

exports.getProfitLossChartData = async (req, res) => {
  const user = req.user;
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);

  try {
    const trades = await Trade.find({ userId: user._id, createdAt: { $gte: fromDate } });

    const chartData = {};
    trades.forEach((trade) => {
      const day = trade.createdAt.toISOString().slice(0, 10); // "YYYY-MM-DD"
      chartData[day] = (chartData[day] || 0) + (trade.pnl || 0);
    });

    const formattedData = Object.entries(chartData).map(([date, pnl]) => ({ date, pnl }));
    res.json({ success: true, data: formattedData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating P/L chart' });
  }
};






