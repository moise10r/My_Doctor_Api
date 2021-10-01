const express =  require('express');
const router = express.Router();
const { Doctor } = require('../models/doctor');
const { User } =  require('../models/user');
const moment =  require('moment');
moment.locale("fr");
const Fawn =  require('fawn');
const { Appointment, validateAppointement } = require('../models/appointment');
const { verifyToken } = require('../middlewares/auth');

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
  let appointement = await Appointment.find();
  if(!appointement) return res.send('No appointement taken!');
  return res.status(200).send(appointement);
});

router.get('/:doctorId/all', async(req, res) => {
  let appointement = await Appointment.find({ "doctor._id": req.params.doctorId });
  if(!appointement) return res.send('No appointement taken!');
  res.status(200).send(appointement);
});

module.exports = router;