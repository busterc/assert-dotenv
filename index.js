'use strict';
module.exports = function(options, callback) {
  var fs = require('fs');
  var findParentDir = require('find-parent-dir');
  var CURRENT_WORKING_DIRECTORY = process.cwd();
  var dotenv = require('dotenv');
  var dotenvAssert = require('dotenv-assert');
  var dotenvAssertOptions = {
    filePath: 'assert.env'
  };
  var dotenvFile = '.env';
  var errorMessage;

  function OptionsError(message) {
    this.message = message;
    this.name = '  Options Error';
  }

  function CallbackError(message) {
    this.message = message;
    this.name = '  Callback Error';
  }

  function loadAndAssert(options, callback) {
    dotenv._getKeysAndValuesFromEnvFilePath(options.dotenvFile);
    dotenv._setEnvs();
    dotenvAssert(options.dotenvAssertOptions, callback);
  }

  if (typeof options !== 'object' || Object.prototype.toString.call(options) === '[object Array]') {
    errorMessage = 'You can only pass an Options Object and Callback Function ' +
      'or empty arguments to assert-dotenv. Please see the official README.md for details.';
    throw new OptionsError(errorMessage);
  }

  dotenvFile = options.dotenvFile || dotenvFile;
  dotenvAssertOptions.filePath = options.assertFile || dotenvAssertOptions.filePath;

  if (typeof callback !== 'function') {
    errorMessage = '    The callback is not a function';
    throw new CallbackError(errorMessage);
  }

  if (dotenvFile.indexOf('/') > -1) {

    // look for explicit dotenv file location
    fs.exists(dotenvFile, function(exists) {
      if (exists) {
        loadAndAssert({
          dotenvFile: dotenvFile,
          dotenvAssertOptions: dotenvAssertOptions
        }, callback);
      }
    });
  } else {

    // find the dotenv file in $CWD or the nearest parent directory
    findParentDir(CURRENT_WORKING_DIRECTORY, dotenvFile, function(error, directory) {
      if (!error && directory !== null) {
        dotenvFile = directory + '/' + dotenvFile;
      }

      loadAndAssert({
        dotenvFile: dotenvFile,
        dotenvAssertOptions: dotenvAssertOptions
      }, callback);
    });
  }
};
