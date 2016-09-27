/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const eslint = require('gulp-eslint');
const gulp = require('gulp-help')(require('gulp'));
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');

// Top level tasks
gulp.task('test', 'Run Unit Tests', ['lint'], cb => gulp
  .src('test/*.spec.js', { read: false })
  .pipe(mocha({
    reporter: 'spec',
    ui: 'bdd',
    timeout: 1000
  }))
  .on('error', gutil.log)
  .on('finish', cb)
);

gulp.task('lint', 'ESLint all Javascript', () => gulp
  .src('**/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .on('error', gutil.log)
);
