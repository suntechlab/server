var mongoose = require('mongoose');

const Comment = mongoose.model('comments', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  blogId: {
    type: String,
    required: true
  },
  commentId: {
    type: String
  },
  slug: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
    message: {
    type: String,
    required: true
}
}));

module.exports = Comment;
