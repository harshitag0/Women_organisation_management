const express = require('express');
const router = express.Router();
const { createEvent, getEvents, addSaving, getSavings, getDashboardStats } = require('../controllers/miscController');
const { protect, authorize } = require('../middleware/auth');

router.route('/events')
  .post(protect, authorize('Admin'), createEvent)
  .get(getEvents);

router.route('/savings')
  .post(protect, authorize('Bachatgat'), addSaving)
  .get(protect, authorize('Bachatgat', 'Member'), getSavings);

// Public stats for dashboard
router.get('/stats', getDashboardStats);

module.exports = router;

