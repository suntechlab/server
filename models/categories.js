var mongoose = require('mongoose');

const Categories = mongoose.model('categories', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  parentId: {
    type: String
  },
  path: {
    type: String,
    required: true
  },
  image: [{
    type: String
  }]
}));


module.exports = Categories;
