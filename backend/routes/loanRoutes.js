const express = require('express');
const router = express.Router();
const { 
  applyForLoan, 
  getMyLoans, 
  getBachatgatLoans, 
  updateLoanStatus, 
  payLoanInstallment 
} = require('../controllers/loanController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('Member'), applyForLoan);

router.route('/myloans')
  .get(protect, authorize('Member'), getMyLoans);

router.route('/bachatgat')
  .get(protect, authorize('Bachatgat'), getBachatgatLoans);

router.route('/:id/status')
  .put(protect, authorize('Bachatgat'), updateLoanStatus);

router.route('/:id/pay')
  .post(protect, authorize('Member'), payLoanInstallment);

module.exports = router;
