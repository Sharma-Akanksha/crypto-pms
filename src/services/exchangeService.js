// This service will handle real API calls to crypto exchanges.
// For now, stubbing methods with examples. Replace with actual API integration.
const axios = require('axios');
const CryptoJS = require('crypto-js');


const getBitgetHeaders = (apiKey, secretKey, passphrase, method, endpoint, body = '') => {
  const timestamp = Date.now().toString();
  const preHash = timestamp + method + endpoint + body;

  const sign = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(preHash, secretKey)
  );

  return {
    'ACCESS-KEY': apiKey,
    'ACCESS-SIGN': sign,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': passphrase,
    'locale': 'en-US',
    'Content-Type': 'application/json',
  };
};

exports.getBalance = async (user) => {
  const method = 'GET';
  const endpoint = '/api/spot/v1/account/assets';
  const url = 'https://api.bitget.com' + endpoint;

  const headers = getBitgetHeaders(
    user.bitgetApiKey,
    user.bitgetSecretKey,
    user.bitgetPassphrase,
    method,
    endpoint
  );

  const response = await axios.get(url, { headers });
  return response.data;
};

exports.getFinalBalanceFromBitget = async (user) => {
  const response = await exports.getBalance(user);
  const balances = response?.data || [];

  return balances.reduce((acc, coin) => {
    acc[coin.coinName] = parseFloat(coin.available || '0');
    return acc;
  }, {});
};


exports.getMarketPrice = async (symbol) => {
  
  try {
    const response = await axios.get(
      `https://api.bitget.com/api/v2/spot/market/tickers?symbol=${symbol}`
    );
    return parseFloat(response.data?.data?.[0]?.lastPr || 0);
  } catch (err) {
    console.error('❌ Error getting market price:', err.message);
    return 0;
  }
};


