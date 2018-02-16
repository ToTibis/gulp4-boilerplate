module.exports = function() {
	$.gulp.task('compressing', function() {
		return $.gulp.src($.path.src.img)
		.pipe($.loadPlugin.tinypng('your API'))
		.pipe($.gulp.dest($.path.build.img))
	});
	$.gulp.task('delete-folder', function() {
		return $.gulp.src('.gulp')
		.pipe($.loadPlugin.clean());
	})
	$.gulp.task('tinypng', $.gulp.series('compressing', 'delete-folder'));
};