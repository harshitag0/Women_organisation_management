const Event = require('../models/Event');
const Saving = require('../models/Saving');

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

module.exports = {
  createEvent,
  getEvents,
  addSaving,
  getSavings
};
