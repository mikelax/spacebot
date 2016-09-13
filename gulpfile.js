/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const eslint = require('gulp-eslint');
const gulp = require('gulp-help')(require('gulp'));
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');

function errorHandler(error) {
  gutil.log(error.toString());
  this.emit('end');
}

// Top level tasks
gulp.task('test', 'Run Unit Tests', (cb) => gulp
  .src('test/*.spec.js', { read: false })
  .pipe(mocha({
    reporter: 'nyan',
    ui: 'bdd',
    timeout: 1000
  }))
  .on('error', errorHandler)
  .on('finish', cb)
);

gulp.task('lint', 'ESLint all Javascript', () => gulp
  .src('**/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .on('error', errorHandler)
);
