const express = require('express');
const router = express.Router();
const { getMembers, getMemberById, addMember, updateMemberSavings } = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

// Get all members / Add new member
router.route('/')
  .get(protect, authorize('Admin', 'Bachatgat'), getMembers)
  .post(protect, authorize('Admin', 'Bachatgat'), addMember);

// Get single member profile
router.get('/:id', protect, authorize('Admin', 'Bachatgat'), getMemberById);

// Update member savings
router.put('/:id/savings', protect, authorize('Admin', 'Bachatgat'), updateMemberSavings);

module.exports = router;
