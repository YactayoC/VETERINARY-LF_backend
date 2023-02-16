const { Schema, model } = require('mongoose');

const EmployeeSchema = Schema({
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

  confirmed: {
    type: Boolean,
    default: true,
  },

  role: {
    type: String,
    default: 'employee',
  },
});

module.exports = model('Employee', EmployeeSchema);
