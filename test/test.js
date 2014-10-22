'use strict';

// require('../index')({
//   dotenvFile: './env.config',
// }, function() {

require('../index')({}, function() {

  var http = require('http');

  http.createServer(function(request, response) {
      response.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      response.end('Hello World\n');
    })
    .listen(process.env.PORT, process.env.IP);

  console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');
});