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

  let test = new Test({
    patient: {
      _id: patient._id,
      name: patient.name,
    },
    heartRate,
    bloodPressure,
    temperature,
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
    'patient._id': user._id,
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
