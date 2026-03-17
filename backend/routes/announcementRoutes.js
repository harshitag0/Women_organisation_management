const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

// Public route - anyone can view announcements
router.get('/', getAnnouncements);

// Protected routes - only Admin can create/delete
router.post('/', protect, authorize('Admin'), createAnnouncement);
router.delete('/:id', protect, authorize('Admin'), deleteAnnouncement);

module.exports = router;
