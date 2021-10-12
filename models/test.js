const mongoose = require('mongoose');
const Joi = require('joi');

const testSchema = new mongoose.Schema({
  patient: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
    }),
    required: true,
  },
  bloodPressure: {
    type: String,
    required: true,
  },
  heartRate: {
    type: String,
    required: true,
  },
  temperature: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Test = mongoose.model('Test', testSchema);

const validateTest = (test) => {
  const schema = Joi.object().keys({
    heartRate: Joi.string().required(),
    bloodPressure: Joi.string().required(),
    temperature: Joi.string().required(),
    kitIdentifier: Joi.string().required(),
  });

  return schema.validate(test);
};

module.exports = {
  Test,
  validateTest,
};
