var mongoose = require('mongoose');

const Projects = mongoose.model('projects', new mongoose.Schema({
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
  image: [{
    type: String,
    required: true
  }],
  time: {
    type: Date,
    required: true
}
}));

module.exports = Projects;
