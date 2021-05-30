const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "../config/config.env" });

exports.verifyToken = (req, res, next) => {
	const token = req.header("x-auth-token") || req.boby.token || req.query.token;
	if (!token)
		return res.status(400).json({ success: false, message: "token incorrect" });
	jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, decoded) => {
		if (err)
			return res
				.status(400)
				.json({ success: false, message: "token is invalid" });
		req.user = decoded;
		next();
	});
};
