const { Schema, model } = require('mongoose');
const { generateToken } = require('../helpers/generateToken');

const UserSchema = Schema({
  fullname: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
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

  key: {
    type: String,
    default: generateToken(),
  },

  confirmed: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    default: 'client',
  },
});

module.exports = model('User', UserSchema);
