const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, getMyProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('Bachatgat', 'Member'), createProduct);

router.route('/myproducts')
  .get(protect, authorize('Bachatgat', 'Member'), getMyProducts);

router.route('/:id')
  .get(getProductById);

module.exports = router;
