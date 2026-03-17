const User = require('../models/User');

// @desc    Get all members
// @route   GET /api/members
// @access  Private/Admin, Bachatgat
const getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'Member' }).select('-password');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new member
// @route   POST /api/members
// @access  Private/Admin, Bachatgat
const addMember = async (req, res) => {
  try {
    const { name, address, contact_no, username, password, email, aadhar_no, dob } = req.body;

    // Check if username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new member
    const member = await User.create({
      role: 'Member',
      name,
      username,
      password: password || 'member123', // Default password if not provided
      email,
      contact_no,
      address,
      aadhar_no,
      dob,
      bachatgat_id: req.user.role === 'Bachatgat' ? req.user._id : null
    });

    if (member) {
      res.status(201).json({
        _id: member._id,
        name: member.name,
        username: member.username,
        email: member.email,
        contact_no: member.contact_no,
        address: member.address,
        role: member.role,
        message: 'Member added successfully'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMembers, addMember };
