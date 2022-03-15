var mongoose = require('mongoose');

const Products = mongoose.model('products', new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  procategory: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
  },
  path: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  image: [{
    type: String,
    required: true
  }],
  time: {
    type: Date,
    required: true
}
}));

module.exports = Products;
