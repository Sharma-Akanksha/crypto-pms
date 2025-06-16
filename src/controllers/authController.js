
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { standardResponse } = require('../utils/apiResponse');
const jwt = require('jsonwebtoken');

// POST /api/register
exports.register = async (req, res) => {
  const {
    email, mobile, password,
    bitgetApiKey, bitgetSecretKey, bitgetPassphrase
  } = req.body;

  if (!email || !mobile || !password || !bitgetApiKey || !bitgetSecretKey || !bitgetPassphrase) {
    return res.status(400).json(standardResponse(false, 'All fields are required'));
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json(standardResponse(false, 'User already exists'));

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      mobile,
      passwordHash,
      bitgetApiKey,
      bitgetSecretKey,
      bitgetPassphrase,
    });

    user.serviceEnabled = true;
    user.tradePercentageLimit = 100;

    await user.save();

    res.status(201).json(standardResponse(true, 'User registered successfully'));
    
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json(standardResponse(false, 'Internal server error'));
  }
};


// POST /api/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json(standardResponse(false, 'Email and password are required'));

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json(standardResponse(false, 'User not found'));

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json(standardResponse(false, 'Invalid password'));

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json(standardResponse(true, 'Login successful', {
      token,
      user: {
        email: user.email,
        mobile: user.mobile
      }
    }));
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json(standardResponse(false, 'Internal server error'));
  }
};