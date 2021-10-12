const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Doctor } = require('../models/doctor');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
  const { email, password } = req.body;
  const schema = Joi.object().keys({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    res
      .header('x-auth-token')
      .status(400)
      .send(validation.error.details[0].message);
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        Doctor.findOne({ email })
          .then((doctor) => {
            if (!doctor)
              return res.status(404).send('email or password is incorrect');
            bcrypt.compare(password, doctor.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                const payload = {
                  _id: doctor._id,
                  name: doctor.name,
                  email: doctor.email,
                  lastName: doctor.lastName,
                  phoneNumber: doctor.phoneNumber,
                  role: doctor.role,
                  profileImage: doctor.profileImage,
                  isAdmin: doctor.isAdmin,
                  isSuperAdmin: doctor.isSuperAdmin,
                  status: doctor.status,
                  isDoctor: doctor.isDoctor,
                };
                const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
                return res.send(token);
              } else {
                return res
                  .header('x-auth-token')
                  .status(401)
                  .send('email or password is incorrect ');
              }
            });
          })
          .catch((err) => {
            res.header('x-auth-token').status(404).send('Something went wrong');
          });
      } else {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err)
            return res.header('x-auth-token').send('password is incorrect');
          if (isMatch) {
            const payload = {
              _id: user._id,
              name: user.name,
              email: user.email,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
              age: user.age,
              profileImage: user.profileImage,
              gender: user.gender,
              country: user.country,
              city: user.city,
              status: user.status,
              streetNumber: user.streetNumber,
              isAdmin: user.isAdmin,
              isSuperAdmin: user.isSuperAdmin,
              kitIdentifier: user.kitIdentifier,
            };
            const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
            return res.send(token);
          } else {
            return res
              .header('x-auth-token')
              .status(401)
              .send('email or password is incorrect ');
          }
        });
      }
    })
    .catch((err) =>
      res.header('x-auth-token').send('something went wrong').status(404),
    );
});

module.exports = router;
