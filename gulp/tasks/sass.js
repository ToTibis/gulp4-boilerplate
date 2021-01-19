module.exports = function() {

	$.gulp.task('sass:development', function () {
		return $.gulp.src($.path.src.sass, {since: $.gulp.lastRun('sass:development')})
			.pipe($.debug({title: 'cache pass:'}))
			.pipe($.dependents())
			.pipe($.debug({title: 'dependents:'}))
			.pipe($.sourcemaps.init())
			.pipe($.sass({outputStyle: 'compact'}).on('error', $.sass.logError))
			.pipe($.autoprefixer())
			.pipe($.sourcemaps.write('./'))
			.pipe($.gulp.dest($.path.build.css))
			.pipe($.browserSync.stream())
	});

	$.gulp.task('sass:production', function () {
		return $.gulp.src($.path.src.sass)
			.pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
			.pipe($.autoprefixer())
			.pipe($.stripCss())
			.pipe($.gulp.dest($.path.build.css))
	});

};