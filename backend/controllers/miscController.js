const Event = require('../models/Event');
const Saving = require('../models/Saving');
const User = require('../models/User');
const Product = require('../models/Product');
const Announcement = require('../models/Announcement');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { title, description, location, date, image_url } = req.body;

    const event = new Event({
      admin_id: req.user._id,
      title,
      description,
      location,
      date,
      image_url
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add Saving (Deposit or Withdraw)
// @route   POST /api/savings
// @access  Private/Bachatgat
const addSaving = async (req, res) => {
  try {
    const { member_id, amount, type } = req.body;

    const saving = new Saving({
      bachatgat_id: req.user._id,
      member_id,
      amount,
      type
    });

    const createdSaving = await saving.save();
    res.status(201).json(createdSaving);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Bachatgat overall savings or by member
// @route   GET /api/savings
// @access  Private/Bachatgat
const getSavings = async (req, res) => {
  try {
    const filter = { bachatgat_id: req.user._id };
    if (req.query.member_id) filter.member_id = req.query.member_id;

    const savings = await Saving.find(filter)
        .populate('member_id', 'name username')
        .sort({ date: -1 });

    res.json(savings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Dashboard Stats (real counts from DB)
// @route   GET /api/stats
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const [totalMembers, newMembersThisWeek, newMembersLastMonth, totalProducts, totalAnnouncements, totalEvents, recentAnnouncements, recentMembers] = await Promise.all([
      User.countDocuments({ role: 'Member' }),
      User.countDocuments({ role: 'Member', createdAt: { $gte: oneWeekAgo } }),
      User.countDocuments({ role: 'Member', createdAt: { $gte: oneMonthAgo } }),
      Product.countDocuments(),
      Announcement.countDocuments(),
      Event.countDocuments({ date: { $gte: now } }), // upcoming events only
      Announcement.find({}).sort({ createdAt: -1 }).limit(5).populate('postedBy', 'name'),
      User.find({ role: 'Member' }).sort({ createdAt: -1 }).limit(5).select('name address contact_no group_role savings createdAt'),
    ]);

    // Build last 9 months growth data from DB
    const monthlyGrowth = [];
    for (let i = 8; i >= 0; i--) {
      const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const to   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const count = await User.countDocuments({ role: 'Member', createdAt: { $gte: from, $lte: to } });
      const label = from.toLocaleString('default', { month: 'short' });
      monthlyGrowth.push({ label, value: count });
    }

    res.json({
      totalMembers,
      activeMembers: totalMembers,
      newMembersThisWeek,
      newMembersLastMonth,
      totalProducts,
      totalAnnouncements,
      totalEvents,
      monthlyGrowth,
      recentAnnouncements,
      recentMembers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  addSaving,
  getSavings,
  getDashboardStats,
};
