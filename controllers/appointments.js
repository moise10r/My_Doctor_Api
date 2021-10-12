const express = require('express');
const router = express.Router();
const { Doctor } = require('../models/doctor');
const { User } = require('../models/user');
const moment = require('moment');
moment.locale('fr');
const { Appointment, validateAppointement } = require('../models/appointment');
const { verifyToken } = require('../middlewares/auth');

router.get('/', [verifyToken], async (req, res) => {
  const doctor = await Doctor.findOne({ _id: req.user._id });
  const user = await User.findOne({ _id: req.user._id });
  let appointements;
  if (doctor) {
    appointements = await Appointment.find({ 'doctor._id': req.user._id });
    return res.header('x-auth-token').status(200).send(appointements);
  }
  if (user) {
    appointements = await Appointment.find({ 'patient._id': req.user._id });
    return res.header('x-auth-token').status(200).send(appointements);
  } else {
    return res
      .header('x-auth-token')
      .status(400)
      .send('This credential does not exist!');
  }
});

router.post('/:doctorId', [verifyToken], async (req, res) => {
  const { date, time, description } = req.body;
  const validate = validateAppointement(req.body);
  if (validate.error) {
    return res
      .header('x-auth-token')
      .status(404)
      .send(validate.error.details[0].message);
  }
  const user = await User.findById({ _id: req.user._id });
  if (!user)
    return res
      .header('x-auth-token')
      .status(404)
      .send('The user with this credential does not exist');
  const doctor = await Doctor.findById({ _id: req.params.doctorId });
  if (!doctor)
    return res
      .header('x-auth-token')
      .status(404)
      .send('The doctor with this Id does not exist');

  let appointment = await Appointment.findOne({
    $and: [{ date }, { time }, { 'doctor._id': doctor._id }],
  });
  console.log('appointment', appointment);
  if (appointment)
    return res
      .header('x-auth-token')
      .status(404)
      .send('This appointement has been yet taken ');
  appointment = new Appointment({
    doctor: {
      _id: doctor._id,
      name: doctor.name,
    },
    patient: {
      _id: user._id,
      name: user.name,
    },
    date,
    description,
    time,
    isTaken: true,
    takenAt: moment(Date.now()).format('LLLL'),
  });
  try {
    appointment.save();
    res.header('x-auth-token').status(200).send(appointment);
  } catch (error) {
    res.header('x-auth-token').status(400).send('Something went wrong', error);
  }
});

router.get('/all', async (req, res) => {
  const appointements = await Appointment.find();
  if (!appointements)
    return res.header('x-auth-token').send('No appointement taken!');
  return res.header('x-auth-token').status(200).send(appointements);
});

router.get('/doctors/:doctorId', async (req, res) => {
  const appointement = await Appointment.find({
    'doctor._id': req.params.doctorId,
  });
  if (!appointement)
    return res.header('x-auth-token').send('No appointement taken!');
  res.header('x-auth-token').status(200).send(appointement);
});

router.get('/', [verifyToken], async (req, res) => {
  const user = req.user;
  const appointements = await Appointment.find({
    $or: [{ 'doctor._id': user._id }, { 'patient._id': user._id }],
  });
  res.header('x-auth-token').status(200).send(appointements);
});
router.get('/patients/:patientId', async (req, res) => {
  const appointement = await Appointment.find({
    'patient._id': req.params.patientId,
  });
  if (!appointement)
    return res.header('x-auth-token').send('No appointement taken!');
  res.header('x-auth-token').status(200).send(appointement);
});

router.delete('/:appointmentId', [verifyToken], async (req, res) => {
  const appointment = await Appointment.findByIdAndRemove({
    _id: req.params.appointmentId,
  });
  if (!appointment)
    return res.header('x-auth-token').send('No appointement taken!');
  res.header('x-auth-token').status(200).send(appointment);
});

module.exports = router;
