const User = require('../models/User');
const Trade = require('../models/Trade');
// const exchangeService = require('../services/exchangeService');
const { getBalance, getMarketPrice } = require('../services/exchangeService'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { standardResponse } = require('../utils/apiResponse');


// exports.getBalance = async (req, res) => {
//   try {
//     const user = req.user; // comes from auth middleware
//     const balance = await exchangeService.getBalance(user);

//     res.json({ success: true, data: balance });

//   } catch (err) {

//     console.error('Balance error:', err.response?.data || err.message);
//     res.status(500).json({ success: false, error: 'Failed to fetch Bitget balance' });
//   }
// };


// exports.getTrades = async (req, res) => {
//   try {
//     const user = req.user;

//     const trades = await Trade.find({ userId: user._id });

//     return res.json(standardResponse(true, 'Trades fetched', trades));
//   } catch (error) {
//     console.error('Trades fetch error:', error);
//     return res.status(500).json(standardResponse(false, 'Internal server error'));
//   }
// };

// exports.setTradeLimit = async (req, res) => {
//   try {
//     const { tradeLimit } = req.body;
//     const user = req.user;

//     if (tradeLimit < 1 || tradeLimit > 100)
//       return res.status(400).json({ success: false, message: 'Limit must be between 1 and 100' });

//     user.tradeLimit = tradeLimit;
//     await user.save();

//     res.json({ success: true, message: 'Trade limit updated' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Failed to set limit' });
//   }
// };


// exports.toggleService = async (req, res) => {
//   try {
//     const user = req.user;
//     user.serviceEnabled = !user.serviceEnabled;
//     await user.save();

//     res.json({ success: true, message: `Service ${user.serviceEnabled ? 'enabled' : 'disabled'}` });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Toggle failed' });
//   }
// };


// exports.getPLReports = async (req, res) => {
//   try {
//     const user = req.user;

//     // You may implement filter by daily/monthly via query params
//     const trades = await Trade.find({ userId: user._id });

//     let totalPL = 0;
//     trades.forEach(trade => {
//       totalPL += trade.pnl || 0;
//     });

//     return res.json(standardResponse(true, 'P/L report fetched', { totalPL, trades }));
//   } catch (error) {
//     console.error('P/L report error:', error);
//     return res.status(500).json(standardResponse(false, 'Internal server error'));
//   }
// };

// exports.getAccountInfo = async (req, res) => {
//   try {
//     const user = req.user;

//     const accountInfo = {
//       email: user.email,
//       mobile: user.mobile,
//       tradeLimit: user.tradeLimit || 100,
//       serviceEnabled: user.serviceEnabled !== false,
//     };

//     const balance = await exchangeService.getBalance(user);
//     accountInfo.balance = balance?.data || [];

//     res.json({ success: true, data: accountInfo });
//   } catch (err) {
//     console.error('Account info error:', err.message);
//     res.status(500).json({ success: false, message: 'Failed to fetch account info' });
//   }
// };

// exports.updateApiKeys = async (req, res) => {
//   try {
//     const user = req.user;
//     const { bitgetApiKey, bitgetSecretKey, bitgetPassphrase } = req.body;

//     if (!bitgetApiKey || !bitgetSecretKey || !bitgetPassphrase) {
//       return res.status(400).json({ success: false, message: 'All fields are required' });
//     }

//     user.bitgetApiKey = bitgetApiKey;
//     user.bitgetSecretKey = bitgetSecretKey;
//     user.bitgetPassphrase = bitgetPassphrase;
//     await user.save();

//     res.json({ success: true, message: 'API keys updated successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Update failed' });
//   }
// };

// exports.updatePassword = async (req, res) => {
//   try {
//     const user = req.user;
//     const { currentPassword, newPassword } = req.body;

//     const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
//     if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

//     user.passwordHash = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     res.json({ success: true, message: 'Password updated successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Password update failed' });
//   }
// };

// exports.getActiveTrades = async (req, res) => {
//   const user = req.user;
//   try {
//     const activeTrades = await Trade.find({ userId: user._id, status: 'active' });
//     res.json({ success: true, data: activeTrades });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error fetching active trades' });
//   }
// };

// exports.getLast30DayProfit = async (req, res) => {
//   const user = req.user;
//   const fromDate = new Date();
//   fromDate.setDate(fromDate.getDate() - 30);

//   try {
//     const trades = await Trade.find({ userId: user._id, createdAt: { $gte: fromDate } });
//     const totalProfit = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
//     res.json({ success: true, data: { totalProfit } });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error calculating 30d profit' });
//   }
// };

// exports.getProfitLossChartData = async (req, res) => {
//   const user = req.user;
//   const fromDate = new Date();
//   fromDate.setDate(fromDate.getDate() - 30);

//   try {
//     const trades = await Trade.find({ userId: user._id, createdAt: { $gte: fromDate } });

//     const chartData = {};
//     trades.forEach((trade) => {
//       const day = trade.createdAt.toISOString().slice(0, 10); // "YYYY-MM-DD"
//       chartData[day] = (chartData[day] || 0) + (trade.pnl || 0);
//     });

//     const formattedData = Object.entries(chartData).map(([date, pnl]) => ({ date, pnl }));
//     res.json({ success: true, data: formattedData });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error generating P/L chart' });
//   }
// };


// exports.getUserDashboardStats = async (req, res) => {
//   try {

//     // 1. Fetch user's trades
//     const user = req.user;

//     const trades = await Trade.find({ userId: user._id });

//     // 2. Count active (open) trades
//     const activeTrades = trades.filter(t => t.status === 'placed').length;

//     // 3. Calculate P/L (if stored)
//     const totalProfit = trades.reduce((acc, t) => acc + (t.pnl || 0), 0);

//     // 4. Get live balance
//     const balanceData = await getBalance(user);
//     const balances = balanceData?.data || [];

//     const usdtBalance = parseFloat(
//       balances.find(b => b.coinName === 'USDT')?.available || '0'
//     );

//     return res.json({
//       success: true,
//       data: {
//         activeTrades,
//         totalProfit,
//         currentBalance: usdtBalance,
//       },
//     });
//   } catch (error) {
//     console.error('User Dashboard Error:', error);
//     return res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

exports.getUserDashboardStats = async (req, res) => {
  try {
    const user = req.user;

    if (!user?.bitgetApiKey) {
      return res.status(400).json({ success: false, message: 'Missing API credentials' });
    }

    // ✅ 1. Get Live Balance from Bitget
    const balanceRes = await getBalance(user);
    const balances = balanceRes?.data || [];
    const usdtBalance = parseFloat(
      balances.find(b => b.coinName === 'USDT')?.available || '0'
    );

    // ✅ 2. Get Active Trades (status: 'placed' or 'open')
    const trades = await Trade.find({ user: user._id, status: 'placed' });

    const symbolHoldings = {};

    for (const trade of trades) {
      const symbol = trade.symbol;
      const qty = trade.quantity;

      if (!symbolHoldings[symbol]) symbolHoldings[symbol] = 0;

      if (trade.side === 'buy') {
        symbolHoldings[symbol] += qty;
      } else if (trade.side === 'sell') {
        symbolHoldings[symbol] -= qty;
      }
    }

    // Filter only coins with positive net holdings
    const activeTradeCount = Object.values(symbolHoldings).filter(qty => qty > 0).length;

    // ✅ 3. Get Profit in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const thirtyDaysTrades = await Trade.find({
      user: req.user._id,
      createdAt: { $gte: thirtyDaysAgo },
      status: 'placed',
    }).sort({ createdAt: 1 }); // FIFO

    console.log("thirtyDaysTrades", thirtyDaysTrades);

    const holdings = {};  // symbol => buy queue
    let totalProfit = 0;

    for (const trade of thirtyDaysTrades) {
      const { symbol, side, price, quantity } = trade;
      console.log("trade", trade);

      if (!holdings[symbol]) holdings[symbol] = [];

      if (side === 'buy') {
        holdings[symbol].push({ quantity, price }); // store buys in a queue
      } else if (side === 'sell') {
        let sellQty = quantity;
        let sellPrice = price;

        while (sellQty > 0 && holdings[symbol].length > 0) {
          let buy = holdings[symbol][0];

          const matchedQty = Math.min(buy.quantity, sellQty);
          const profit = (sellPrice - buy.price) * matchedQty;
          totalProfit += profit;

          buy.quantity -= matchedQty;
          sellQty -= matchedQty;

          if (buy.quantity <= 0) {
            holdings[symbol].shift(); // remove fully matched buy
          }
        }
      }
    }

    // ✅ 4. Unrealized Profit (Current Holdings)
    let unrealizedProfit = 0;

    for (const [symbol, netQty] of Object.entries(symbolHoldings)) {
      if (netQty > 0) {
        const userTrades = trades.filter(t => t.symbol === symbol && t.side === 'buy');
        const totalBuyQty = userTrades.reduce((sum, t) => sum + t.quantity, 0);
        const totalBuyCost = userTrades.reduce((sum, t) => sum + t.quantity * t.price, 0);

        // console.log(userTrades, totalBuyQty, totalBuyCost);
        if (totalBuyQty === 0) continue;

        const avgBuyPrice = totalBuyCost / totalBuyQty;
        const currentMarketPrice = await getMarketPrice(symbol);
        // console.log("market", currentMarketPrice);
        unrealizedProfit += (currentMarketPrice - avgBuyPrice) * netQty;
      }
    }

    // console.log(usdtBalance, activeTradeCount, totalProfit, unrealizedProfit, totalProfit + unrealizedProfit);
    return res.json({
      success: true,
      data: {
        totalUSDT: usdtBalance || 0,
        activeTradesCount: activeTradeCount || 0,
        realizedProfit: isNaN(totalProfit) ? 0 : Number(totalProfit.toFixed(2)),
        unrealizedProfit: isNaN(unrealizedProfit) ? 0 : Number(unrealizedProfit.toFixed(2)),
        totalProfit: isNaN(totalProfit + unrealizedProfit)
          ? 0
          : Number((totalProfit + unrealizedProfit).toFixed(2))
      },
    });


  } catch (err) {
    console.error('User Dashboard Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user dashboard stats',
      error: err.message
    });
  }
};

