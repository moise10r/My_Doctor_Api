const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Doctor } = require("../models/doctor");
const Joi = require("@hapi/joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
	const { email, password } = req.body;
	const schema = Joi.object().keys({
		email: Joi.string().min(5).max(255).required(),
		password: Joi.string().min(5).max(255).required(),
	});
	const validation = schema.validate(req.body);
	if (validation.error) {
		res.status(400).send(validation.error.details[0].message);
		return;
	}
	User.findOne({
		$or: [
			{
				email: email,
			},
			{
				username: email,
			},
		],
	})
		.then((user) => {
			if (!user) {
				Doctor.findOne({
					$or: [
						{
							email: email,
						},
						{
							doctorName: email,
						},
					],
				})
					.then((doctor) => {
						if (!doctor)
							return res
								.status(400)
								.send("user with those cridentials does not exist");
						bcrypt.compare(password, doctor.password, (err, isMatch) => {
							if (err) throw err;

							if (isMatch) {
								const payload = {
									_id: doctor._id,
									name: doctor.name,
									doctorName: doctor.doctorName,
									email: doctor.email,
									lastName: doctor.lastName,
									phoneNumber: doctor.phoneNumber,
									role: doctor.role,
									profileImage: doctor.profileImage,
									isAdmin: doctor.isAdmin,
									isSuperAdmin: doctor.isSuperAdmin,
								};
								const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
								return res
									.header("x-auth-token", token)
									.status(200)
									.send(
										_.pick(payload, [
											"_id",
											"name",
											"doctorName",
											"email",
											"lastName",
											"phoneNumber",
											"role",
											"profileImage",
										])
									);
							} else {
								return res.status(401).send("email or password incorrect ");
							}
						});
					})
					.catch((err) => {
						res.status(500).send("Something went wrong");
						console.log(err);
					});
			} else {
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) throw err;

					if (isMatch) {
						const payload = {
							_id: user._id,
							name: user.name,
							username: user.username,
							email: user.email,
							lastName: user.lastName,
							phoneNumber: user.phoneNumber,
							age: user.age,
							profileImage: user.profileImage,
							gender: user.gender,
							country: user.country,
							city: user.city,
							streetNumber: user.streetNumber,
							isAdmin: user.isAdmin,
							isSuperAdmin: user.isSuperAdmin,
						};
						const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
						return res
							.header("x-auth-token", token)
							.status(200)
							.send(
								_.pick(payload, [
									"_id",
									"name",
									"username",
									"email",
									"lastName",
									"phoneNumber",
									"age",
									"profileImage",
									"gender",
									"country",
									"city",
									"streetNumber",
								])
							);
					} else {
						return res.status(401).send("email or password incorrect ");
					}
				});
			}
		})
		.catch((err) => console.log(err));
});

module.exports = router;
