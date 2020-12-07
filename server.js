/*
  Creating server using node.js, comments to help me grasp it better.
*/
const http = require('http');  //this is how we import in node
const app = require('./backend/app'); //importing express app

const port = process.env.PORT || 3000; //the default port or port 3000

app.set('port', port); //set the port
const server = http.createServer(app);

server.listen(port); //listen on port 3000
