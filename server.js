const http = require('http');
const app = require('./backend/app');
const debug = require('debug')('node-angular');

const normalizePort = val => {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    //named pipe
    return val;
  }
  if (port >= 0) {
    //port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileages");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind)
}

// it takes a requestListener as a function and it will get requests, adding a arrow javascript function
// we will pull out path and other details
// later we will use express to do this
// const server = http.createServer( (req, res) => {
//   res.end('This is my first response');
// })

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
// for development port is 3000  OR we can use the default port where hosting provider will let us host the app on
// env variable in node can be accessed by process.env, PORT is a variable on the process
server.listen(port);

// improve the server.js file for better error handling
