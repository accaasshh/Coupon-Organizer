require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS

const app = express();

// --- CRITICAL CHANGE: ALLOW EVERYTHING ---
app.use(cors()); // No options = Allow Everyone
app.use(express.json());

// --- ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/coupons', require('./routes/coupons'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("CORS is enabled for ALL origins now."); // Look for this message!
});

module.exports = app;