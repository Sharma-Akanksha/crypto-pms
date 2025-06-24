const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminAuthController');
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middlewares/authMiddleware');

// 🔐 Auth
router.post('/register', adminCtrl.register);
router.post('/login', adminCtrl.login);

// 🔐 Trade Management
router.post('/place-copy-trade', adminAuth, adminController.placeCopyTrade);
router.get('/trades', adminAuth, adminController.getAdminTrades);

module.exports = router;