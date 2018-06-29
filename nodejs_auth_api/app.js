const config = require('./config');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { db } = require('./models');

const apiRouter = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

app.use('/', apiRouter);

app.set('port', config.server.port);
app.set('secure_port', config.server.secure_port);

const http = require('http');
const server = http.createServer(app);

server.listen({
  host: config.server.host,
  port: config.server.port
});
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + config.port
    : 'Port ' + config.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});
server.on('listening', () => {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : addr.address + ':' + addr.port;
  console.log('Listening on ' + bind);
});
server.on('clientError', (err, socket) => {
  console.error('There was an error', err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

process.on('exit', (code) => {
  db.end();
  console.log(`About to exit with code: ${code}`);
});

// const https = require('https');
// const secure_server = https.createServer(app);
// secure_server.listen({
//   host: config.server.host,
//   port: config.server.secure_port
// });
