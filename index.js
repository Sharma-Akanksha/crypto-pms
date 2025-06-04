require('dotenv').config();

const { getServerTime } = require('./services/serverTime');
const { queryCurrentOrders } = require('./services/queryOrders');
const { getSpotBalance } = require('./services/spotBalance');

async function main() {
  try {
    const serverTime = await getServerTime();
    console.log('✅ Server Time:', serverTime);

    const orders = await queryCurrentOrders();
    console.log('✅ Current Orders:', orders);

    const balance = await getSpotBalance();
    console.log('✅ Spot Balance:', balance);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
