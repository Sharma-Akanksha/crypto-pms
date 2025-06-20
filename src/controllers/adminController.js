const User = require('../models/User');
const Trade = require('../models/Trade');
const exchangeService = require('../services/exchangeService');
const tradeService = require('../services/tradeService');
const { standardResponse } = require('../utils/apiResponse');
const { v4: uuidv4 } = require('uuid');

exports.placeTradeOrder = async (req, res) => {
  try {
    const { orderType, amount } = req.body;

    // Validate input
    if (!['buy', 'sell'].includes(orderType)) {
      return res.status(400).json(standardResponse(false, 'Invalid order type'));
    }

    const estimatedPrice = price || 0.000008;
    const approxValue = Number(quantity) * estimatedPrice;

    if (approxValue < 1) {
      return res.status(400).json({
        success: false,
        message: 'Trade value must be at least 1 USDT to avoid Bitget rejection'
      });
    }

    // Get all active users who have service enabled
    const users = await User.find({ serviceEnabled: true });

    // For each user, calculate actual trade amount based on their balance and tradePercentageLimit
    for (const user of users) {
      // Get user balance from exchange via API
      try {
        const userQty = (Number(quantity) * (user.tradePercentageLimit || 100)) / 100;
        const response = await placeOrderForUser(user, {
          symbol,
          side,
          type: orderType,
          price,
          quantity: userQty
        });

        await Trade.create({
          user: user._id,
          symbol,
          side,
          quantity: userQty,
          price,
          status: 'placed',
          tradeId: response?.orderId || uuidv4(),
          bitgetOrderId: response?.orderId
        });

        results.push({ user: user.email, status: 'success', orderId: response?.orderId });

      } catch (err) {
        results.push({ user: user.email, status: 'failed', error: err.message });
      }
    }

    res.json({ success: true, message: 'Copy trade executed', data: { results } });

  } catch (error) {
    console.error('Copy trade error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsersPL = async (req, res) => {
  try {
    // Aggregate P/L for all users
    const trades = await Trade.find().populate('userId', 'pmsUserId');

    const userPLMap = {};

    trades.forEach((trade) => {
      const userId = trade.userId.pmsUserId;
      if (!userPLMap[userId]) userPLMap[userId] = 0;
      userPLMap[userId] += trade.pnl || 0;
    });

    return res.json(standardResponse(true, 'P/L report fetched', userPLMap));
  } catch (error) {
    console.error('Error fetching P/L:', error);
    return res.status(500).json(standardResponse(false, 'Internal server error'));
  }
};

exports.placeCopyTrade = async (req, res) => {
  try {
    const { symbol, side, price, quantity } = req.body;

    if (!symbol || !side || !quantity) {
      return res.status(400).json(standardResponse(false, 'Missing required trade parameters'));
    }

    // const estimatedPrice = price || 0.000001;
    // const approxValue = Number(quantity) * estimatedPrice;

    // if (approxValue < 1) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Trade value must be at least 1 USDT to avoid Bitget rejection'
    //   });
    // }

    const users = await User.find({ serviceEnabled: true });

    const results = await tradeService.copyTradeToAllUsers({
      symbol,
      side,
      price,
      quantity,
      users,
    });

    return res.json(standardResponse(true, 'Copy trade executed', { results }));

  } catch (error) {

    console.error('Copy trade error:', error);
    return res.status(500).json(standardResponse(false, 'Server error'));

  }
};
