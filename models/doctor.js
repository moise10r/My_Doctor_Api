const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const doctorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  about: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Active', 'Banned', 'Pending'],
    default: 'Pending',
  },
  age: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  phoneNumber: {
    type: String,
  },

  profileImage: {
    type: String,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

const Doctor = mongoose.model('doctors', doctorsSchema);
function validateDoctor(doctor) {
  const schema = Joi.object().keys({
    name: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50),
    email: Joi.string().min(2).max(50).required().email(),
    role: Joi.string().min(5).max(255),
    password: Joi.string().min(5).max(255).required(),
    phoneNumber: Joi.string(),
    lastName: Joi.string().max(50),
    phoneNumber: Joi.string(),
    age: Joi.string().max(255),
    about: Joi.string().max(255),
    profileImage: Joi.string(),
    status: Joi.string(),
    kitIdentifier: Joi.string(),
    gender: Joi.string(),
    country: Joi.string().max(50),
    city: Joi.string().max(50),
    profileImage: Joi.string(),
  });
  return schema.validate(doctor);
}

function validateDoctorEdit(doctor) {
  const schema = Joi.object().keys({
    name: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50),
    email: Joi.string().min(2).max(50).required().email(),
    role: Joi.string().min(5).max(255),
    password: Joi.string().optional().allow('').min(5).max(255),
    phoneNumber: Joi.string(),
    lastName: Joi.string().max(50),
    phoneNumber: Joi.string(),
    age: Joi.string().max(255),
    about: Joi.string().max(255),
    profileImage: Joi.string(),
    status: Joi.string(),
    kitIdentifier: Joi.string(),
    gender: Joi.string(),
    country: Joi.string().max(50),
    city: Joi.string().max(50),
    profileImage: Joi.string(),
  });
  return schema.validate(doctor);
}
exports.validateDoctor = validateDoctor;
exports.validateDoctorEdit = validateDoctorEdit;
exports.Doctor = Doctor;
