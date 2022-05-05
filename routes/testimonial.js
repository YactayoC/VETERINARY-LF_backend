const { Router } = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middleware/fieldValidator');
const { jwtValidate } = require('../middleware/jwtValidate');
const {
  getTestimonial,
  getTestimonialClient,
  getTestimonialAll,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonial');

const router = Router();

router.get('/getTestimonialsAll', getTestimonialAll);

router.use(jwtValidate);

router.get('/getTestimonials', getTestimonial);

router.get('/getTestimonialClient', getTestimonialClient);

router.post(
  '/addTestimonial',
  [check('testimonial', 'The testimonial is required').not().isEmpty(), fieldValidator],
  addTestimonial,
);

router.put(
  '/updateTestimonial/:id',
  [check('testimonial', 'The testimonial is required').not().isEmpty(), fieldValidator],
  updateTestimonial,
);

router.delete('/deleteTestimonial/:id', deleteTestimonial);

module.exports = router;
