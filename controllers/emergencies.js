const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { Emergency, validateEmergency } = require('../models/emergency');

router.post('/', [verifyToken], async (req, res) => {
  let user = req.user;
  if (user.status === 'Pending' || user.status === 'Inactive') {
    res
      .status(400)
      .send(
        'Sorry Your account is not verified, or you have financial issues.',
      );
  }

  const { error } = validateEmergency(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const { altitude, latitude, longitude } = req.body.location;
  let emergency = new Emergency({
    patient: {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    },
    location: {
      altitude,
      latitude,
      longitude,
    },
  });

  emergency = await emergency.save();

  if (!emergency) {
    res
      .status(400)
      .send('An error occured while sending the Emergency, Please try again.');
  }

  socket.emit('new-emergency', emergency);
  res.send(emergency);
});

router.get('/', [verifyToken], async (req, res) => {
  const emergencies = await Emergency.find().sort({ createdAt: 1 });
  res.send(emergencies);
});

module.exports = router;
