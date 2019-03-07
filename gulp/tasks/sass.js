module.exports = function() {

	$.gulp.task('sass:development', function () {
		return $.gulp.src($.path.src.sass, {since: $.gulp.lastRun('sass:development')})
		.pipe($.sourcemaps.init())
		.pipe($.aliases({
			'~modules': 'node_modules'
		}))
		.pipe($.sass({outputStyle: 'compact'}).on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.sourcemaps.write('./'))
		.pipe($.gulp.dest($.path.build.css))
		.pipe($.browserSync.stream())
	});

	$.gulp.task('sass:production', function () {
		return $.gulp.src($.path.src.sass)
		.pipe($.aliases({
			'~modules': 'node_modules'
		}))
		.pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.stripCss())
		.pipe($.gulp.dest($.path.build.css))
	});
	
};