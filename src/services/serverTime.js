const { bitgetRequest } = require('./bitgetClient');

async function getServerTime() {
  const endpoint = '/api/v2/public/time';
  return await bitgetRequest('GET', endpoint);
}

module.exports = { getServerTime };
