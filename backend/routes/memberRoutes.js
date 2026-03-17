const express = require('express');
const router = express.Router();
const { getMembers, addMember } = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

// Get all members
router.get('/', protect, authorize('Admin', 'Bachatgat'), getMembers);

// Add new member
router.post('/', protect, authorize('Admin', 'Bachatgat'), addMember);

module.exports = router;
