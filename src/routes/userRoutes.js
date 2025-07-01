const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


// router.get('/balance', authMiddleware.userAuth, userController.getBalance);
// router.get('/trades', authMiddleware.userAuth, userController.getTrades);
// router.patch('/set-trade-limit', authMiddleware.userAuth, userController.setTradeLimit);
// router.patch('/toggle-service', authMiddleware.userAuth, userController.toggleService);
// router.get('/pl', authMiddleware.userAuth, userController.getPLReports);
// router.get('/account', authMiddleware.userAuth, userController.getAccountInfo);
// router.patch('/update-api-keys', authMiddleware.userAuth, userController.updateApiKeys);
// router.patch('/update-password', authMiddleware.userAuth, userController.updatePassword);
// router.get('/trades/active', authMiddleware.userAuth, userController.getActiveTrades);
// router.get('/profit/30d', authMiddleware.userAuth, userController.getLast30DayProfit);
// router.get('/pl-chart', authMiddleware.userAuth, userController.getProfitLossChartData);
router.get('/dashboard', authMiddleware.userAuth, userController.getUserDashboardStats);
router.get('/settings', authMiddleware.userAuth, userController.getUserSettings);
router.put('/settings', authMiddleware.userAuth, userController.updateUserSettings);
router.get('/trades/history', authMiddleware.userAuth, userController.getUserTradeHistory);
router.get('/report', authMiddleware.userAuth, userController.getUserReport);





// Example User Route
router.get('/profile', (req, res) => {
  res.json({ success: true, message: 'User profile accessed' });
});



module.exports = router;
