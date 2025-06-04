const { bitgetRequest } = require('./bitgetClient');

async function queryCurrentOrders() {
  const endpoint = '/api/v2/copy/spot-follower/query-current-orders';
  return await bitgetRequest('GET', endpoint);
}

module.exports = { queryCurrentOrders };
