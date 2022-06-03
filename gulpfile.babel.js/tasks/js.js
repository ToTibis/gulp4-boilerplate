import {isProduction} from '../index';
import gulp from 'gulp';
const webpack = require('webpack-stream');
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');

import {browserSyncInstance} from './server';
import paths from '../paths';

const
  configProd = require('../webpack/config.production.js'),
  configDev = require('../webpack/config.development.js')
;

export default () => {
  return gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(webpack(isProduction ? configProd : configDev))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(gulpIf(!isProduction, browserSyncInstance.reload({stream: true})))
};