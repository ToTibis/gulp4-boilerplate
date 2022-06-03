import gulp from 'gulp';
const plumber = require('gulp-plumber');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

import paths from '../paths';

export default () => {
  return gulp.src(paths.font.src)
    .pipe(plumber())
    .pipe(newer(paths.font.dest))
    .pipe(fonter({formats: ['ttf', 'woff']}))
    .pipe(gulp.dest(paths.font.dest))
    .pipe(ttf2woff2())
    .pipe(gulp.dest(paths.font.dest))
};