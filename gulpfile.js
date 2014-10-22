'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var jsFiles = ['./**/*.js', '!./node_modules/**/*.js'];
var clearScreen = function() {
  // break things up with a little space
  process.stdout.write('\u001b[2J');
};

gulp.task('dev', ['lint'], function() {
  gulp.watch(jsFiles, ['lint']);
});

gulp.task('lint', function() {
  clearScreen();
  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});