const auth = require('../controllers/auth');
const users = require('../controllers/users');
const doctors = require('../controllers/doctor');
const appointment = require('../controllers/appointment');
const conversations = require('../controllers/conversations');
const messages = require('../controllers/messages');

module.exports = function (app) {
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/doctors', doctors);
  app.use('/api/appointments', appointment);
  app.use('/api/conversations', conversations);
  app.use('/api/messages', messages);
};
