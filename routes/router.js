const auth = require('../controllers/auth');
const users = require('../controllers/users');
const doctors = require('../controllers/doctor');
const appointments = require('../controllers/appointments');
const conversations = require('../controllers/conversations');
const messages = require('../controllers/messages');
const tests = require('../controllers/tests');

module.exports = function (app) {
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/doctors', doctors);
  app.use('/api/appointments', appointments);
  app.use('/api/conversations', conversations);
  app.use('/api/messages', messages);
  app.use('/api/tests', tests);
};
