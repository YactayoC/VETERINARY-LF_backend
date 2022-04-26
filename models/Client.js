const { Schema, model } = require('mongoose');
const { generateToken } = require('../helpers/generateToken');

const ClientSchema = Schema({
  fullname: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    default: null,
    required: true,
  },

  token: {
    type: String,
    default: generateToken(),
  },

  confirmed: {
    type: Boolean,
    default: false,
  },
});

module.exports = model('Client', ClientSchema);
