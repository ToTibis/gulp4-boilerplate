import gulp from 'gulp';
const imageMin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const newer = require('gulp-newer');
const webp = require('gulp-webp');
const gulpIf = require('gulp-if');

import paths from '../paths';
import {isProduction} from '../index';

export default () => {
  return gulp.src(paths.img.src)
    .pipe(plumber())
    .pipe(newer(paths.img.dest))
    .pipe(webp())
    .pipe(gulp.dest(paths.img.dest))
    .pipe(gulp.src(paths.img.src))
    .pipe(newer(paths.img.dest))
    .pipe(gulpIf(isProduction, imageMin({verbose: true})))
    .pipe(gulp.dest(paths.img.dest))
};
