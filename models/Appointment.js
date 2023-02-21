const { Schema, model } = require('mongoose');

const AppointmentSchema = new Schema({
  mascot: {
    type: String,
    required: true,
  },

  symptom: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    require: true,
  },

  state: {
    type: String,
    default: 'Pending',
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = model('Appointment', AppointmentSchema);
