const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const doctorsSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
	lastName: {
		type: String,
		required: true,
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
	doctorName: {
		type: String,
		require: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
	},
	role: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024,
	},
	phoneNumber: {
		type: String,
		required: true,
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
		required: true,
	},
});

const Doctor = mongoose.model("doctors", doctorsSchema);
function validateDoctor(doctor) {
	const schema = Joi.object().keys({
		name: Joi.string().min(2).max(50).required(),
		lastName: Joi.string().min(2).max(50).required(),
		email: Joi.string().min(2).max(50).required().email(),
		doctorName: Joi.string().min(5).max(255).required(),
		role: Joi.string().min(5).max(255).required(),
		password: Joi.string().min(5).max(255).required(),
		phoneNumber: Joi.string().required(),
		profileImage: Joi.string().required(),
	});
	return schema.validate(doctor);
}
exports.validateDoctor = validateDoctor;
exports.Doctor = Doctor;
