import gulp from 'gulp';
import svgmin from 'gulp-svgmin';
import svgStore from 'gulp-svgstore';

import paths from '../paths';

export default () => {
  return gulp.src(paths.svg.src)
    .pipe(svgmin({
      plugins: [
	      {
		      name: 'removeViewBox',
		      active: false
	      },
	      'removeDimensions',
	      'removeXMLNS',
	      'removeRasterImages',
	      'removeStyleElement',
      ]
    }))
    .pipe(svgStore())
    .pipe(gulp.dest(paths.svg.dest))
}
