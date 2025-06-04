const axios = require('axios');
const { getSignatureHeaders } = require('../utils/signer');

const baseUrl = 'https://api.bitget.com';
const endpoint = '/api/v2/copy/spot-follower/order-status'; // Update this to the actual endpoint if different

// Accepts an array of order IDs or other identifiers depending on the API
async function getOrderStatus(payload) {
  const method = 'POST';
  const body = JSON.stringify(payload); // example: { orderIds: ["123", "456"] }

  const headers = getSignatureHeaders(method, endpoint, body);

  try {
    const response = await axios.post(baseUrl + endpoint, payload, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

module.exports = { getOrderStatus };
