const express =  require('express');
const router = express.Router();
const { Doctor } = require('../models/doctor');
const { User } =  require('../models/user');
const moment =  require('moment');
moment.locale("fr");
const Fawn =  require('fawn');
const { Appointment, validateAppointement } = require('../models/appointment');
const { verifyToken } = require('../middlewares/auth');


// router.get('/patient', async(req, res) => {
//   const user = await User.findOne({ _id: req.user._id});
//   if(!user) return res.send('The user with that credential does not exist!');
//   const appointement = await Appointment.find({ "patient._id": req.user._id});
//   if(!appointement) return res.send('No appointement taken');
//   return res.status(200).send(appointements);
// });

// router.get('/doctor', async(req, res) => {
//   const doctor = await Doctor.findOne({ _id: req.user._id});
//   if(!doctor) return res.send('The doctor with that credential does not exist!');
//   const appointement = await Appointment.find({ "doctor._id": req.user._id});
//   if(!appointement) return res.send('No appointement taken');
//   return res.status(200).send(appointements);
// });

router.get('/', [verifyToken], async(req, res) => {
  const doctor = await Doctor.findOne({ _id: req.user._id});
  const user = await User.findOne({ _id: req.user._id});
  let appointements;
  if(doctor) {
    appointements = await Appointment.find({ "doctor._id": req.user._id});
    res.status(200).send(appointements);
  } 
  if(user) {
    appointements = await Appointment.find({ "patient._id": req.user._id});
    res.status(200).send(appointements);
  }
  res.status(400).send('This credential does not exist!');
});

router.post('/:doctorId', [verifyToken], async(req, res) => {
  const { date, time } = req.body;
  const validate = validateAppointement(req.body);
  if(validate.error) {
    return res.status(404).send(validate.error.details[0].message);
  }
  const user = await User.findById({ _id: req.user._id });
  if(!user) return res.status(404).send('The user with this credential does not exist');
  const doctor = await Doctor.findById({ _id: req.params.doctorId });
  if(!doctor) return res.status(404).send('The doctor with this Id does not exist');
  console.log("doctorId", doctor._id);
  console.log(date);
  let appointment = await Appointment.findOne({
    $and: [
      { date },
      { time },
      {"doctor._id":doctor._id },
    ]});
  console.log("appointment", appointment);
  if(appointment) return res.status(404).send('This appointement has been yet taken ');
  appointment =  new Appointment({
    doctor: {
      _id: doctor._id,
      name: doctor.name,
    },
    patient: {
      _id:  user._id,
      name: user.name,
    },
    date,
    time,
    isTaken: true,
    takenAt: moment(Date.now()).format('LLLL'),
  });
  try {
    appointment.save();
    res.status(200).send(appointment);
  } catch (error) {
    res.status(400).send('Something went wrong', error);
  }
});


router.get('/all', async(req, res) => {
  const appointements = await Appointment.find();
  if(!appointements) return res.send('No appointement taken!');
  return res.status(200).send(appointements);
});

// router.get('/:doctorId/all', async(req, res) => {
//   const appointement = await Appointment.find({ "doctor._id": req.params.doctorId });
//   if(!appointement) return res.send('No appointement taken!');
//   res.status(200).send(appointement);
// });

// router.get('/:patientId/all', async(req, res) => {
//   const appointement = await Appointment.find({ "patient._id": req.params.patientId });
//   if(!appointement) return res.send('No appointement taken!');
//   res.status(200).send(appointement);
// });

module.exports = router;