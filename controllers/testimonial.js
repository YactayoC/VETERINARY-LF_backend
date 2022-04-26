const Testimonial = require('../models/Testimonial');

const getTestimonial = async (req, res) => {
  const testimonials = await Testimonial.find().populate('client', 'fullname');

  res.json({
    ok: true,
    testimonials,
  });
};

const getTestimonialClient = async (req, res) => {
  const uid = req.uid;

  try {
    const testimonial = await Testimonial.find({ client: uid });
    res.json({
      ok: true,
      testimonial,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error in getTestimonialClient',
    });
  }
};

const addTestimonial = async (req, res) => {
  const testimonial = new Testimonial(req.body);

  try {
    testimonial.client = req.uid;
    const testimonialSave = await testimonial.save();
    res.json({
      ok: true,
      testimonial: testimonialSave,
      msg: 'Testimonial saved successfully',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
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
        ok: false,
        msg: 'Testimonial not found',
      });
    }

    const newTestimonial = {
      ...req.body,
      client: uid,
    };

    const testimonialUpdated = await Testimonial.findByIdAndUpdate(id, newTestimonial, { new: true });
    res.json({
      ok: true,
      testimonial: testimonialUpdated,
      msg: 'Testimonial updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
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
        ok: false,
        msg: 'Testimonial not found',
      });
    }

    await Testimonial.findByIdAndDelete(id);
    res.json({
      ok: true,
      msg: 'Testimonial deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error in deleteTestimonial',
    });
  }
};

module.exports = { getTestimonial, getTestimonialClient, addTestimonial, updateTestimonial, deleteTestimonial };
