const Testimonial = require('../models/Testimonial');

const getTestimonial = async (req, res) => {
  const testimonials = await Testimonial.find().populate('user', 'fullname');

  res.status(200).json({
    testimonials,
  });
};

const getTestimonialClient = async (req, res) => {
  const uid = req.uid;
  const testimonial = await Testimonial.find({ user: uid });

  res.status(200).json({
    testimonial,
  });
};

const getTestimonialAll = async (req, res) => {
  const testimonials = await Testimonial.find().populate('user', 'fullname').limit(4).sort({ $natural: -1 });

  res.status(200).json({
    testimonials,
  });
};

const addTestimonial = async (req, res) => {
  const testimonial = new Testimonial(req.body);

  try {
    testimonial.user = req.uid;
    const testimonialSave = await testimonial.save();
    res.status(201).json({
      testimonial: testimonialSave,
      msg: 'Testimonial saved successfully',
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error in addTestimonial',
    });
  }
};

const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const uid = req.uid;

  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        msg: 'Testimonial not found',
      });
    }

    const newTestimonial = {
      ...req.body,
      user: uid,
    };

    const testimonialUpdated = await Testimonial.findByIdAndUpdate(id, newTestimonial, { new: true });
    res.status(202).json({
      testimonial: testimonialUpdated,
      msg: 'Testimonial updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in updateTestimonial',
    });
  }
};

const deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        msg: 'Testimonial not found',
      });
    }

    await Testimonial.findByIdAndDelete(id);
    res.status(202).json({
      msg: 'Testimonial deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in deleteTestimonial',
    });
  }
};

module.exports = {
  getTestimonial,
  getTestimonialClient,
  getTestimonialAll,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
