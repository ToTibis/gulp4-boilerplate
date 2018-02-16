'use strict';

global.$ = {
	gulp: require('gulp'),
	loadPlugin: require('gulp-load-plugins')(),
	browserSync: require('browser-sync').create(),
	smartgrid: require('smart-grid'),
	gcmq: require('gulp-group-css-media-queries'),
	path: {
		tasks: require('./gulp/config/tasks.js'),
		build: {
			html: 'build/',
			css: 'build/css/',
			js: 'build/js/',
			img: 'build/img/',
			fonts: 'build/fonts/'
		},
		src: {
			html: 'src/*.html',
			sass: 'src/sass/main.scss',
			sassLibs: 'src/sass/libs.scss',
			jsLibs: 'src/js/libs.js',
			jsCustom: 'src/js/main.js',
			img: 'src/img/*.*',
			sprites: 'src/img/sprites/*.*',
			fonts: 'src/fonts/**/*.*'
		},
		watch: {
			html: 'src/**/*.html',
			sass: 'src/sass/main.scss',
			sassLibs: 'src/sass/libs.scss',
			jslibs: 'src/js/libs.js',
			jsCustom: 'src/js/main.js',
			img: 'src/img/*.*',
			sprites: 'src/img/sprites/*.*',
			fonts: 'src/fonts/**/*.*'
		}
	},
	gridSettings: {
		outputStyle: 'scss', /* less || scss || sass || styl */
		columns: 15, /* number of grid columns */
		offset: '30px', /* gutter width px || % */
		mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
		container: {
			maxWidth: '1200px', /* max-width оn very large screen */
			fields: '30px' /* side fields */
		},
		breakPoints: {
			xl: {
				width: '1400px', /* -> @media (max-width: 1400px) */
			},
			lg: {
				width: '1200px',
			},
			md: {
				width: '992px'
			},
			sm: {
				width: '768px',
			},
			xs: {
				width: '480px'
			},
			s: {
				width: '320px'
			}
		}
	}
};

$.path.tasks.forEach(function(taskPath) {
	require(taskPath)();
});

$.gulp.task('default', $.gulp.series(
	$.gulp.parallel('html', 'sass', 'sass-libs', 'js-custom', 'js-libs', 'img', 'fonts', 'sprites'),
	$.gulp.parallel('watch', 'server')
	)
);
$.smartgrid('./src/sass/plug/grid/', $.gridSettings);