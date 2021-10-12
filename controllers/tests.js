const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { User } = require('../models/user');
const { Test, validateTest } = require('../models/test');

router.post('/', async (req, res) => {
  const { heartRate, bloodPressure, temperature, kitIdentifier } = req.body;
  const { error } = validateTest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const patient = await User.findOne({ kitIdentifier });
  if (!patient) return res.status(400).send('No user with that kitIdentifier');

  const checkDnagerousHeartRateRanges = (heartRate) => {
    const dangerousHeartRateRanges = [
      { min: 60, max: 100 },
      { min: 100, max: 140 },
      { min: 140, max: 180 },
      { min: 180, max: 220 },
    ];
    for (let i = 0; i < dangerousHeartRateRanges.length; i++) {
      if (
        +heartRate.split('/')[0] >= dangerousHeartRateRanges[i].min &&
        +heartRate.split('/')[0] <= dangerousHeartRateRanges[i].max
      ) {
        return true;
      }
    }
    return false;
  };

  const checkDangerousBloodPressureRanges = (bloodPressure) => {
    const dangerousBloodPressureRanges = [
      { min: 90, max: 120 },
      { min: 120, max: 140 },
      { min: 140, max: 160 },
      { min: 160, max: 180 },
    ];
    for (let i = 0; i < dangerousBloodPressureRanges.length; i++) {
      if (
        +bloodPressure.split(' ')[0] >= dangerousBloodPressureRanges[i].min &&
        +bloodPressure.split(' ')[0] <= dangerousBloodPressureRanges[i].max
      ) {
        return true;
      }
    }
    return false;
  };

  const checkDangerousTemperatureRanges = (temperature) => {
    const dangerousTemperatureRanges = [
      { min: 36.5, max: 37.5 },
      { min: 37.5, max: 38.5 },
      { min: 38.5, max: 39.5 },
      { min: 39.5, max: 40.5 },
    ];
    for (let i = 0; i < dangerousTemperatureRanges.length; i++) {
      if (
        +temperature.split(' ')[0] >= dangerousTemperatureRanges[i].min &&
        +temperature.split(' ')[0] <= dangerousTemperatureRanges[i].max
      ) {
        return true;
      }
    }
    return false;
  };

  let test = new Test({
    patient: {
      _id: patient._id,
      name: patient.name,
    },
    heartRate: checkDnagerousHeartRateRanges(heartRate)
      ? `${heartRate} ⚠️`
      : heartRate,
    bloodPressure: checkDangerousBloodPressureRanges(bloodPressure)
      ? `${bloodPressure} ⚠️`
      : bloodPressure,
    temperature: checkDangerousTemperatureRanges(temperature)
      ? `${temperature} ⚠️`
      : temperature,
  });

  test = await test.save();
  if (!test) return res.status(400).send('Test could not be saved');
  socket.emit('new-test', test);
  res.send(test);
});

router.get('/', [verifyToken], async (req, res) => {
  const user = req.user;
  const tests = await Test.find({
    'patient._id': user._id,
  }).sort({ createdAt: -1 });
  res.send(tests);
});

router.get('/patient/:id', [verifyToken], async (req, res) => {
  const patient = await User.findById(req.params.id);
  if (!patient)
    return res.status(404).send('The patient with the given ID was not found.');
  const tests = await Test.find({
    'patient._id': patient._id,
  }).sort({ createdAt: -1 });

  res.send(tests);
});

router.delete('/:id', [verifyToken], async (req, res) => {
  const test = await Test.findByIdAndRemove(req.params.id);
  if (!test)
    return res.status(404).send('The test with the given ID was not found.');
  res.send(test);
});

module.exports = router;
