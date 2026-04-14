const Product = require('../models/Product');

// @desc    Fetch all products (For Customer & General)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('bachatgat_id', 'name president_name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('bachatgat_id', 'name president_name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Bachatgat, Member
const createProduct = async (req, res) => {
  try {
    console.log('=== Product Creation Request ===');
    console.log('User:', JSON.stringify(req.user, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const { name, description, price, quantity, unit, category, image_url, manufacture_date, expiry_date, ingredients } = req.body;
    
    // bachatgat_id should be logged in user's ID (or their bachatgat if they're a member)
    let bachatgat_id = req.user.role === 'Member' ? req.user.bachatgat_id : req.user._id;
    
    // If member doesn't have bachatgat_id, use a default one for testing
    if (!bachatgat_id && req.user.role === 'Member') {
      console.log('WARNING: Member has no bachatgat_id, using user._id as fallback');
      bachatgat_id = req.user._id;
    }
    
    console.log('Bachatgat ID:', bachatgat_id);
    
    // Validate bachatgat_id exists
    if (!bachatgat_id) {
      console.log('ERROR: No bachatgat_id found');
      return res.status(400).json({ message: 'Bachatgat ID is required. Please contact admin to set your Bachatgat group.' });
    }
    
    // Validate required fields
    if (!name || !price || !category || !quantity) {
      console.log('ERROR: Missing required fields');
      return res.status(400).json({ 
        message: 'Name, price, category, and quantity are required fields.',
        received: { name, price, category, quantity }
      });
    }
    
    const productData = {
      bachatgat_id: bachatgat_id,
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      unit: unit || 'piece',
      category,
      image_url,
      manufacture_date,
      expiry_date,
      ingredients
    };
    
    console.log('Creating product with data:', JSON.stringify(productData, null, 2));
    
    const product = new Product(productData);
    const createdProduct = await product.save();
    
    console.log('Product created successfully:', createdProduct._id);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Product creation error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my products (for Bachatgat or Member)
// @route   GET /api/products/myproducts
// @access  Private/Bachatgat, Member
const getMyProducts = async (req, res) => {
  try {
    // Mirror the same fallback used in createProduct:
    // if member has no bachatgat_id, products were saved with their own _id
    let bachatgat_id;
    if (req.user.role === 'Member') {
      bachatgat_id = req.user.bachatgat_id || req.user._id;
    } else {
      bachatgat_id = req.user._id;
    }
    const products = await Product.find({ bachatgat_id }).populate('bachatgat_id', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts
};
