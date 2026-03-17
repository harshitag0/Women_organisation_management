const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  image_url: {
    type: String
  }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
