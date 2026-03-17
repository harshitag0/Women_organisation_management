const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bachatgat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loan_amount_required: {
    type: Number,
    required: true
  },
  reason: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Closed'],
    default: 'Pending'
  },
  approved_amount: {
    type: Number,
    default: 0
  },
  decline_reason: {
    type: String
  },
  // Repayment tracking tracking
  total_paid: {
    type: Number,
    default: 0
  },
  repayment_history: [{
    amount_paid: Number,
    date: { type: Date, default: Date.now },
    interest: Number
  }]
}, { timestamps: true });

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
