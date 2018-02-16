module.exports = function() {
	$.gulp.task('img', function() {
		return $.gulp.src($.path.src.img)
		.pipe($.gulp.dest($.path.build.img))
		.pipe($.browserSync.reload({
			stream: true
		}))
	});
};