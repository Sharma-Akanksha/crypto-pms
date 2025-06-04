const CryptoJS = require('crypto-js');

function getSignatureHeaders(method, endpoint, body = '') {
  const timestamp = Date.now().toString();
  const preHash = timestamp + method.toUpperCase() + endpoint + body;
  const sign = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(preHash, process.env.API_SECRET)
  );

  return {
    'ACCESS-KEY': process.env.API_KEY,
    'ACCESS-SIGN': sign,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': process.env.PASSPHRASE,
    'locale': 'en-US',
    'Content-Type': 'application/json',
  };
}

module.exports = { getSignatureHeaders };
