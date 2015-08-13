'use strict';

var fs = require('fs');
var findParentDir = require('find-parent-dir');
var dotenv = require('dotenv');
var dotenvAssert = require('dotenv-assert');
var DOTENV_ASSERT_OPTIONS = {
  filePath: 'assert.env'
};
var DOTENV_FILENAME = '.env';

function assertDotenv() {
  switch (arguments.length) {
  case 0:
    return assertDotenv.syncd();
  case 1:
    var method = (typeof arguments[0] === 'function') ? 'asyncd' : 'synco';
    return assertDotenv[method](arguments[0]);
  case 2:
    return assertDotenv.asynco.apply({}, arguments);
  default:
    throw new Error('Invalid number of arguments');
  }
}

assertDotenv.syncd = function () {
  var dotenvFilePath = getDotenvFilePath.sync(DOTENV_FILENAME);

  loadAndAssert.sync({
    dotenvFile: dotenvFilePath,
    dotenvAssertOptions: DOTENV_ASSERT_OPTIONS
  });
};

assertDotenv.synco = function (options) {
  assertObject('options', options);

  var dotenvFilePath = options.dotenvFile || DOTENV_FILENAME;
  dotenvFilePath = getDotenvFilePath.sync(dotenvFilePath);

  var dotenvAssertOptions = {};
  dotenvAssertOptions.filePath = options.assertFile || DOTENV_ASSERT_OPTIONS.filePath;

  loadAndAssert.sync({
    dotenvFile: dotenvFilePath,
    dotenvAssertOptions: dotenvAssertOptions
  });
};

assertDotenv.asyncd = function (callback) {
  assertFunction('callback', callback);

  getDotenvFilePath(DOTENV_FILENAME, function (error, dotenvFilePath) {
    if (error) {
      throw error;
    }

    loadAndAssert({
      dotenvFile: dotenvFilePath,
      dotenvAssertOptions: DOTENV_ASSERT_OPTIONS
    }, callback);
  });
};

assertDotenv.asynco = function (options, callback) {
  assertObject('options', options);
  assertFunction('callback', callback);

  var dotenvFile = options.dotenvFile || DOTENV_FILENAME;

  getDotenvFilePath(dotenvFile, function (error, dotenvFilePath) {
    if (error) {
      throw error;
    }

    var dotenvAssertOptions = {};
    dotenvAssertOptions.filePath = options.assertFile || DOTENV_ASSERT_OPTIONS.filePath;

    loadAndAssert({
      dotenvFile: dotenvFilePath,
      dotenvAssertOptions: dotenvAssertOptions
    }, callback);
  });
};

function isFunction(fn) {
  return (typeof fn === 'function');
}

function assertFunction(name, fn) {
  if (!isFunction(fn)) {
    throw new Error(name + ' is not a function');
  }
}

function isObject(obj) {
  return (typeof obj === 'object');
}

function assertObject(name, obj) {
  if (!isObject(obj)) {
    throw new Error(name + ' is not a object');
  }
}

// function readFileToArray(filename, callback) {
//   assertFunction('callback', callback);
//   fs.readFile(filename, callback);
// }

// function readFileSyncToArray(filename) {
//   var file = String(fs.readFileSync(filename));
//   return fileToArray(file);
// }

// function fileToArray(contents) {
//   var lines = contents.split(/\r?\n/);
//   var lineCount = lines.length;
//   var results = [];
//   var currentLine = 0;

//   for (currentLine; currentLine < lineCount; currentLine++) {
//     var line = lines[currentLine].trim();
//     if (line.length > 0) {
//       results.push(line);
//     }
//   }

//   return results;
// }

function isExplicitFilePath(filePath) {
  if (filePath.indexOf('/') > -1) {
    return true;
  }
}

function getDotenvFilePath(filePath, callback) {
  assertFunction('callback', callback);
  if (isExplicitFilePath(filePath)) {
    callback(null, filePath);
  }

  var cwd = process.cwd();

  findParentDir(cwd, filePath, function (error, directory) {
    if (error || directory === null) {
      throw new Error(filePath + ' cannot be found.');
    }

    var dotenvFilePath = directory + '/' + filePath;
    callback(null, dotenvFilePath);
  });
}

getDotenvFilePath.sync = function (filePath) {
  if (isExplicitFilePath(filePath)) {
    return filePath;
  }

  var cwd = process.cwd();

  var directory = findParentDir.sync(cwd, filePath);
  var dotenvFilePath = directory + '/' + filePath;
  return dotenvFilePath;
};

function loadDotenv(options) {
  dotenv._getKeysAndValuesFromEnvFilePath(options.dotenvFile);
  dotenv._setEnvs();
}

function loadAndAssert(options, callback) {
  loadDotenv(options);
  dotenvAssert(options.dotenvAssertOptions, callback);
}

loadAndAssert.sync = function (options) {
  loadDotenv(options);
  dotenvAssert(options.dotenvAssertOptions);
};

module.exports = assertDotenv;
