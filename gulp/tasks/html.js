module.exports = function() {
	$.gulp.task('html', function() {
		return $.gulp.src($.path.src.html, {since: $.gulp.lastRun('html')})
		.pipe($.loadPlugin.rigger())
		.pipe($.gulp.dest($.path.build.html))
		.on('end', $.browserSync.reload)
	});
};