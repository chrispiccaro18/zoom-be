const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  _id: String,
  code: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  expires_at: {
    type: Number,
    required: true,
  },
  expires_in: {
    type: Number,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
  token_type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Token', tokenSchema);
