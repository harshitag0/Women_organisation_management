const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all members
// @route   GET /api/members
// @access  Private/Admin, Bachatgat
const getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'Member' }).select('-password').sort({ group_role: 1, name: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single member profile
// @route   GET /api/members/:id
// @access  Private/Admin, Bachatgat
const getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');
    if (!member || member.role !== 'Member') {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new member
// @route   POST /api/members
// @access  Private/Admin, Bachatgat
const addMember = async (req, res) => {
  try {
    const { name, address, contact_no, username, password, email, aadhar_no, dob, age, group_role, savings } = req.body;

    // Check if username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const member = await User.create({
      role: 'Member',
      name,
      username,
      password: password || 'member123',
      email,
      contact_no,
      address,
      aadhar_no,
      dob,
      age,
      group_role: group_role || 'Member',
      savings: savings || 0,
      bachatgat_id: req.user.role === 'Bachatgat' ? req.user._id : null,
    });

    if (member) {
      res.status(201).json({
        _id: member._id,
        name: member.name,
        username: member.username,
        email: member.email,
        contact_no: member.contact_no,
        address: member.address,
        age: member.age,
        group_role: member.group_role,
        savings: member.savings,
        role: member.role,
        message: 'Member added successfully',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update member savings
// @route   PUT /api/members/:id/savings
// @access  Private/Admin, Bachatgat
const updateMemberSavings = async (req, res) => {
  try {
    const { savings } = req.body;
    const member = await User.findByIdAndUpdate(
      req.params.id,
      { savings },
      { new: true }
    ).select('-password');
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMembers, getMemberById, addMember, updateMemberSavings };
