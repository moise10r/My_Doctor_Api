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
require('./routes/router')(app);
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