// exports.getUserDashboardStats = async (req, res) => {
//   try {
//     const user = req.user;

//     if (!user?.bitgetApiKey) {
//       return res.status(400).json({ success: false, message: 'Missing API credentials' });
//     }

//     // 1. Get USDT Balance
//     const balanceRes = await getBalance(user);
//     const balances = balanceRes?.data || [];
//     const usdtBalance = parseFloat(
//       balances.find(b => b.coinName === 'USDT')?.available || '0'
//     );

//     // 2. Get all trades of the user
//     const trades = await Trade.find({ user: user._id }).sort({ createdAt: 1 }); // FIFO

//     // Separate buys and sells
//     const holdings = {};
//     let realizedProfit = 0;

//     for (const trade of trades) {
//       const { symbol, side, price, quantity } = trade;

//       if (!holdings[symbol]) holdings[symbol] = [];

//       if (side === 'buy') {
//         holdings[symbol].push({ quantity, price }); // push to queue
//       }

//       if (side === 'sell') {
//         let sellQty = quantity;
//         let sellPrice = price;

//         while (sellQty > 0 && holdings[symbol].length > 0) {
//           const buy = holdings[symbol][0];
//           const matchedQty = Math.min(buy.quantity, sellQty);
//           const profit = (sellPrice - buy.price) * matchedQty;
//           realizedProfit += profit;

