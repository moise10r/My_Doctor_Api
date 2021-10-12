const express = require('express');
const app = express();
const chalk = require('chalk');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

//environments variables
dotenv.config({ path: './config/config.env' });
//calling the data function
const connectDB = require('./config/db');
connectDB();

//middlewares
app.use(
  cors({
    origin: '*',
  }),
);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
require('./routes/router')(app);
app.use(helmet());
app.use(compression());

io.on('connection', (socket) => {
  console.log(chalk.green('New user connected'));
  socket.on('new-message', (conversation) => {
    socket.broadcast.emit('new-message', conversation);
  });
});

global.socket = io;

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(
    `The server is running in ${PORT} on PORT:${chalk.italic.greenBright(
      PORT,
    )}`,
  );
});
