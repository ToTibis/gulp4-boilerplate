'use strict';

global.$ = {
	gulp: 						require('gulp'),
	fileinclude: 			require('gulp-file-include'),
	sass: 						require('gulp-sass'),
	sourcemaps:				require('gulp-sourcemaps'),
	autoprefixer:			require('gulp-autoprefixer'),
	browserSync:			require('browser-sync').create(),
	source: 					require('vinyl-source-stream'),
	buffer: 					require('vinyl-buffer'),
	browserify: 			require('browserify'),
	watchify: 				require('watchify'),
	babel: 					  require('babelify'),
	uglify: 					require('gulp-uglify'),
	del: 							require('del'),
	stripJs:  			 	require('gulp-strip-comments'),
	stripCss: 				require('gulp-strip-css-comments'),
	imagemin: 				require('gulp-imagemin'),
	cache: 						require('gulp-cache'),
	jpegRecompress: 	require('imagemin-jpeg-recompress'),
	pngQuant: 				require('imagemin-pngquant'),
	svgSprite: 				require('gulp-svg-sprite'),
	replace: 					require('gulp-replace'),
	svgmin: 					require('gulp-svgmin'),
	cheerio: 					require('gulp-cheerio'),
	htmlBeautify: 		require('gulp-beautify-code'),
	aliases:  				require('gulp-style-aliases'),

	path: {
		tasks: require('./gulp/config/tasks.js'),
		src: {
			html: 'src/html/**/*.html',
			sass: 'src/sass/*.scss',
			js: 'src/js/main.js',
			fonts: 'src/fonts/**/*.*',
			img: 'src/img/images/**/*.*',
			svg: 'src/img/sprite/*.svg'
		},
		build: {
			html: 'build/',
			css: 'build/css/',
			js: 'build/js/',
			fonts: 'build/fonts/',
			img: 'build/img/'
		}
	}
}

$.sass.compiler =	require('node-sass');

$.path.tasks.forEach(function(taskPath){
	require(taskPath)();
})

$.gulp.task('constant', $.gulp.series(
	'clean',
	$.gulp.parallel(
		'html',
		'fonts',
		'svg'
		)
	))

$.gulp.task('dev', 	$.gulp.series(
	'sass:development',
	'js:development',
	'img:development',
	));

$.gulp.task('build', $.gulp.series(
	'constant',
	$.gulp.parallel(
		'sass:production',
		'js:production',
		'img:production',
		),
	function completion(done){
		done(),
		console.log('\x1b[92m%s\x1b[0m', '\nCompilation completed successfully!'),
		process.exit();
	}
	));

$.gulp.task('default', $.gulp.series(
	'constant',
	$.gulp.parallel(
		'dev',
		),
	$.gulp.parallel(
		'watch',
		'server'
		)
	));