//           buy.quantity -= matchedQty;
//           sellQty -= matchedQty;

//           if (buy.quantity <= 0) {
//             holdings[symbol].shift(); // remove fully consumed buy
//           }
//         }
//       }
//     }

//     // 3. Calculate active trades and unrealized profit
//     let activeTradeCount = 0;
//     let unrealizedProfit = 0;

//     for (const [symbol, buys] of Object.entries(holdings)) {
//       if (buys.length > 0) {
//         activeTradeCount++;
//         const totalQty = buys.reduce((sum, t) => sum + t.quantity, 0);
//         const avgBuyPrice = buys.reduce((sum, t) => sum + (t.price * t.quantity), 0) / totalQty;

//         const marketPrice = await getMarketPrice(symbol);
//         if (marketPrice && marketPrice > 0) {
//           const profit = (marketPrice - avgBuyPrice) * totalQty;
//           unrealizedProfit += profit;
//         }
//       }
//     }

//     return res.json({
//       success: true,
//       data: {
//         totalUSDT: usdtBalance,
//         activeTradesCount: activeTradeCount,
//         realizedProfit: realizedProfit.toFixed(4),
//         unrealizedProfit: unrealizedProfit.toFixed(4),
//         totalProfit: (realizedProfit + unrealizedProfit).toFixed(4)
//       }
//     });

