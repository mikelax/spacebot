/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const gulp = require('gulp-help')(require('gulp'));
const eslint = require('gulp-eslint');
const gutil = require('gulp-util');

function errorHandler(error) {
  gutil.log(error.toString());
  this.emit('end');
}

// Top level tasks

gulp.task('lint', 'ESLint all Javascript', () => gulp
  .src('**/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .on('error', errorHandler)
);
