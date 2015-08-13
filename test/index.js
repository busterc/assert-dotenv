'use strict';

/* global describe, before, beforeEach, it */

var assert = require('assert');
var assertDotenv = require('../lib');
var subdirectory = './1/2/3';
var CURRENT_WORKING_DIRECTORY;

describe('assertDotenv', function () {

  before(function () {
    CURRENT_WORKING_DIRECTORY = __dirname;
  });

  beforeEach(function () {
    process.chdir(CURRENT_WORKING_DIRECTORY);
  });

  it('should run sync with defaults', function (done) {
    assertDotenv();
    done();
  });

  it('should run sync with custom options', function (done) {
    assertDotenv({
      dotenvFile: '.env.dev',
      assertFile: 'assert.env.dev'
    });
    done();
  });

  it('should run async with defaults', function (done) {
    assertDotenv(function (error) {
      assert.equal(null, error);
      done();
    });
  });

  it('should run async with custom options', function (done) {
    assertDotenv({
        dotenvFile: '.env.ftw',
        assertFile: 'assert.env.ftw'
      },
      function (error) {
        assert.equal(null, error);
        done();
      });
  });

  it('should run sync with defaults and find the assert file in a parent directory', function (done) {
    process.chdir(subdirectory);
    assertDotenv();
    done();
  });

  it('should run sync with custom options and find the assert file in a parent directory', function (done) {
    process.chdir(subdirectory);
    assertDotenv({
      dotenvFile: '.env.dev',
      assertFile: 'assert.env.dev'
    });
    done();
  });

  it('should run async with defaults and find the assert file in a parent directory', function (done) {
    process.chdir(subdirectory);
    assertDotenv(function (error) {
      assert.equal(null, error);
      done();
    });
  });

  it('should run async with custom options and find the assert file in a parent directory', function (done) {
    process.chdir(subdirectory);
    assertDotenv({
        dotenvFile: '.env.parent',
        assertFile: 'assert.env.parent'
      },
      function (error) {
        assert.equal(null, error);
        done();
      });
  });

  it('should fail to find a missing assert file path', function (done) {
    assert.throws(function () {
      assertDotenv({
        assertFile: './xxx/you-will-never-find-me.env'
      });
    });
    done();
  });

  it('should run async and fail to find a missing assert file path', function (done) {
    assertDotenv({
      assertFile: './xxx/you-will-never-find-me.env'
    }, function (error) {
      assert.equal('ENOENT', error.code);
      done();
    });
  });

  it('should fail to assert on a missing env setting', function (done) {
    assert.throws(function () {
      assertDotenv({
        assertFile: 'assert.env.fail'
      });
    });
    done();
  });
});
