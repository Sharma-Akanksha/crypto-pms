const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// For now, assume auth middleware for admin routes (implement JWT or session auth)

router.post('/trade', authMiddleware.adminAuth, adminController.placeTradeOrder);
router.get('/pl', authMiddleware.adminAuth, adminController.getAllUsersPL);

// POST /api/admin/place-copy-trade
router.post('/place-copy-trade', adminController.placeCopyTrade);

// Example Admin Route
// router.get('/dashboard', (req, res) => {
//   res.json({ success: true, message: 'Admin dashboard accessed' });
// });

module.exports = router;
