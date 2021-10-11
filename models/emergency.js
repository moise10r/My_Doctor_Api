const Joi = require('joi');
const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  patient: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
      },
      profileImage: {
        type: String,
      },
      status: {
        type: String,
        required: true,
      },
    }),
  },
  location: {
    type: new mongoose.Schema({
      altitude: {
        type: Number,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    }),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Emergency = mongoose.model('Emergency', emergencySchema);
function validateEmergency(emergency) {
  const schema = Joi.object().keys({
    location: Joi.object().keys({
      altitude: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }),
  });
  return schema.validate(emergency);
}

module.exports = {
  Emergency,
  validateEmergency,
};
