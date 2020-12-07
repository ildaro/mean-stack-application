/*
  Creating server using node.js, comments to help me grasp it better.
*/
const app = require("./backend/app"); //importing express app
const debug = require("debug")("node-angular");
const http = require("http"); //use required to import

//function to make sure port is a valid port
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

//check which type of error occured and log something depending on the type
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//function to log that we are listening to incoming requests
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port); //setting port

const server = http.createServer(app);
server.on("error", onError); //this is for logging if anything went wrong while starting the server
server.on("listening", onListening); //this is for logging that the app is listening for requests and everything went smooth
server.listen(port);
