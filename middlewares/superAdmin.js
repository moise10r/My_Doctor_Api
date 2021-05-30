const { User } = require("../models/user");
const { Doctor } = require("../models/doctor");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

exports.isSuperAdmin = async function (req, res, next) {
	if (req.user.isSuperAdmin == true) {
		const user = await User.findById({ _id: req.params.id });
		const doctor = await Doctor.findById({ _id: req.params.id });

		if (user) {
			User.findByIdAndUpdate(
				user._id,
				{
					isAdmin: true,
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
					if (err)
						return res
							.status(400)
							.send("Nothing has been modified ,you are not a superAdmin");
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
		} else if (doctor) {
			Doctor.findByIdAndUpdate(
				doctor._id,
				{
					isAdmin: true,
				},
				{
					new: true,
				},
				(err, modifiedUser) => {
					const payload = {
						_id: doctor._id,
						name: doctor.name,
						doctorName: doctor.doctorName,
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
					if (err)
						return res
							.status(400)
							.send("Nothing has been modified ,you are not a superAdmin");
					modifiedUser.save();
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
								"profileImage",
								"role",
								"phoneNumber",
							])
						);
				}
			);
		} else {
			return res.status(404).send("The user with The ID was not found.");
		}
	}
};
