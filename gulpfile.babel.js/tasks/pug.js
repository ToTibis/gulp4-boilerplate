import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import gulp from 'gulp';

import {browserSyncInstance} from './server';
import paths from '../paths';

export default () => {
  return gulp.src(paths.pug.src)
    .pipe(plumber())
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.pug.dest))
    .on('end', browserSyncInstance.reload)
};
