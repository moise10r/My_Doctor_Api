const express = require("express");
const router = express.Router();
const { Doctor, validateDoctor } = require("../models/doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const moment = require("moment");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const superAdmin = require("../middlewares/superAdmin");

// auth.verifyToken,
// admin,
router.post("/", async (req, res) => {
	let {
		name,
		email,
		password,
	} = req.body;
	const validation = validateDoctor(req.body);
	if (validation.error) {
		res.status(400).send(validation.error.details[0].message);
		return;
	}
	let doctor = await Doctor.findOne({
		$or: [
			{
				email,
			},
		],
	});
	if (doctor) return res.status(400).send("doctor already registered.");
	doctor = new Doctor({
		name,
		email,
		password,
		createdAt: moment(Date.now()).format("LL"),
	});
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(doctor.password, salt, (err, hash) => {
			if (err) throw err;
			doctor.password = hash;
			try {
				doctor.save();
				const payload = {
					_id: doctor._id,
					name: doctor.name,
					email: doctor.email,
					isAdmin: doctor.isAdmin,
					isSuperAdmin: doctor.isSuperAdmin,
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
							"email",
						])
					);
			} catch (error) {
				res.send("Something went wrong");
			}
		});
	});
});

// auth.verifyToken,
router.put("/", async (req, res) => {
	let {
		name,
		lastName,
		email,
		password,
		role,
		phoneNumber,
		profileImage,
	} = req.body;
	const validation = validatedoctor(req.body);
	if (validation.error) {
		res.status(400).send(validation.error.details[0].message);
		return;
	}
	const newDoctor = req.doctor;
	const doctor = await Doctor.findById({ _id: newDoctor._id });
	if (!doctor) return res.status(400).send("No doctor with those credentials");

	doctor.findByIdAndUpdate(
		newDoctor._id,
		{
			name,
			lastName,
			email,
			password,
			role,
			phoneNumber,
			profileImage,
		},
		{
			new: true,
		},
		(err, modifiedDoctor) => {
			const payload = {
				_id: doctor._id,
				name: doctor.name,
				email: doctor.email,
				lastName: doctor.lastName,
				role: doctor.role,
				phoneNumber: doctor.phoneNumber,
				profileImage: doctor.profileImage,
				streetNumber: doctor.streetNumber,
				isAdmin: doctor.isAdmin,
				isSuperAdmin: doctor.isSuperAdmin,
			};
			const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
			console.log(token);
			if (err) return res.status(400).send("Nothing has been modified");
			modifiedDoctor.save();
			return res
				.header("x-auth-token", token)
				.status(200)
				.send(
					_.pick(payload, [
						"_id",
						"name",
						"email",
						"lastName",
						"profileImage",
						"role",
						"phoneNumber",
					])
				);
		}
	);
});

//Admin Privileges
//Delete doctor
// [auth.verifyToken, admin], 
router.delete("/:id",async (req, res) => {
	const doctor = await Doctor.findOneAndDelete({ _id: req.params.id });
	if (!doctor)
		return res.status(404).send("The use with the given ID was not found.");
	res.send(doctor);
});

//Get All doctors
//[auth.verifyToken, admin],
router.get("/",  async (req, res) => {
	const doctors = await Doctor.find();
	if (!doctors) return res.status(404).send("There is no doctor ");
	res.send(doctors);
});
//Get One doctor
// [auth.verifyToken, admin],
router.get("/:id", async (req, res) => {
	const doctor = await Doctor.findById({ _id: req.params.id });
	if (!doctor)
		return res.status(404).send("The doctor with this ID was not found. ");
	res.status(200).send(doctor);
});
//Modifier doctor Profile
//[auth.verifyToken, admin], 
router.put("/:id", async (req, res) => {
	let {
		name,
		lastName,
		email,
		password,
		role,
		phoneNumber,
		profileImage,
	} = req.body;
	const validation = validatedoctor(req.body);
	if (validation.error) {
		res.status(400).send(validation.error.details[0].message);
		return;
	}
	const doctor = await Doctor.findById({ _id: req.params.id });
	if (!doctor) return res.status(400).send("No doctor with those credentials");

	doctor.findByIdAndUpdate(
		doctor._id,
		{
			name,
			lastName,
			email,
			password,
			role,
			phoneNumber,
			profileImage,
		},
		{
			new: true,
		},
		(err, modifiedDoctor) => {
			const payload = {
				_id: doctor._id,
				name: doctor.name,
				email: doctor.email,
				lastName: doctor.lastName,
				role: doctor.role,
				phoneNumber: doctor.phoneNumber,
				profileImage: doctor.profileImage,
				streetNumber: doctor.streetNumber,
				isAdmin: doctor.isAdmin,
				isSuperAdmin: doctor.isSuperAdmin,
			};
			const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
			console.log(token);
			if (err) return res.status(400).send("Nothing has been modified");
			modifiedDoctor.save();
			return res
				.header("x-auth-token", token)
				.status(200)
				.send(
					_.pick(payload, [
						"_id",
						"name",
						"email",
						"lastName",
						"profileImage",
						"role",
						"phoneNumber",
					])
				);
		}
	);
});

//make doctor Admin
router.put("/:id/admin", [auth.verifyToken, admin], superAdmin.isSuperAdmin);

module.exports = router;
