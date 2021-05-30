module.exports = async function (req, res, next) {
	if (req.user.isAdmin == true) {
		next();
	} else {
		res.status(400).send("you are not permitted to do this task");
	}
};
