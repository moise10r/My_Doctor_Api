const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
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
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024,
	},
	phoneNumber: {
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
		minlength: 3,
		maxlength: 50,
	},
	city: {
		type: String,
		minlength: 3,
		maxlength: 50,
	},
	streetNumber: {
		type: String,
		minlength: 3,
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

const User = mongoose.model("users", usersSchema);
function validateUser(user) {
	const schema = Joi.object().keys({
		name: Joi.string().min(2).max(50).required(),
		email: Joi.string().min(2).max(50).required().email(),
		password: Joi.string().min(5).max(255).required(),
		lastName: Joi.string().min(2).max(50),
		phoneNumber: Joi.string(),
		age: Joi.number().min(5).max(255),
		profileImage: Joi.string(),
		gender: Joi.string(),
		country: Joi.string().min(2).max(50),
		city: Joi.string().min(2).max(50),
		streetNumber: Joi.number().min(2).max(1000),
	});
	return schema.validate(user);
}
exports.validateUser = validateUser;
exports.User = User;
