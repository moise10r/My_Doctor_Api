const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		console.log(
			`MongoDB is connected:${chalk.italic.greenBright(process.env.MONGO_URI)}`
		);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};
module.exports = connectDB;
