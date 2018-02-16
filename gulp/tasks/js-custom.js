module.exports = function() {
	$.gulp.task('js-custom', function() {
		return $.gulp.src($.path.src.jsCustom)
		.pipe($.gulp.dest($.path.build.js))
		.pipe($.browserSync.reload({
			stream: true
		}))
	});
};