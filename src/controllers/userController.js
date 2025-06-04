const User = require('../models/User');
const Trade = require('../models/Trade');
const exchangeService = require('../services/exchangeService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { standardResponse } = require('../utils/apiResponse');

exports.register = async (req, res) => {
  try {
    const {
      pmsUserId,
      password,
      email,
      kycDocs,
      exchangeDetails, // { exchangeUserId, exchangePassword, emailOTP, mobileOTP, pmsCode }
    } = req.body;

    const existingUser = await User.findOne({ pmsUserId });
    if (existingUser) {
      return res.status(400).json(standardResponse(false, 'User ID already exists'));
    }

    password = req.body.password || req.body.pmsPassword;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      pmsUserId,
      passwordHash,
      email,
      kycDocs,
      exchangeDetails,
    });

    await newUser.save();

    return res.status(201).json(standardResponse(true, 'User registered successfully'));
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json(standardResponse(false, 'Internal server error'));
  }
};

exports.login = async (req, res) => {
  try {
    const { pmsUserId, password } = req.body;
    const user = await User.findOne({ pmsUserId });

    if (!user) return res.status(400).json(standardResponse(false, 'Invalid credentials'));

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json(standardResponse(false, 'Invalid credentials'));

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

    return res.json(standardResponse(true, 'Login successful', { token }));
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json(standardResponse(false, 'Internal server error'));
  }
};

exports.getBalance = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    const balance = await exchangeService.getBalance(user.exchangeDetails);

    return res.json(standardResponse(true, 'Balance fetched successfully', { balance }));
  } catch (error) {
    console.error('Balance fetch error:', error);
    return res.status(500).json(standardResponse(false, 'Internal server error'));
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
    const user = req.user;
    const { tradePercentageLimit } = req.body;

    if (tradePercentageLimit < 0 || tradePercentageLimit > 100) {
      return res.status(400).json(standardResponse(false, 'Trade percentage limit must be between 0 and 100'));
    }

    user.tradePercentageLimit = tradePercentageLimit;
    await user.save();

    return res.json(standardResponse(true, 'Trade percentage limit updated'));
  } catch (error) {
    console.error('Set trade limit error:', error);
    return res.status(500).json(standardResponse(false, 'Internal server error'));
  }
};

exports.toggleService = async (req, res) => {
  try {
    const user = req.user;
    const { enableService } = req.body;

    user.serviceEnabled = enableService;
    await user.save();

    return res.json(standardResponse(true, `Service ${enableService ? 'enabled' : 'disabled'}`));
  } catch (error) {
    console.error('Toggle service error:', error);
    return res.status(500).json(standardResponse(false, 'Internal server error'));
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
