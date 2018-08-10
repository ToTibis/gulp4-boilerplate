module.exports = function() {
	$.gulp.task('sass', function() {
		return $.gulp.src($.path.src.sass, {since: $.gulp.lastRun('sass')})
		.pipe($.loadPlugin.sass().on('error', $.loadPlugin.sass.logError))
		.pipe($.loadPlugin.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false,
			grid: true
		}))
		.pipe($.gcmq())
		.pipe($.gscc({
			preserve: false
		}))
		.pipe($.loadPlugin.csso())
		.pipe($.gulp.dest($.path.build.css))
		.pipe($.browserSync.stream())
	});
};