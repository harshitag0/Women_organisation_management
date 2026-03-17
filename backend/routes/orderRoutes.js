const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('Customer'), addOrderItems)
  .get(protect, authorize('Admin'), getOrders);

router.route('/myorders').get(protect, authorize('Customer', 'Member'), getMyOrders);

router.route('/:id/status').put(protect, authorize('Admin', 'Bachatgat'), updateOrderStatus);

module.exports = router;
