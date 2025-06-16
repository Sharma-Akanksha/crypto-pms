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

    try {
        const payload = {
            symbol: orderData.symbol,
            side: orderData.side,
            orderType: orderData.type,
            force: 'gtc',
            size: orderData.quantity.toString()
        };

        if (orderData.type === 'limit') {
            payload.price = orderData.price;
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
