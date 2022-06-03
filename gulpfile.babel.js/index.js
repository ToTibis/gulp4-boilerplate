import gulp from 'gulp';
import pug from './tasks/pug';
import scss from './tasks/scss';
import js from './tasks/js';
import img from './tasks/img';
import font from './tasks/font';
import svg from './tasks/svg';
import clean from './tasks/cleaning';
import server from './tasks/server';
import paths from './paths'

const watcher = () => {
  gulp.watch(paths.pug.watch, pug);
  gulp.watch(paths.scss.watch, scss);
  gulp.watch(paths.js.watch, js);
  gulp.watch(paths.img.watch, img);
  gulp.watch(paths.font.watch, font);
  gulp.watch(paths.svg.watch, svg);
};

export const isProduction = process.argv.includes('--production');

const build = gulp.series(clean, gulp.parallel(pug, scss, js, img, font, svg));
const dev = gulp.series(build, gulp.parallel(watcher, server));

export {pug, clean, scss, js, img, font, svg}
export default isProduction ? build : dev;

