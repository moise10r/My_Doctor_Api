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
	username: {
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
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	profileImage: {
		type: String,
	},
	gender: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
	city: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
	streetNumber: {
		type: Number,
		required: true,
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
		required: true,
	},
});

const User = mongoose.model("users", usersSchema);
function validateUser(user) {
	const schema = Joi.object().keys({
		name: Joi.string().min(2).max(50).required(),
		lastName: Joi.string().min(2).max(50).required(),
		email: Joi.string().min(2).max(50).required().email(),
		username: Joi.string().min(5).max(255).required(),
		password: Joi.string().min(5).max(255).required(),
		phoneNumber: Joi.string().required(),
		age: Joi.number().min(5).max(255).required(),
		profileImage: Joi.string().required(),
		gender: Joi.string().required(),
		country: Joi.string().min(2).max(50).required(),
		city: Joi.string().min(2).max(50).required(),
		streetNumber: Joi.number().min(2).max(1000).required(),
	});
	return schema.validate(user);
}
exports.validateUser = validateUser;
exports.User = User;
