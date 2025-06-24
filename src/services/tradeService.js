const Trade = require('../models/Trade');
const bitgetService = require('./bitgetService');
const  { getBalance, getMarketPrice } = require('../services/exchangeService');
const { v4: uuidv4 } = require('uuid');

exports.copyTradeToAllUsers = async ({ symbol, side, price, quantity, users }) => {
    const results = [];
    const marketPrice = await getMarketPrice(symbol);

    if (!marketPrice || isNaN(marketPrice) || marketPrice <= 0) {
        return users.map(user => ({
            user: user.email,
            status: 'failed',
            reason: 'Invalid market price received'
        }));
    }

    for (const user of users) {
        
        try {
            const balanceData = await getBalance(user);
            const balances = balanceData?.data || [];

            const usdtBalance = parseFloat(
                balances.find((b) => b.coinName === 'USDT')?.available || '0'
            );

            const spendableUSDT = (usdtBalance * (user.tradePercentageLimit || 100)) / 100;
            const estimatedQty = Math.floor((spendableUSDT / marketPrice) * 1e6) / 1e6;
            console.log("spendableUSDT",spendableUSDT, spendableUSDT.toFixed(6));
            if (side === 'buy') {
                // Calculate how much USDT will be used
                if (isNaN(spendableUSDT) || spendableUSDT < 1) {
                    results.push({ user: user.email, status: 'skipped', reason: 'Less than 1 USDT available' });
                    continue;
                }

                const orderPayload = {
                    symbol,
                    side,
                    orderType: 'market',
                    force: 'gtc',
                    notional: spendableUSDT.toFixed(6), // 💡 Use notional for market buy
                    size: estimatedQty.toString(),
                };

                const response = await bitgetService.placeOrderForUser(user, orderPayload);

                await Trade.create({
                    user: user._id,
                    symbol,
                    side,
                    quantity: estimatedQty, // Saved for reference
                    price: marketPrice,
                    status: 'placed',
                    tradeId: response?.orderId || uuidv4(),
                    bitgetOrderId: response?.orderId || '',
                });

                results.push({ user: user.email, status: 'success', orderId: response?.orderId });

            } else if (side === 'sell') {

                // Find available token balance
                const tokenSymbol = symbol.replace('USDT', '');
                const tokenBalance = parseFloat(
                    balances.find((b) => b.coinName === tokenSymbol)?.available || '0'
                );

                if (tokenBalance < quantity) {
                    results.push({ user: user.email, status: 'skipped', reason: `Not enough ${tokenSymbol}` });
                    continue;
                }
                // console.log("quantity",quantity, quantity.toFixed(6));
                const orderPayload = {
                    symbol,
                    side,
                    orderType: 'market',
                    force: 'gtc',
                    size: quantity, // ✅ Sell based on token amount
                };

                const response = await bitgetService.placeOrderForUser(user, orderPayload);

                await Trade.create({
                    user: user._id,
                    symbol,
                    side,
                    quantity,
                    price: marketPrice,
                    status: 'placed',
                    tradeId: response?.orderId || uuidv4(),
                    bitgetOrderId: response?.orderId || '',
                });

                results.push({ user: user.email, status: 'success', orderId: response?.orderId });
            }

        } catch (err) {

            console.error(`Trade failed for ${user.email}:`, err.message);

            await Trade.create({
                user: user._id,
                symbol,
                side,
                quantity: 0,
                price: marketPrice,
                status: 'failed',
                tradeId: uuidv4(),
                bitgetOrderId: null,
                errorMessage: err.message,
            });

            results.push({ user: user.email, status: 'failed', error: err.message });
        }
    }

    return results;
};
