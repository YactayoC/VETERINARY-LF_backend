const Appointment = require('../models/Appointment');

const getAppointments = async (req, res) => {
  const appointments = await Appointment.find().populate('client', 'fullname').sort({ $natural: -1 }).select('-__v');

  res.status(200).json({
    appointments,
  });
};

const getAppointmentClient = async (req, res) => {
  const uid = req.uid;
  const appointments = await Appointment.find({ client: uid }).select('-__v');

  res.status(200).json({
    appointments,
  });
};

const addAppointment = async (req, res) => {
  const appointment = new Appointment(req.body);

  try {
    appointment.client = req.uid;
    const appointmentSave = await appointment.save();
    res.status(201).json({
      appointment: appointmentSave,
      msg: 'Appointment saved successfully',
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in addAppointment',
    });
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const uid = req.uid;

  try {
    const appointment = await Appointment.findById(id).select('-__v');
    if (!appointment) {
      return res.status(404).json({
        msg: 'Appointment not found',
      });
    }

    const newAppointment = {
      ...req.body,
      client: uid,
    };

    const appointmentUpdated = await Appointment.findByIdAndUpdate(id, newAppointment, { new: true });
    res.status(202).json({
      appointment: appointmentUpdated,
      msg: 'Appointment updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in updateAppointment',
    });
  }
};

const updateAppointmentState = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        msg: 'Appointment not found',
      });
    }

    const newAppointment = {
      ...req.body,
    };

    const appointmentUpdated = await Appointment.findByIdAndUpdate(id, newAppointment, { new: true })
      .populate('client', 'fullname')
      .select('-__v');

    res.status(202).json({
      appointment: appointmentUpdated,
      msg: 'Appointment updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in updateAppointment',
    });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        msg: 'Appointment not found',
      });
    }

    await Appointment.findByIdAndDelete(id);
    res.status(202).json({
      msg: 'Appointment deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Error in deleteAppointment',
    });
  }
};

module.exports = {
  getAppointments,
  getAppointmentClient,
  addAppointment,
  updateAppointment,
  updateAppointmentState,
  deleteAppointment,
};
