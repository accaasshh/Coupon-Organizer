const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Coupon = require('../models/Coupon');

// GET all coupons for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const coupons = await Coupon.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST a new coupon
router.post('/', auth, async (req, res) => {
  const { storeName, code, category, expiryDate, storeUrl, description } = req.body;
  try {
    const newCoupon = new Coupon({
      storeName,
      code,
      category,
      expiryDate,
      storeUrl,
      description,
      user: req.user.id
    });
    const coupon = await newCoupon.save();
    res.json(coupon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a coupon
router.delete('/:id', auth, async (req, res) => {
  try {
    let coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ msg: 'Coupon not found' });

    // Ensure user owns the coupon
    if (coupon.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Coupon removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;