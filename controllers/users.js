const express = require('express');
const router = express.Router();
const { User, validateUser, validateUserEdit } = require('../models/user');
const bcrypt = require('bcrypt');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const moment = require('moment');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');

Fawn.init(mongoose);
//, [auth.verifyToken, admin]
<<<<<<< HEAD
router.post("/", async (req, res) => {
	const {
		name,
		email,
		password,
	} = req.body;
	const validation = validateUser(req.body);
	if (validation.error) {
		res.header('x-auth-token').status(400).send(validation.error.details[0].message);
		return;
	}
	let user = await User.findOne({ email });
	
	if (user) return res.header('x-auth-token').status(400).send("User already registered.");
	user = new User({
		name,
		email,
		password,
		lastName: "",
		phoneNumber: "",
		age: "",
		profileImage: "",
		gender: "",
		country: "",
		city: "",
		streetNumber: "",
		isAdmin: true,
		isSuperAdmin: true,
		createdAt: moment(Date.now()).format("LL"),
	});
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) return res.header('x-auth-token').send('password is incorrect');
			user.password = hash;
			try {
				new Fawn.Task().save("users", user).run();
				const payload = {
					_id: user._id,
					name: user.name,
					email: user.email,
					lastName: "",
					phoneNumber: "",
					age: "",
					profileImage: "",
					gender: "",
					country: "",
					city: "",
					streetNumber: "",
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
				res.header('x-auth-token').send('something went wrong ')
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
		res.header('x-auth-token').status(400).send(validation.error.details[0].message);
		return;
	}
	const newUser = req.user;
	const user = await User.findById({ _id: newUser._id });
	if (!user) return res.header('x-auth-token').status(400).send("No user with those credentials");

	User.findByIdAndUpdate(
		newUser._id,
		{
			name,
			lastName,
			email,
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
			if (err) return res.header('x-auth-token').status(400).send("Nothing has been modified");
			modifiedUser.save();
			return res
				.header("x-auth-token", token)
				.status(200)
				.send(
					_.pick(payload, [
						"_id",
						"name",
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
		return res.header('x-auth-token').status(404).send("The use with the given ID was not found.");
	res.header('x-auth-token').send(user);
});

//Get All Users
// [auth.verifyToken, admin], 
router.get("/",async (req, res) => {
	const users = await User.find();
	if (!users) return res.header('x-auth-token').status(404).send("There is no user ");
	console.log(req.headers);
	res.header('x-auth-token').send(users);
});
//Get One User
//, [auth.verifyToken, admin]
router.get("/:id", async (req, res) => {
	const user = await User.findById({ _id: req.params.id });
	if (!user)
		return res.header('x-auth-token').status(404).send("The User with this ID was not found. ");
	res.header('x-auth-token').status(200).send(user);
});
//Modifier User Profile
// [auth.verifyToken, admin],
router.put("/:id", async (req, res) => {
	const {
		name,
		lastName,	
		email,
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
		res.header('x-auth-token').status(400).send(validation.error.details[0].message);
		return;
	}
	const user = await User.findById({ _id: req.params.id });
	if (!user) return res.header('x-auth-token').status(400).send("No user with those credentials");
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash) => {
			if (err) return res.header('x-auth-token').send('password is incorrect');
			User.findByIdAndUpdate(
				user._id,
			{	
				$set : {
					name: name || user.name,
					lastName: lastName || user.lastName,
					email:email ||  user.email,
					password: hash,
					phoneNumber: phoneNumber || user.phoneNumber,
					age: age || user.age ,
					profileImage: profileImage || user.profileImage,
					gender:  gender || user.gender,
					country: country || user.country ,
					city: city || user.city ,
					streetNumber: streetNumber || user.streetNumber,
				}
			},
				{
					upsert: true, 
					new: true

				},
				(err, modifiedUser) => {
					const payload = {
						_id: modifiedUser._id,
						name: modifiedUser.name,
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
					if (err) return res.header('x-auth-token').status(400).send("Nothing has been modified");
					modifiedUser.save();
					return res
						.header("x-auth-token", token)
						.status(200)
						.send(
							_.pick(payload, [
								"_id",
								"name",
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
	});
=======
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  const validation = validateUser(req.body);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
    return;
  }
  let user = await User.findOne({ email });

  if (user) return res.status(400).send('User already registered.');
  user = new User({
    name,
    email,
    password,
    lastName: '',
    phoneNumber: '',
    age: '',
    profileImage: '',
    gender: '',
    country: '',
    city: '',
    streetNumber: '',
    isAdmin: true,
    isSuperAdmin: true,
    createdAt: moment(Date.now()).format('LL'),
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return res.send('password is incorrect');
      user.password = hash;
      try {
        new Fawn.Task().save('users', user).run();
        const payload = {
          _id: user._id,
          name: user.name,
          email: user.email,
          lastName: '',
          phoneNumber: '',
          age: '',
          profileImage: '',
          gender: '',
          country: '',
          city: '',
          streetNumber: '',
        };
        const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
        console.log(token);
        return res
          .header('x-auth-token', token)
          .status(200)
          .send(
            _.pick(payload, [
              '_id',
              'name',
              'email',
              'lastName',
              'phoneNumber',
              'age',
              'profileImage',
              'gender',
              'country',
              'city',
              'streetNumber',
            ]),
          );
      } catch (error) {
        res.send('something went wrong ');
      }
    });
  });
});

router.delete('/:id', [auth.verifyToken, admin], async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  if (!user)
    return res.status(404).send('The use with the given ID was not found.');
  res.send(user);
});

router.get('/', async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(404).send('There is no user ');
  res.send(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  if (!user)
    return res.status(404).send('The User with this ID was not found. ');
  res.status(200).send(user);
});

router.put('/:id', [auth.verifyToken], async (req, res) => {
  const {
    name,
    lastName,
    email,
    password,
    phoneNumber,
    age,
    profileImage,
    gender,
    country,
    status,
    kitIdentifier,
    city,
    streetNumber,
  } = req.body;
  const validation = validateUserEdit(req.body);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    password = password = hash;
  }
  let user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).send('The User with this ID was not found. ');

  user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name,
        lastName,
        email,
        password: password ? password : user.password,
        phoneNumber,
        age,
        gender,
        profileImage,
        status,
        kitIdentifier,
        streetNumber,
        city,
        country,
      },
    },
    { new: true },
  );
  if (!user)
    return res.status(404).send('The User with this ID was not found. ');

  const token = jwt.sign(
    _.pick(user, [
      '_id',
      'name',
      'email',
      'lastName',
      'phoneNumber',
      'age',
      'profileImage',
      'gender',
      'country',
      'city',
      'streetNumber',
      'status',
      'kitIdentifier',
    ]),
    process.env.SECRET_TOKEN_KEY,
  );

  res
    .header('x-auth-token', token)
    .send(
      _.pick(user, [
        '_id',
        'name',
        'email',
        'lastName',
        'phoneNumber',
        'age',
        'profileImage',
        'gender',
        'country',
        'city',
        'streetNumber',
        'status',
        'kitIdentifier',
      ]),
    );
>>>>>>> 857e594bb9d2b4b25d9d89492ce23202ed135712
});

//make user Admin
router.put('/:id/admin', [auth.verifyToken, admin], superAdmin.isSuperAdmin);

module.exports = router;