//   } catch (err) {
//     console.error('User Dashboard Error:', err.message);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch user dashboard stats',
//       error: err.message
//     });
//   }
// };


exports.getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // console.log("user", user, user.tradePercentageLimit);
    res.json({ success: true, data: { tradePercentageLimit: user.tradePercentageLimit } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};


exports.updateUserSettings = async (req, res) => {
  try {
    const { tradePercentageLimit } = req.body;

    if (tradePercentageLimit < 0 || tradePercentageLimit > 100) {
      return res.status(400).json({ success: false, message: 'Invalid percentage' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { tradePercentageLimit },
      { new: true }
    );

    

    res.json({ success: true, message: 'Settings updated', data: user });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

exports.getUserTradeHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch all trades sorted by creation time (FIFO)
    const trades = await Trade.find({ user: userId }).sort({ createdAt: 1 });

    const buyQueue = {}; // { symbol: [{ price, quantity }] }
    const result = [];

    for (const trade of trades) {
      const { symbol, side, price, quantity, status, createdAt } = trade;
      let pnl = 0;
      
      if (!buyQueue[symbol]) buyQueue[symbol] = [];

      if (side === 'buy') {
       
        buyQueue[symbol].push({ price, quantity });
      } else if (side === 'sell') {
        
        let remaining = quantity;
        
        while (remaining > 0 && buyQueue[symbol].length > 0) {
          const buy = buyQueue[symbol][0];
          const matchedQty = Math.min(buy.quantity, remaining);
          pnl += (price - buy.price) * matchedQty;
          buy.quantity -= matchedQty;
          remaining -= matchedQty;
          if (buy.quantity <= 0) buyQueue[symbol].shift();
        }
      }

      result.push({
        date: createdAt.toISOString().split('T')[0],
        pair: symbol,
        type: side,
        amount: quantity,
        profitLoss: side === 'sell' ? `$${pnl.toFixed(2)}` : '-',
        status: status.charAt(0).toUpperCase() + status.slice(1),
      });
    }

    return res.json({ success: true, data: result });

  } catch (error) {
    console.error('Trade history fetch error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch trade history' });
  }
};


// exports.getUserReport = async (req, res) => {
//   try {
//     const user = req.user;
//     const range = req.query.selectRange || 'daily';

//     let fromDate = new Date();
//     if (range === 'weekly') fromDate.setDate(fromDate.getDate() - 7);
//     else if (range === 'monthly') fromDate.setMonth(fromDate.getMonth() - 1);
//     else fromDate.setDate(fromDate.getDate() - 1);

//     console.log("date", fromDate);
//     const trades = await Trade.find({
//       user: user._id,
//       createdAt: { $gte: fromDate },
//       status: 'placed',
//     }).sort({ createdAt: 1 });

//     console.log("trade", trades);

//     const summary = {};

//     for (const trade of trades) {
//       const { symbol, side, quantity, price, createdAt } = trade;

//       if (!summary[symbol]) {
//         summary[symbol] = {
//           symbol,
//           totalBuy: 0,
//           totalSell: 0,
//           buyRecords: [],
//           realizedPnL: 0,
//           createdAt,
//         };
//       }

//       const sym = summary[symbol];

//       if (side === 'buy') {
//         sym.totalBuy += quantity;
//         sym.buyRecords.push({ quantity, price });
//       } else if (side === 'sell') {
//         sym.totalSell += quantity;
//         let sellQty = quantity;

//         while (sellQty > 0 && sym.buyRecords.length > 0) {
//           const buy = sym.buyRecords[0];
//           const matchedQty = Math.min(sellQty, buy.quantity);
//           sym.realizedPnL += (price - buy.price) * matchedQty;

//           buy.quantity -= matchedQty;
//           sellQty -= matchedQty;

//           if (buy.quantity <= 0) sym.buyRecords.shift();
//         }
//       }
//     }

//     // Get unrealized PnL using live market price
//     const finalData = [];
//     for (const sym in summary) {
//       const data = summary[sym];
//       const currentPrice = await getMarketPrice(sym);
//       let unrealized = 0;
//       let totalQty = 0;
//       let totalCost = 0;

//       for (const buy of data.buyRecords) {
//         unrealized += (currentPrice - buy.price) * buy.quantity;
//         totalCost += buy.price * buy.quantity;
//         totalQty += buy.quantity;
//       }

//       finalData.push({
//         symbol: sym,
//         totalBuy: data.totalBuy,
//         totalSell: data.totalSell,
//         avgBuyPrice: totalQty ? totalCost / totalQty : 0,
//         realizedPnL: data.realizedPnL,
//         unrealizedPnL: totalQty > 0 ? unrealized : 0,
//         createdAt: data.createdAt.toISOString().split('T')[0],
//       });
//     }

//     return res.json({ success: true, data: finalData });

//   } catch (err) {
//     console.error('User Report Error:', err.message);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch report',
//       error: err.message
//     });
//   }
// };


exports.getUserReport = async (req, res) => {
  try {
    const user = req.user;
    const range = req.query.selectRange || 'daily';

    let fromDate = new Date();
    if (range === 'weekly') fromDate.setDate(fromDate.getDate() - 7);
    else if (range === 'monthly') fromDate.setMonth(fromDate.getMonth() - 1);
    else fromDate.setDate(fromDate.getDate() - 1);

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
          purchaseDate: createdAt,
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

    const finalData = [];
    for (const sym in summary) {
      const data = summary[sym];
      const currentPrice = await getMarketPrice(sym);
      let unrealized = 0, totalQty = 0, totalCost = 0;

      for (const buy of data.buyRecords) {
        unrealized += (currentPrice - buy.price) * buy.quantity;
        totalCost += buy.price * buy.quantity;
        totalQty += buy.quantity;
      }

      finalData.push({
        symbol: sym,
        totalBuy: data.totalBuy,
        totalSell: data.totalSell,
        avgBuyPrice: totalQty ? totalCost / totalQty : 0,
        realizedPnL: data.realizedPnL,
        unrealizedPnL: totalQty > 0 ? unrealized : 0,
        purchaseDate: data.purchaseDate.toISOString().split('T')[0],
        currentValue: (totalQty * currentPrice)
      });
    }

    return res.json({ success: true, data: finalData });

  } catch (err) {
    console.error('User Report Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: err.message
    });
  }
};








