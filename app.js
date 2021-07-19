const express = require("express");
const app = express();
const chalk = require("chalk");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helpmet = require('helmet');
const compression = require('compression');

//environments variables
dotenv.config({ path: "./config/config.env" });
//calling the data function
const connectDB = require("./config/db");
connectDB();

//middlewares
if (process.env.NODE_ENV == "development") {
	app.use(morgan("dev"));
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(compression());
//routes
require("./routes/router")(app);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(
		`The server is running in ${
			process.env.NODE_ENV
		} on PORT:${chalk.italic.greenBright(PORT)}`
	);
});
