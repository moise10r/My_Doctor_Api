const express = require('express');
const router = express.Router();
const {
  Doctor,
  validateDoctor,
  validateDoctorEdit,
} = require('../models/doctor');
const { Conversation } = require('../models/conversation');
const { User } = require('../models/user');
const { Message } = require('../models/message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const moment = require('moment');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');

// auth.verifyToken,
// admin,
router.post('/', [auth.verifyToken, admin], async (req, res) => {
  let {
    name,
    lastName,
    email,
    password,
    phoneNumber,
    age,
    profileImage,
    gender,
    country,
    status,
    city,
    about,
  } = req.body;
  console.log(req.body);
  const validation = validateDoctor(req.body);
  if (validation.error) {
    res
      .header('x-auth-token')
      .status(400)
      .send(validation.error.details[0].message);
    return;
  }
  let doctor = await Doctor.findOne({
    $or: [
      {
        email,
      },
    ],
  });
  if (doctor)
    return res
      .header('x-auth-token')
      .status(400)
      .send('doctor already registered.');
  doctor = new Doctor({
    name,
    email,
    password,
    lastName,
    phoneNumber,
    age,
    profileImage,
    gender,
    country,
    about,
    city,
    status,
    createdAt: moment(Date.now()).format('LL'),
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(doctor.password, salt, (err, hash) => {
      if (err) throw err;
      doctor.password = hash;
      try {
        doctor.save();
        const payload = {
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          isAdmin: doctor.isAdmin,
          isSuperAdmin: doctor.isSuperAdmin,
          lastName: doctor.lastName,
          phoneNumber: doctor.phoneNumber,
          age: doctor.age,
          profileImage: doctor.profileImage,
          gender: doctor.gender,
          country: doctor.country,
          about: doctor.about,
          city: doctor.city,
          status: doctor.status,
          isDoctor: doctor.isDoctor,
        };
        const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
        return res
          .header('x-auth-token', token)
          .status(200)
          .send(
            _.pick(payload, [
              '_id',
              'name',
              'email',
              'lastName',
              'phoneNumber',
              'age',
              'profileImage',
              'gender',
              'country',
              'about',
              'city',
              'streetNumber',
              'status',
              'isDoctor',
            ]),
          );
      } catch (error) {
        res.header('x-auth-token').send('Something went wrong');
      }
    });
  });
});

// auth.verifyToken,
router.put('/:id', [auth.verifyToken, admin], async (req, res) => {
  const {
    name,
    lastName,
    email,
    phoneNumber,
    age,
    profileImage,
    gender,
    country,
    status,
    city,
    about,
  } = req.body;
  const validation = validateDoctorEdit(req.body);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  let password = req.body.password;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    password = password = hash;
  }
  let doctor = await Doctor.findById(req.params.id);
  if (!doctor)
    return res.status(404).send('The Doctor with this ID was not found. ');

  doctor = await Doctor.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name,
        lastName,
        email,
        password: password ? password : doctor.password,
        phoneNumber,
        age,
        gender,
        about,
        profileImage,
        status,
        city,
        country,
      },
    },
    { new: true },
  );
  if (!doctor)
    return res.status(404).send('The Doctor with this ID was not found. ');

  const token = jwt.sign(
    _.pick(doctor, [
      '_id',
      'name',
      'email',
      'lastName',
      'phoneNumber',
      'age',
      'profileImage',
      'gender',
      'country',
      'about',
      'city',
      'status',
    ]),
    process.env.SECRET_TOKEN_KEY,
  );

  res
    .header('x-auth-token', token)
    .send(
      _.pick(doctor, [
        '_id',
        'name',
        'email',
        'lastName',
        'phoneNumber',
        'age',
        'profileImage',
        'gender',
        'country',
        'about',
        'city',
        'status',
      ]),
    );
});

router.delete('/:id', [auth.verifyToken, admin], async (req, res) => {
  const doctor = await Doctor.findOneAndDelete({ _id: req.params.id });
  if (!doctor)
    return res
      .header('x-auth-token')
      .status(404)
      .send('The use with the given ID was not found.');
  // delete all the appointments where the doctor._id == doctor._id
  await Appointment.deleteMany({
    doctor: {
      $in: [doctor._id],
    },
  });
  // delete all the conversations where the doctor is among participants
  await Conversation.deleteMany({
    participants: {
      $elemMatch: {
        _id: doctor._id,
      },
    },
  });

  // delete all the messages sent by the doctor
  await Message.deleteMany({
    sender: {
      $elemMatch: {
        _id: doctor._id,
      },
    },
  });

  res.header('x-auth-token').send(doctor);
});

router.get('/', [auth.verifyToken], async (req, res) => {
  const doctors = await Doctor.find();
  if (!doctors)
    return res.header('x-auth-token').status(404).send('There is no doctor ');
  res.header('x-auth-token').send(doctors);
});

router.get('/:id', async (req, res) => {
  const doctor = await Doctor.findById({ _id: req.params.id });
  if (!doctor)
    return res
      .header('x-auth-token')
      .status(404)
      .send('The doctor with this ID was not found. ');
  res.header('x-auth-token').status(200).send(doctor);
});

router.put('/:id/admin', [auth.verifyToken, admin], superAdmin.isSuperAdmin);

module.exports = router;
