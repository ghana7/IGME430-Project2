const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const redis = require('redis');
const { Server } = require('socket.io');
const password = require('./password.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbUrl = process.env.MONGODB_URI || password.getMongoString();

// Setup mongoose options to use newer functionality
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(dbUrl, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

let redisURL = {
  hostname: 'redis-17903.c256.us-east-1-2.ec2.cloud.redislabs.com',
  port: 17903,
};

let redisPASS = 'ezTOXtp9gneczF0ZjzdKiQ9NNtkG6ASE';

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPASS] = redisURL.auth.split(':');
}

const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});

// Pull in our routes
const router = require('./router.js');
const { NRTGame } = require('../util/nrtmsrts.js');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Domo arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  return false;
});

router(app);

const server = app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});

const io = new Server(server);
let game = new NRTGame();

io.on('connection', (socket) => {
  // let all the clients know about this new connection (i.e. socket)
  const msg = `NEW CONNECTION: socket.id=${socket.id}`;

  const obj = {
    date: new Date().toLocaleTimeString(),
    msg,
  };

  io.sockets.emit('messageAll', obj); // send it to everybody
  console.log(msg);

  // hook up three events for this particular socket
  socket.on('disconnect', (str) => {
    const dcMsg = `DISCONNECTION: socket.id=${socket.id} - str = ${str}`;
    const dcObj = {
      date: new Date().toLocaleTimeString(),
      dcMsg,
    };
    io.sockets.emit('messageAll', dcObj); // send it to everybody
    console.log(dcMsg);
  });

  socket.on('error', (error) => {
    console.log(`socket.id=${socket.id} error with error = ${error}`);
  });

  socket.on('message', (msgObj) => {
    console.log('Received:', msgObj);
    console.log(game);
    if (msgObj.msg === 'reset') {
      game = new NRTGame();
      io.sockets.emit('gameUpdate', {
        newGame: game,
      });
    }
    if (game.makeMove(msgObj.msg, msgObj.username)) {
      io.sockets.emit('gameUpdate', {
        newGame: game,
      });
    } else {
      console.log(`invalid move: "${msgObj.msg}"`);
    }
    socket.broadcast.emit('message', {
      date: new Date().toLocaleTimeString(),
      msg: msgObj.msg,
    }); // just send it to those that didn't send the original obj
  });
});
