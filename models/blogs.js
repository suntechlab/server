var mongoose = require('mongoose');

const Blogs = mongoose.model('blogs', new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  demoLink: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  aInfo: {
    type: String
  },
  image: [{
    type: String,
    required: true
  }],
  time: {
    type: String
}
}));

module.exports = Blogs;
