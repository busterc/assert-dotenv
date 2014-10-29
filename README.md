# assert-dotenv

**assert-dotenv = [dotenv](https://github.com/motdotla/dotenv) + [dotenv-assert](https://github.com/busterc/dotenv-assert)**

One fell swoop for loading and asserting environment settings in node.

## Version 2.0.0

## Why use assert-dotenv

- Storing [configuration in the environment](http://www.12factor.net/config) is one of the tenets of a [twelve-factor app](http://www.12factor.net/).
- Implicit default settings can lead to confusing troubleshooting scenarios and should be avoided entirely.
- `.env` files contain setting keys and values, therefore, they should not be checked into version control repositories.
- The `assert.env` file only lists what environment settings (keys) are required without providing values like private tokens, passwords, etc. and therefore can and should be checked into version control repositories.

## How does it work

An exception is thrown if any of these cases are true:
  - An `assert.env` file is not found
  - The keys listed in the `assert.env` file are not set on the `process.env` node object
  - An Options Object or Callback Function are not passed in arguments

Otherwise, your environment settings are applied and your application executes as expected.

## Installation
```sh
$ npm install --save assert-dotenv
```

## Usage
```javascript
/**
*  attempt to load .env and assert.env files from CWD or
*  from the nearest parent directory where they are found
*/
require('assert-dotenv')({}, function() {
  console.log('Environment Settings Loaded and Asserted!');
});

/**
*  or, specify custom file locations
*/
require('assert-dotenv')({
  dotenvFile: '../configs/env.config',
  assertFile: '/Users/me/assert-files/express.env'
}, function() {
  console.log('Environment Settings Loaded and Asserted!');
});

/**
*  or, specify a custom file names, that will be loaded from
*  CWD or the nearest parent directory where each file is found
*/
require('assert-dotenv')({
  dotenvFile: 'settings.env',
  assertFile: 'settings.assert'
}, function() {
  console.log('Environment Settings Loaded and Asserted!');
});
```

## Simple HTTP Server Example

- ~/app/.env

  ```
  IP=127.0.0.1
  PORT=1337
  ```

- ~/app/assert.env

  ```
  IP
  PORT
  ```

- ~/app/index.js

  ```javascript
  require('assert-dotenv')({}, function() {
    var http = require('http');

    http.createServer(function (request, response) {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    }).listen(process.env.PORT, process.env.IP);

    console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');
  });

  ```

- _Start the server and see that all is well_

  ```sh
  $ node index.js
  Server running at http://127.0.0.1:1337/
  ```

## CHANGELOG

- 2.0.0 No longer throws an exception if a `.env` file is not found

## LICENSE

ISC License (ISC)

Copyright &copy; 2014, Buster Collings

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
