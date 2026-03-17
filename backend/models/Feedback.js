const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  author_name: {
    type: String, // fallback if anonymous
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Customer', 'Bachatgat', 'General'],
    default: 'General'
  }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
