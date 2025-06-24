const axios = require('axios');

exports.getAvailableSymbols = async (req, res) => {
  try {
    const response = await axios.get('https://api.bitget.com/api/v2/spot/public/symbols');
    const symbols = response.data.data || [];
    res.json({ success: true, data: symbols });
  } catch (error) {
    console.error('Failed to fetch Bitget symbols:', error.message);
    res.status(500).json({ success: false, message: 'Bitget API error' });
  }
};
