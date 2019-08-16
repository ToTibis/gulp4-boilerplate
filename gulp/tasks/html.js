module.exports = function() {
	$.gulp.task('html', function() {
		return $.gulp.src($.path.src.html)
			.pipe($.pug({
				pretty: true
			}))
			.pipe($.gulp.dest($.path.build.html))
			.on('end', $.browserSync.reload)
	});
};
