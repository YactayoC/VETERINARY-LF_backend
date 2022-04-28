const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { fieldValidator } = require('../middleware/fieldValidator');
const { jwtValidate } = require('../middleware/jwtValidate');
const {
  getAppointments,
  getAppointmentClient,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointment');

const router = Router();
router.use(jwtValidate);

router.get('/getAppointments', getAppointments);
router.get('/getAppointmentClient', getAppointmentClient);
router.post(
  '/addAppointment',
  [
    check('mascot', 'The name mascot is required').not().isEmpty(),
    check('symptom', 'The symptom is required').not().isEmpty(),
    check('date', 'The date is not valid').custom(isDate),
    fieldValidator,
  ],
  addAppointment,
);
router.put(
  '/updateAppointment/:id',
  [
    check('mascot', 'The name mascot is required').not().isEmpty(),
    check('symptom', 'The symptom is required').not().isEmpty(),
    check('date', 'The symptom is required').custom(isDate),
    fieldValidator,
  ],
  updateAppointment,
);
router.delete('/deleteAppointment/:id', deleteAppointment);

module.exports = router;
