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
  role: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'banned', 'pending'],
    default: 'pending',
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
    profileImage: Joi.string(),
  });
  return schema.validate(doctor);
}
exports.validateDoctor = validateDoctor;
exports.Doctor = Doctor;
