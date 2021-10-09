const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const usersSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
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
  kitIdentifier: {
    type: String,
  },
  age: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  gender: {
    type: String,
  },
  country: {
    type: String,
    maxlength: 50,
  },
  city: {
    type: String,
    maxlength: 50,
  },
  streetNumber: {
    type: String,
    maxlength: 1000,
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

const User = mongoose.model('users', usersSchema);
function validateUser(user) {
  const schema = Joi.object().keys({
    name: Joi.string().max(50).required(),
    email: Joi.string().max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),
    lastName: Joi.string().max(50),
    phoneNumber: Joi.string(),
    age: Joi.number().min(5).max(255),
    profileImage: Joi.string(),
    gender: Joi.string(),
    country: Joi.string().max(50),
    city: Joi.string().max(50),
    streetNumber: Joi.number().max(1000),
  });
  return schema.validate(user);
}
exports.validateUser = validateUser;
exports.User = User;
