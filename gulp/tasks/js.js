module.exports = function() {
	$.gulp.task('js', function() {
		return $.gulp.src($.path.src.js, {since: $.gulp.lastRun('js')})
		.pipe($.loadPlugin.rigger())
		.pipe($.loadPlugin.babel({
			presets: ['es2015']
		}))
		.pipe($.loadPlugin.uglify())
		.pipe($.gulp.dest($.path.build.js))
		.pipe($.browserSync.reload({
			stream: true
		}))
	});
};