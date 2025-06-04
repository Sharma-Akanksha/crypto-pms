const axios = require('axios');
const { getSignatureHeaders } = require('../utils/signer');

const baseUrl = 'https://api.bitget.com';
const endpoint = '/api/v2/spot/trade/place-order'; // Example endpoint, replace with actual

async function placeOrder(orderData) {
  console.log("Received orderDetails in placeOrder:", orderData);
  const method = 'POST';
  const body = JSON.stringify(orderData);

  const headers = getSignatureHeaders(method, endpoint, body);

  try {
    const response = await axios.post(baseUrl + endpoint, orderData, { headers });
    console.log("API response:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
}

module.exports = { placeOrder };
