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

  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
});

module.exports = model('Testimonial', TestimonialSchema);
