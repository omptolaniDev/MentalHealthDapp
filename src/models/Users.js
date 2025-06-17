// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['patient', 'therapist', 'admin'],
    default: 'patient',
  },
});

module.exports = mongoose.model('User', userSchema);


// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('./User');

const generateToken = (user) => {
  return jwt.sign(
    {
      walletAddress: user.walletAddress,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );
};

exports.loginOrRegister = async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ message: 'Wallet address is required' });

  try {
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = new User({ walletAddress });
      await user.save();
    }

    const token = generateToken(user);
    res.status(200).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { loginOrRegister } = require('../controllers/authController');

router.post('/auth/wallet', loginOrRegister);

module.exports = router;
