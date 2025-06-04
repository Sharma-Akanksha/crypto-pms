// server.js
require('dotenv').config();
const { connectDB } = require('./src/config/db'); // your DB config
const app = require('./src/app'); // your Express app

const PORT = process.env.PORT || 3000;

connectDB()  // ⬅ DB connection happens here
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 PMS API Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err);
  });
