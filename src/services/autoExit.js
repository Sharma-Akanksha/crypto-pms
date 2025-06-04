const axios = require('axios');
const { getSignatureHeaders } = require('../utils/signer');

const baseUrl = 'https://api.bitget.com';
const endpoint = '/api/v2/copy/spot-follower/auto-exit'; // Replace with actual endpoint

/**
 * Accepts:
 * {
 *   orderId: "123456",
 *   exitType: "PERCENTAGE" or "MANUAL",
 *   exitValue: 20  // e.g. 20% or exact quantity
 * }
 */
async function autoExitOrder(data) {
  const method = 'POST';
  const body = JSON.stringify(data);

  const headers = getSignatureHeaders(method, endpoint, body);

  try {
    const response = await axios.post(baseUrl + endpoint, data, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

module.exports = { autoExitOrder };
