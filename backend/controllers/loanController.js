const Loan = require('../models/Loan');

// @desc    Apply for a loan
// @route   POST /api/loans
// @access  Private/Member
const applyForLoan = async (req, res) => {
  try {
    const { bachatgat_id, loan_amount_required, reason } = req.body;

    const loan = new Loan({
      member_id: req.user._id,
      bachatgat_id,
      loan_amount_required,
      reason,
      status: 'Pending'
    });

    const createdLoan = await loan.save();
    res.status(201).json(createdLoan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get member's loans
// @route   GET /api/loans/myloans
// @access  Private/Member
const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ member_id: req.user._id })
      .populate('bachatgat_id', 'name president_name')
      .sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Bachatgat's received loan applications
// @route   GET /api/loans/bachatgat
// @access  Private/Bachatgat
const getBachatgatLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ bachatgat_id: req.user._id })
      .populate('member_id', 'name username')
      .sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or Reject loan
// @route   PUT /api/loans/:id/status
// @access  Private/Bachatgat
const updateLoanStatus = async (req, res) => {
  try {
    const { status, approved_amount, decline_reason } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.bachatgat_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this loan' });
    }

    loan.status = status;
    if (status === 'Approved') loan.approved_amount = approved_amount || loan.loan_amount_required;
    if (status === 'Rejected') loan.decline_reason = decline_reason;

    const updatedLoan = await loan.save();
    res.json(updatedLoan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pay loan installment
// @route   POST /api/loans/:id/pay
// @access  Private/Member
const payLoanInstallment = async (req, res) => {
  try {
    const { amount_paid, interest } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.member_id.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not authorized for this loan' });
    }

    loan.repayment_history.push({ amount_paid, interest });
    loan.total_paid += Number(amount_paid);

    if (loan.total_paid >= loan.approved_amount) {
        loan.status = 'Closed';
    }

    const updatedLoan = await loan.save();
    res.json(updatedLoan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForLoan,
  getMyLoans,
  getBachatgatLoans,
  updateLoanStatus,
  payLoanInstallment
};
