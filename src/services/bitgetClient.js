const axios = require('axios');
const { getSignatureHeaders } = require('../utils/signer');

const baseURL = process.env.BASE_URL || 'https://api.bitget.com';

async function bitgetRequest(method, endpoint, data = '') {
  try {
    const headers = getSignatureHeaders(method, endpoint, data ? JSON.stringify(data) : '');
    const options = {
      method,
      url: baseURL + endpoint,
      headers,
      data: data ? JSON.stringify(data) : undefined,
    };

    const response = await axios(options);
    return response.data;
  } catch (error) {
    // Throw error with useful info for caller to handle/log
    throw new Error(error.response?.data?.message || error.message);
  }
}

module.exports = { bitgetRequest };
