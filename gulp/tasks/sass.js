module.exports = function() {
	$.gulp.task('sass', function() {
		return $.gulp.src($.path.src.sass, {since: $.gulp.lastRun('sass')})
		.pipe($.loadPlugin.sass().on('error', $.loadPlugin.sass.logError))
		.pipe($.loadPlugin.autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false,
			grid: true
		}))
		.pipe($.gcmq())
		.pipe($.loadPlugin.csso())
		.pipe($.gulp.dest($.path.build.css))
		.pipe($.browserSync.reload({
			stream: true
		}))
	});
};