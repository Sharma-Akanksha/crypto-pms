const express = require('express');
const router = express.Router();
const { getAvailableSymbols } = require('../controllers/marketController');

router.get('/symbols', getAvailableSymbols);

module.exports = router;
