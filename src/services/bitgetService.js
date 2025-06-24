const axios = require('axios');
const CryptoJS = require('crypto-js');

function getHeaders(user, method, endpoint, body = '') {

    const timestamp = Date.now().toString();
    const preHash = timestamp + method + endpoint + body;

    const sign = CryptoJS.enc.Base64.stringify(
        CryptoJS.HmacSHA256(preHash, user.bitgetSecretKey)
    );

    return {
        'ACCESS-KEY': user.bitgetApiKey,
        'ACCESS-SIGN': sign,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': user.bitgetPassphrase,
        'Content-Type': 'application/json',
    };
}

exports.placeOrderForUser = async (user, orderData) => {
    const method = 'POST';
    const endpoint = '/api/v2/spot/trade/place-order';
    const url = 'https://api.bitget.com' + endpoint;

    console.log('🚀 Placing order for user:', user.email);
    console.log("order", orderData, orderData.orderType);
    try {
        const payload = {
            symbol: orderData.symbol,
            side: orderData.side,
            orderType: orderData.orderType,
            force: 'gtc',
            // size: orderData.quantity.toString()
        };

        // 🔁 Handle market buy/sell correctly
        if (orderData.orderType === 'market') {
            if (orderData.side === 'buy') {
                if (!orderData.notional) throw new Error("Missing notional for market buy");
                payload.notional = orderData.notional.toString();
                payload.size = payload.notional;
            } else if (orderData.side === 'sell') {
                if (!orderData.size) throw new Error("Missing quantity for market sell");
                payload.size = orderData.size.toString();
            }
        }
        
        // if (orderData.type === 'limit') {
        //     payload.price = orderData.price;
        // }

        // 🔁 For limit orders
        if (orderData.orderType === 'limit') {
            if (!orderData.quantity || !orderData.price) {
                throw new Error("Limit order must have price and quantity");
            }
            payload.price = orderData.price.toString();
            payload.size = orderData.quantity.toString();
        }


        const body = JSON.stringify(payload);

        console.log('➡️ Payload:', body);

        const headers = getHeaders(user, method, endpoint, body);

        console.log('➡️ Headers:', headers);

        const res = await axios.post(url, body, { headers });

        console.log('✅ Bitget response:', res.data);

        if (res.data.code !== '00000') {
            throw new Error(res.data.msg || 'Bitget error');
        }

        return {
            bitgetOrderId: res.data.data?.orderId || uuidv4(), // ✅ always return a trade ID fallback
        };

    } catch (error) {
        console.error('❌ Bitget API error for', user.email);

        if (error.response) {
            console.error('! Status:', error.response.status);
            console.error('! Data:', error.response.data);
        } else {
            console.error('! Message:', error.message);
        }

        throw error;
    }
};
