const User = require('../models/User');
const Trade = require('../models/Trade');
const tradeService = require('../services/tradeService');
const { getFinalBalanceFromBitget, getBalance, getMarketPrice } = require('../services/exchangeService');
const { standardResponse } = require('../utils/apiResponse');
const { v4: uuidv4 } = require('uuid');

 exports.getAdminTrades = async (req, res) => {
  try {
    const users = await User.find({ serviceEnabled: true });

    const results = [];

    for (const user of users) {
      const balances = await getFinalBalanceFromBitget(user);

      for (const [coin, amount] of Object.entries(balances)) {
        if (amount > 0) {
          results.push({
            userEmail: user.email,
            coin,
            finalBalance: amount
          });
        }
      }
    }

    // console.log("Result for users", results);

    return res.json({
      success: true,
      message: 'Final balances fetched from Bitget',
      data: results
    });

  } catch (error) {
    console.error('Error fetching balances:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch final balances' });
  }
};

// exports.placeTradeOrder = async (req, res) => {
//   try {
//     const { orderType, amount } = req.body;

//     // Validate input
//     if (!['buy', 'sell'].includes(orderType)) {
//       return res.status(400).json(standardResponse(false, 'Invalid order type'));
//     }

//     const estimatedPrice = price || 0.000008;
//     const approxValue = Number(quantity) * estimatedPrice;

//     if (approxValue < 1) {
//       return res.status(400).json({
//         success: false,
//         message: 'Trade value must be at least 1 USDT to avoid Bitget rejection'
//       });
//     }

//     // Get all active users who have service enabled
//     const users = await User.find({ serviceEnabled: true });

//     // For each user, calculate actual trade amount based on their balance and tradePercentageLimit
//     for (const user of users) {
//       // Get user balance from exchange via API
//       const balance = await exchangeService.getBalance(user.exchangeDetails);

//       const tradeAmount = (balance * user.tradePercentageLimit) / 100;

//       if (tradeAmount < amount) {
//         // Skip if trade amount less than minimum trade amount defined by admin
//         continue;
//       }

//       // Place order on user exchange account
//       const orderResult = await exchangeService.placeOrder(user.exchangeDetails, {
//         orderType,
//         amount: tradeAmount,
//       });

//       // Save trade record
//       const trade = new Trade({
//         userId: user._id,
//         adminTradeId: 'adminTrade_' + Date.now(),
//         orderType,
//         amount: tradeAmount,
//         status: orderResult.success ? 'executed' : 'failed',
//         placedAt: new Date(),
//         exchangeOrderId: orderResult.orderId || null,
//       });

//       await trade.save();
//     }

//     return res.json(standardResponse(true, 'Trade orders placed successfully'));
//   } catch (error) {
//     console.error('Error placing trade:', error);
//     return res.status(500).json(standardResponse(false, 'Internal server error'));
//   }
// };

// exports.getAllUsersPL = async (req, res) => {
//   try {
//     // Aggregate P/L for all users
//     const trades = await Trade.find().populate('userId', 'pmsUserId');

//     const userPLMap = {};

//     trades.forEach((trade) => {
//       const userId = trade.userId.pmsUserId;
//       if (!userPLMap[userId]) userPLMap[userId] = 0;
//       userPLMap[userId] += trade.pnl || 0;
//     });

//     return res.json(standardResponse(true, 'P/L report fetched', userPLMap));
//   } catch (error) {
//     console.error('Error fetching P/L:', error);
//     return res.status(500).json(standardResponse(false, 'Internal server error'));
//   }
// };

exports.placeCopyTrade = async (req, res) => {
  try {
    const { symbol, side, price, quantity } = req.body;

    if (!symbol || !side || !quantity) {
      return res.status(400).json(standardResponse(false, 'Missing required trade parameters'));
    }


    const users = await User.find({ serviceEnabled: true });

    const results = await tradeService.copyTradeToAllUsers({
      symbol,
      side,
      price,
      quantity,
      users,
    });

    console.log("res", results);
    return res.json(standardResponse(true, 'Copy trade executed', { results }));

  } catch (error) {

    console.error('Copy trade error:', error);
    return res.status(500).json(standardResponse(false, 'Server error'));

  }
};

exports.getAdminReport = async (req, res) => {
  try {
    const range = req.query.selectRange || 'daily';

    let fromDate = new Date();
    if (range === 'weekly') fromDate.setDate(fromDate.getDate() - 7);
    else if (range === 'monthly') fromDate.setMonth(fromDate.getMonth() - 1);
    else fromDate.setDate(fromDate.getDate() - 1);

    const users = await User.find({ serviceEnabled: true });
    const allData = [];

    for (const user of users) {
      const trades = await Trade.find({
        user: user._id,
        createdAt: { $gte: fromDate },
        status: 'placed',
      }).sort({ createdAt: 1 });

      const summary = {};

      for (const trade of trades) {
        const { symbol, side, quantity, price, createdAt } = trade;

        if (!summary[symbol]) {
          summary[symbol] = {
            symbol,
            totalBuy: 0,
            totalSell: 0,
            buyRecords: [],
            realizedPnL: 0,
            createdAt,
          };
        }

        const sym = summary[symbol];

        if (side === 'buy') {
          sym.totalBuy += quantity;
          sym.buyRecords.push({ quantity, price });
        } else if (side === 'sell') {
          sym.totalSell += quantity;
          let sellQty = quantity;

          while (sellQty > 0 && sym.buyRecords.length > 0) {
            const buy = sym.buyRecords[0];
            const matchedQty = Math.min(sellQty, buy.quantity);
            sym.realizedPnL += (price - buy.price) * matchedQty;

            buy.quantity -= matchedQty;
            sellQty -= matchedQty;

            if (buy.quantity <= 0) sym.buyRecords.shift();
          }
        }
      }

      for (const symbol in summary) {
        const data = summary[symbol];
        const currentPrice = await getMarketPrice(symbol);
        let unrealized = 0;
        let totalQty = 0;
        let totalCost = 0;

        for (const buy of data.buyRecords) {
          unrealized += (currentPrice - buy.price) * buy.quantity;
          totalCost += buy.price * buy.quantity;
          totalQty += buy.quantity;
        }

        allData.push({
          userEmail: user.email,
          symbol,
          totalBuy: data.totalBuy,
          totalSell: data.totalSell,
          avgBuyPrice: totalQty ? totalCost / totalQty : 0,
          realizedPnL: data.realizedPnL,
          unrealizedPnL: totalQty > 0 ? unrealized : 0,
          purchaseDate: data.createdAt.toISOString().split('T')[0],
          currentValue: currentPrice,
        });
      }
    }

    return res.json({ success: true, data: allData });

  } catch (err) {
    console.error('Admin Report Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin report' });
  }
};

