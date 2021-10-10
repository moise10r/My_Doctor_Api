const express = require('express');
const app = express();
const chalk = require('chalk');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const server = require('http').createServer(app);

//environments variables
dotenv.config({ path: './config/config.env' });
//calling the data function
const connectDB = require('./config/db');
connectDB();

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use(cors());
<<<<<<< HEAD
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "x-auth-token");
	next();
});
require("./routes/router")(app);
=======
require('./routes/router')(app);
>>>>>>> 857e594bb9d2b4b25d9d89492ce23202ed135712
app.use(helmet());
app.use(compression());

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(
    `The server is running in ${
      process.env.NODE_ENV
    } on PORT:${chalk.italic.greenBright(PORT)}`,
  );
});

module.exports = { app, server };
