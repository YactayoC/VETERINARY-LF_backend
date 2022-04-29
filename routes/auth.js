const { Router } = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middleware/fieldValidator');
const { register, confirmToken, login, revalidateToken, getProfile, updateProfile } = require('../controllers/auth');
const { jwtValidate } = require('../middleware/jwtValidate');

const router = Router();

router.post(
  '/register',
  [
    check('fullname', 'The name is required').not().isEmpty(),
    check('phone', 'The phone is required').not().isEmpty().isNumeric(),
    check('address', 'The address is required').not().isEmpty(),
    check('email', 'The email is not valid').isEmail(),
    check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
    fieldValidator,
  ],
  register,
);

router.get('/confirm/:token', confirmToken);

router.post(
  '/login',
  [
    check('email', 'The email is not valid').isEmail(),
    check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
    fieldValidator,
  ],
  login,
);

router.use(jwtValidate);
router.get('/revalidate', revalidateToken);
router.get('/profile', getProfile);
router.put(
  '/profile',
  [
    check('fullname', 'The name is required').not().isEmpty(),
    check('phone', 'The phone is required').not().isEmpty().isNumeric(),
    check('address', 'The address is required').not().isEmpty(),
    fieldValidator,
  ],
  updateProfile,
);

module.exports = router;
