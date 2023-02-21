const { Schema, model } = require('mongoose');

const TestimonialSchema = Schema({
  testimonial: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    require: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = model('Testimonial', TestimonialSchema);
