module.exports = function() {
	$.gulp.task('fonts', function() {
		return $.gulp.src($.path.src.fonts, {since: $.gulp.lastRun('fonts')})
		.pipe($.gulp.dest($.path.build.fonts))
		.pipe($.browserSync.reload({
			stream: true
		}))
	});
};