const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const moment = require("moment");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const superAdmin = require("../middlewares/superAdmin");

Fawn.init(mongoose);
//, [auth.verifyToken, admin]
router.post("/", async (req, res) => {
	const {
		name,
		lastName,
		email,
		username,
		password,
		phoneNumber,
		age,
		profileImage,
		gender,
		country,
		city,
		streetNumber,
	} = req.body;
	const validation = validateUser(req.body);
	if (validation.error) {
		res.status(400).send(validation.error.details[0].message);
		return;
	}
	let user = await User.findOne({
		$or: [
			{
				email: req.body.email,
			},
			{
				username: req.body.username,
			},
		],
	});
	if (user) return res.status(400).send("User already registered.");
	user = new User({
		name,
		lastName,
		email,
		username,
		password,
		phoneNumber,
		age,
		profileImage,
		gender,
		country,
		city,
		streetNumber,
		isAdmin: true,
		isSuperAdmin: true,
		createdAt: moment(Date.now()).format("LL"),
	});
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) throw err;
			user.password = hash;
			try {
				new Fawn.Task().save("users", user).run();
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
				console.log(token);
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
			} catch (error) {
				console.log(error);
			}
		});
	});
});
//auth.verifyToken,
router.put("/", async (req, res) => {
	const {
		name,
		lastName,
		email,
		username,
		password,
		phoneNumber,
		age,
		profileImage,
		gender,
		country,
		city,
		streetNumber,
	} = req.body;
	const validation = validateUser(req.body);
	if (validation.error) {
		res.status(400).send(validation.error.details[0].message);
		return;
	}
	const newUser = req.user;
	const user = await User.findById({ _id: newUser._id });
	if (!user) return res.status(400).send("No user with those credentials");

	User.findByIdAndUpdate(
		newUser._id,
		{
			name,
			lastName,
			email,
			username,
			password,
			phoneNumber,
			age,
			profileImage,
			gender,
			country,
			city,
			streetNumber,
		},
		{
			new: true,
		},
		(err, modifiedUser) => {
			const payload = {
				_id: modifiedUser._id,
				name: modifiedUser.name,
				username: modifiedUser.username,
				email: modifiedUser.email,
				lastName: modifiedUser.lastName,
				phoneNumber: modifiedUser.phoneNumber,
				age: modifiedUser.age,
				profileImage: modifiedUser.profileImage,
				gender: modifiedUser.gender,
				country: modifiedUser.country,
				city: modifiedUser.city,
				streetNumber: modifiedUser.streetNumber,
				isAdmin: modifiedUser.isAdmin,
				isSuperAdmin: modifiedUser.isSuperAdmin,
			};
			const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
			console.log(token);
			if (err) return res.status(400).send("Nothing has been modified");
			modifiedUser.save();
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
		}
	);
});

//Admin Privileges
//Delete User
//[auth.verifyToken, admin],
router.delete("/:id",  async (req, res) => {
	const user = await User.findOneAndDelete({ _id: req.params.id });
	if (!user)
		return res.status(404).send("The use with the given ID was not found.");
	res.send(user);
});

//Get All Users
// [auth.verifyToken, admin], 
router.get("/",async (req, res) => {
	const users = await User.find();
	if (!users) return res.status(404).send("There is no user ");
	res.send(users);
});
//Get One User
//, [auth.verifyToken, admin]
router.get("/:id", async (req, res) => {
	const user = await User.findById({ _id: req.params.id });
	if (!user)
		return res.status(404).send("The User with this ID was not found. ");
	res.status(200).send(user);
});
//Modifier User Profile
// [auth.verifyToken, admin],
router.put("/:id", async (req, res) => {
	const {
		name,
		lastName,
		email,
		username,
		password,
		phoneNumber,
		age,
		profileImage,
		gender,
		country,
		city,
		streetNumber,
	} = req.body;
	const validation = validateUser(req.body);
	if (validation.error) {
		res.status(400).send(validation.error.details[0].message);
		return;
	}
	const user = await User.findById({ _id: req.params.id });
	if (!user) return res.status(400).send("No user with those credentials");

	User.findByIdAndUpdate(
		user._id,
		{
			name,
			lastName,
			email,
			username,
			password,
			phoneNumber,
			age,
			profileImage,
			gender,
			country,
			city,
			streetNumber,
		},
		{
			new: true,
		},
		(err, modifiedUser) => {
			const payload = {
				_id: modifiedUser._id,
				name: modifiedUser.name,
				username: modifiedUser.username,
				email: modifiedUser.email,
				lastName: modifiedUser.lastName,
				phoneNumber: modifiedUser.phoneNumber,
				age: modifiedUser.age,
				profileImage: modifiedUser.profileImage,
				gender: modifiedUser.gender,
				country: modifiedUser.country,
				city: modifiedUser.city,
				streetNumber: modifiedUser.streetNumber,
				isAdmin: modifiedUser.isAdmin,
				isSuperAdmin: modifiedUser.isSuperAdmin,
			};
			const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
			if (err) return res.status(400).send("Nothing has been modified");
			modifiedUser.save();
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
		}
	);
});

//make user Admin
router.put("/:id/admin", [auth.verifyToken, admin], superAdmin.isSuperAdmin);

module.exports = router;
