const mongoose = require('mongoose');

const savingSchema = new mongoose.Schema({
  bachatgat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['Deposit', 'Withdrawal'],
    required: true
  }
}, { timestamps: true });

const Saving = mongoose.model('Saving', savingSchema);

module.exports = Saving;
