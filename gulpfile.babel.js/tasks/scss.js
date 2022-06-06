import {isProduction} from '../index';
import gulp from 'gulp';
const dependents = require('gulp-dependents');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const debug = require('gulp-debug');
const sass = require('gulp-sass')(require('node-sass'));
const stripCssComments = require('gulp-strip-css-comments');

import paths from '../paths';
import {browserSyncInstance} from './server';

 const processScss = () => {
  return isProduction
    ? gulp.src(paths.scss.src)
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(stripCssComments())
      .pipe(gulp.dest(paths.scss.dest))
    : gulp.src(paths.scss.src, {since: gulp.lastRun(processScss)})
      .pipe(debug({title: 'cache pass:'}))
      .pipe(dependents())
      .pipe(debug({title: 'dependents:'}))
      .pipe(sourcemaps.init())
		  .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(paths.scss.dest))
      .pipe(browserSyncInstance.stream())
};

export default processScss;
