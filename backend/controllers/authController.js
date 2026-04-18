const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { role, username, password, name, email, contact_no, address, ...otherDetails } = req.body;

  // Block admin registration via public API
  if (role === 'Admin') {
    return res.status(403).json({ message: 'Admin accounts cannot be created via registration.' });
  }

  // Basic validation
  if (!role || !username || !password || !name) {
    return res.status(400).json({ message: 'Name, username, password and role are required.' });
  }

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'Username already taken. Please choose a different one.' });
    }

    const user = await User.create({
      role,
      username,
      password,
      name,
      email,
      contact_no,
      address,
      ...otherDetails
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data. Please check all fields.' });
    }
  } catch (error) {
    console.error('Register error:', error.message);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    // Handle duplicate key (race condition)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Hardcoded admin credentials
  if (username === 'admin' && password === '00000') {
    const adminToken = jwt.sign({ id: 'admin_hardcoded', role: 'Admin' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.json({
      _id: 'admin_hardcoded',
      username: 'admin',
      name: 'Administrator',
      role: 'Admin',
      token: adminToken,
    });
  }

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = {
  registerUser,
  loginUser
};
