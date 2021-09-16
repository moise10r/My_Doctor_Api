const auth = require("../controllers/auth");
const users = require("../controllers/users");
const doctors = require("../controllers/doctor");
const appointment = require('../controllers/appointment');

module.exports = function (app) {
	app.use("/api/auth", auth);
	app.use("/api/users", users);
	app.use("/api/doctors", doctors);
	app.use("/api/appointement", appointment);
};
