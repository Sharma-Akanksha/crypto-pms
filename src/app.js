require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);



// Import services
const { getServerTime } = require('./services/serverTime');
const { queryCurrentOrders } = require('./services/queryOrders');
const { getSpotBalance } = require('./services/spotBalance');
const { placeOrder } = require('./services/placeOrder');
const { getOrderStatus } = require('./services/orderStatus');
const { autoExitOrder } = require('./services/autoExit');
// const { getReports } = require('./services/reports');
// const { getProfitLoss } = require('./services/profitLoss');

// Routes

// Server Time
app.get('/api/server-time', async (req, res) => {
  try {
    const data = await getServerTime();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Query Current Orders
app.get('/api/query-orders', async (req, res) => {
  try {
    const data = await queryCurrentOrders();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Spot Balance
app.get('/api/spot-balance', async (req, res) => {
  try {
    const data = await getSpotBalance();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Place Order
app.post('/api/place-order', async (req, res) => {
  try {
    console.log("testing");
    const data = await placeOrder(req.body);
    res.json({ success: true, data });
  } catch (error) {
    console.log("error");
    res.status(500).json({ success: false, error: error.message });
  }
});

// Order Status
app.post('/api/order-status', async (req, res) => {
  try {
    const data = await getOrderStatus(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auto Exit
app.post('/api/auto-exit', async (req, res) => {
  try {
    const data = await autoExitOrder(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reports
// app.get('/api/reports', async (req, res) => {
//   try {
//     const data = await getReports(req.query);
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Profit/Loss
// app.get('/api/profit-loss', async (req, res) => {
//   try {
//     const data = await getProfitLoss(req.query);
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;
