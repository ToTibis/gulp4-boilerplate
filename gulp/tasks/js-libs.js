module.exports = function() {
	$.gulp.task('js-libs', function() {
		return $.gulp.src($.path.src.jsLibs)
		.pipe($.loadPlugin.rigger())
		.pipe($.loadPlugin.uglify())
		.pipe($.gulp.dest($.path.build.js))
		.pipe($.browserSync.reload({
			stream: true
		}))
	});
};