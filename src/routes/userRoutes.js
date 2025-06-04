const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/balance', authMiddleware.userAuth, userController.getBalance);
router.get('/trades', authMiddleware.userAuth, userController.getTrades);
router.post('/trade-limit', authMiddleware.userAuth, userController.setTradeLimit);
router.post('/service-toggle', authMiddleware.userAuth, userController.toggleService);
router.get('/pl', authMiddleware.userAuth, userController.getPLReports);


// Example User Route
router.get('/profile', (req, res) => {
  res.json({ success: true, message: 'User profile accessed' });
});



module.exports = router;
