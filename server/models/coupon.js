const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links coupon to specific user
  storeName: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String }, // e.g., "20% OFF on Shoes"
  category: { 
    type: String, 
    required: true,
    enum: ['Food', 'Fashion', 'Tech', 'Travel', 'Health', 'Other'] 
  },
  expiryDate: { type: Date, required: true },
  storeUrl: { type: String },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', CouponSchema);