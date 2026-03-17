const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  bachatgat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  },
  manufacture_date: {
    type: Date
  },
  expiry_date: {
    type: Date
  },
  ingredients: {
    type: String
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
