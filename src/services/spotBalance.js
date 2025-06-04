const { bitgetRequest } = require('./bitgetClient');

async function getSpotBalance() {
  const endpoint = '/api/spot/v1/account/assets';
  return await bitgetRequest('GET', endpoint);
}

module.exports = { getSpotBalance };
