module.exports = function() {
	$.gulp.task('sass-libs', function() {
		return $.gulp.src($.path.src.sassLibs)
		// .pipe($.loadPlugin.sourcemaps.init())
		.pipe($.loadPlugin.sass().on('error', $.loadPlugin.sass.logError))
		.pipe($.loadPlugin.autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false,
			grid: true
		}))
		.pipe($.loadPlugin.csso())
		// .pipe($.loadPlugin.sourcemaps.write())
		.pipe($.gulp.dest($.path.build.css))
		.pipe($.browserSync.reload({
			stream: true
		}))
	});
};