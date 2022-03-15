var mongoose = require('mongoose');

const User = mongoose.model('users', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
    secret: {
    type: String,
    required: true
},
active: {
  type: String,
  required: true
}
}));

module.exports = User;
