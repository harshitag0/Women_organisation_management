const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
const addOrderItems = async (req, res) => {
  try {
    const { items, shipping_address, city, total_amount } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        customer_id: req.user._id,
        items,
        shipping_address,
        city,
        total_amount,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private/Customer
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.user._id }).populate('items.product_id', 'name price image_url');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('customer_id', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Bachatgat
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders received for the logged-in member's products
// @route   GET /api/orders/seller-orders
// @access  Private/Member
const getSellerOrders = async (req, res) => {
  try {
    // Find all products belonging to this member
    const bachatgat_id = req.user.role === 'Member' ? req.user.bachatgat_id : req.user._id;
    const myProductIds = await Product.find({ bachatgat_id }).distinct('_id');

    // Find orders that contain at least one of those products
    const orders = await Order.find({
      'items.product_id': { $in: myProductIds }
    })
      .populate('customer_id', 'name email contact_no')
      .populate('items.product_id', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getSellerOrders
};
