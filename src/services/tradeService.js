const Trade = require('../models/Trade');
const bitgetService = require('./bitgetService');
const { v4: uuidv4 } = require('uuid');

exports.copyTradeToAllUsers = async ({ symbol, side, price, quantity, users }) => {
    const results = [];

    for (const user of users) {
        try {
            const userQty = (user.tradePercentageLimit || 100) / 100 * quantity;

            const orderPayload = {
                symbol,
                side,
                quantity: userQty,
                price,
                type: price ? 'limit' : 'market',
            };

            const response = await bitgetService.placeOrderForUser(user, orderPayload);

            await Trade.create({
                user: user._id,
                symbol,
                side,
                quantity: userQty,
                price,
                status: 'placed',
                tradeId: response?.orderId || uuidv4(),
                bitgetOrderId: response?.orderId || '',
            });

            results.push({ user: user.email, status: 'success' });

        } catch (err) {
            
            console.error(`Trade failed for ${user.email}:`, err.message);

            await Trade.create({
                user: user._id,
                symbol,
                side,
                quantity,
                price,
                status: 'failed',
                tradeId: uuidv4(),
                errorMessage: err.message,
            });

            results.push({ user: user.email, status: 'failed', error: err.message });
        }
    }

  return results;
};
