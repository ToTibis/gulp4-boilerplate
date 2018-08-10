'use strict';

global.$ = {
	gulp: require('gulp'),
	loadPlugin: require('gulp-load-plugins')(),
	browserSync: require('browser-sync').create(),
	gcmq: require('gulp-group-css-media-queries'),
	gscc: require('gulp-strip-css-comments'),
	path: {
		tasks: require('./gulp/config/tasks.js'),
		build: {
			html: 'build/',
			css: 'build/css/',
			js: 'build/js/',
			img: 'build/img/',
			svg: 'build/img/svg/',
			fonts: 'build/fonts/'
		},
		src: {
			html: 'src/*.html',
			sass: 'src/sass/*.scss',
			js: 'src/js/*.js',
			img: 'src/img/*.*',
			svg: 'src/img/svg/*.svg',
			sprites: 'src/img/sprites/*.*',
			fonts: 'src/fonts/**/*.*'
		},
		watch: {
			html: 'src/**/*.html',
			sass: 'src/sass/**/*.scss',
			js: 'src/js/*.js',
			img: 'src/img/*.*',
			svg: 'src/img/svg/*.svg',
			sprites: 'src/img/sprites/*.*',
			fonts: 'src/fonts/**/*.*'
		}
	},
};

$.path.tasks.forEach(function(taskPath) {
	require(taskPath)();
});

$.gulp.task('default', $.gulp.series(
	$.gulp.parallel('html', 'sass', 'js', 'img', 'svg', 'fonts', 'sprites'),
	$.gulp.parallel('watch', 'server')
	)
);