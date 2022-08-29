const Testimonial = require('../models/Testimonial');

const getTestimonial = async (req, res) => {
  const testimonials = await Testimonial.find().populate('client', 'fullname');

  res.status(200).json({
    ok: true,
    testimonials,
  });
};

const getTestimonialClient = async (req, res) => {
  const uid = req.uid;
  const testimonial = await Testimonial.find({ client: uid });

  res.status(200).json({
    ok: true,
    testimonial,
  });
};

const getTestimonialAll = async (req, res) => {
  const testimonials = await Testimonial.find().populate('client', 'fullname').limit(4).sort({ $natural: -1 });

  res.status(200).json({
    ok: true,
    testimonials,
  });
};

const addTestimonial = async (req, res) => {
  const testimonial = new Testimonial(req.body);

  try {
    testimonial.client = req.uid;
    const testimonialSave = await testimonial.save();
    res.status(201).json({
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
    res.status(202).json({
      ok: true,
      testimonial: testimonialUpdated,
      msg: 'Testimonial updated successfully',
    });
  } catch (error) {
    res.status(400).json({
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
    res.status(202).json({
      ok: true,
      msg: 'Testimonial deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
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
