const { Router } = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middleware/fieldValidator');
const { jwtValidate } = require('../middleware/jwtValidate');
const { getEmployees, addEmployee, updateEmployee, deleteEmployee } = require('../controllers/employee');

const router = Router();
router.use(jwtValidate);

router.get('/getEmployees', getEmployees);
router.post(
  '/addEmployee',
  [
    check('fullname', 'The name is required').not().isEmpty(),
    check('phone', 'The phone is required').not().isEmpty().isNumeric(),
    check('address', 'The address is required').not().isEmpty(),
    check('email', 'The email is not valid').isEmail(),
    check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
    fieldValidator,
  ],
  addEmployee,
);
router.put(
  '/updateEmployee/:id',
  [
    check('fullname', 'The name is required').not().isEmpty(),
    check('phone', 'The phone is required').not().isEmpty().isNumeric(),
    check('address', 'The address is required').not().isEmpty(),
    fieldValidator,
  ],
  updateEmployee,
);
router.delete('/deleteEmployee/:id', deleteEmployee);

module.exports = router;
