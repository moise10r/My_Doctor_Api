const express = require('express');
const router = express.Router();
const { User, validateUser, validateUserEdit } = require('../models/user');
const bcrypt = require('bcrypt');
const { Conversation } = require('../models/conversation');
const { Message } = require('../models/message');
const { Appointment } = require('../models/appointment');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const moment = require('moment');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');

Fawn.init(mongoose);
//, [auth.verifyToken, admin]
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  const validation = validateUser(req.body);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
    return;
  }
  let user = await User.findOne({ email });

  if (user) return res.status(400).send('User already registered.');
  user = new User({
    name,
    email,
    password,
    lastName: '',
    phoneNumber: '',
    age: '',
    profileImage: '',
    gender: '',
    country: '',
    city: '',
    streetNumber: '',
    isAdmin: false,
    isSuperAdmin: false,
    createdAt: moment(Date.now()).format('LL'),
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return res.send('password is incorrect');
      user.password = hash;
      try {
        new Fawn.Task().save('users', user).run();
        const payload = {
          _id: user._id,
          name: user.name,
          email: user.email,
          lastName: '',
          phoneNumber: '',
          age: '',
          profileImage: '',
          gender: '',
          country: '',
          city: '',
          streetNumber: '',
          status: user.status,
          kitIdentifier: '',
        };
        const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
        console.log(token);
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
              'status',
              'kitIdentifier',
              'city',
              'streetNumber',
            ]),
          );
      } catch (error) {
        res.send('something went wrong ');
      }
    });
  });
});

router.delete('/:id', [auth.verifyToken, admin], async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  if (!user)
    return res.status(404).send('The use with the given ID was not found.');
  // remove all the conversations where the user is among the participants
  await Appointment.deleteMany({
    patient: {
      $in: [user._id],
    },
  });
  // delete all the conversations where the doctor is among participants
  await Conversation.deleteMany({
    participants: {
      $elemMatch: {
        _id: user._id,
      },
    },
  });

  // delete all the messages sent by the doctor
  await Message.deleteMany({
    sender: {
      $elemMatch: {
        _id: user._id,
      },
    },
  });

  res.send(user);
});

router.get('/', async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(404).send('There is no user ');
  res.send(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  if (!user)
    return res.status(404).send('The User with this ID was not found. ');
  res.status(200).send(user);
});

router.put('/:id', [auth.verifyToken], async (req, res) => {
  const {
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
    kitIdentifier,
    city,
    streetNumber,
  } = req.body;
  const validation = validateUserEdit(req.body);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    password = password = hash;
  }
  let user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).send('The User with this ID was not found. ');

  user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name,
        lastName,
        email,
        password: password ? password : user.password,
        phoneNumber,
        age,
        gender,
        profileImage,
        status,
        kitIdentifier,
        streetNumber,
        city,
        country,
      },
    },
    { new: true },
  );
  if (!user)
    return res.status(404).send('The User with this ID was not found. ');

  const token = jwt.sign(
    _.pick(user, [
      '_id',
      'name',
      'email',
      'lastName',
      'phoneNumber',
      'age',
      'profileImage',
      'gender',
      'country',
      'city',
      'streetNumber',
      'status',
      'kitIdentifier',
    ]),
    process.env.SECRET_TOKEN_KEY,
  );

  res
    .header('x-auth-token', token)
    .send(
      _.pick(user, [
        '_id',
        'name',
        'email',
        'lastName',
        'phoneNumber',
        'age',
        'profileImage',
        'gender',
        'country',
        'city',
        'streetNumber',
        'status',
        'kitIdentifier',
      ]),
    );
});

//make user Admin
router.put('/:id/admin', [auth.verifyToken, admin], superAdmin.isSuperAdmin);

module.exports = router;
