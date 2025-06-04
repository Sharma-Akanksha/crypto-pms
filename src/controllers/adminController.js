const User = require('../models/User');
const Trade = require('../models/Trade');
const exchangeService = require('../services/exchangeService');
const { standardResponse } = require('../utils/apiResponse');

exports.placeTradeOrder = async (req, res) => {
  try {
    const { orderType, amount } = req.body;

    // Validate input
    if (!['buy', 'sell'].includes(orderType)) {
      return res.status(400).json(standardResponse(false, 'Invalid order type'));
    }

    // Get all active users who have service enabled
    const users = await User.find({ serviceEnabled: true });

    // For each user, calculate actual trade amount based on their balance and tradePercentageLimit
    for (const user of users) {
      // Get user balance from exchange via API
      const balance = await exchangeService.getBalance(user.exchangeDetails);

      const tradeAmount = (balance * user.tradePercentageLimit) / 100;

      if (tradeAmount < amount) {
        // Skip if trade amount less than minimum trade amount defined by admin
        continue;
      }

      // Place order on user exchange account
      const orderResult = await exchangeService.placeOrder(user.exchangeDetails, {
        orderType,
        amount: tradeAmount,
      });

      // Save trade record
      const trade = new Trade({
        userId: user._id,
        adminTradeId: 'adminTrade_' + Date.now(),
        orderType,
        amount: tradeAmount,
        status: orderResult.success ? 'executed' : 'failed',
        placedAt: new Date(),
        exchangeOrderId: orderResult.orderId || null,
      });

      await trade.save();
    }

    return res.json(standardResponse(true, 'Trade orders placed successfully'));
  } catch (error) {
    console.error('Error placing trade:', error);
    return res.status(500).json(standardResponse(false, 'Internal server error'));
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
