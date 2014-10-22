'use strict';

require('../../../../index')({}, function() {

// require('../../../../index')({
//   dotenvFile: 'env.config',
// }, function() {

// require('../../../../index')({
//   assertFile: 'assert.settings'
// }, function() {

// require('../../../../index')({
//   dotenvFile: 'env.config',
//   assertFile: 'assert.settings'
// }, function() {

// THIS SHOULD BREAK
// require('../../../../index')({
//   dotenvFile: 'env.settings',
//   assertFile: 'assert.settings'
// }, function() {


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