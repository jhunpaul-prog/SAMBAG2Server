const mongoose = require('mongoose');

// Define the report schema
const report = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create the model from the schema
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
