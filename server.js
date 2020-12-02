/*
  Creating server using node.js, comments to help me grasp it better.
*/
const http = require('http');  //this is how we import in node

const server = http.createServer((req, res) => {
  res.end('This is my first response'); // end writing to response stream
});

server.listen(process.env.PORT || 3000); //listen on default port or port 3000b
