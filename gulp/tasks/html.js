module.exports = function() {
	$.gulp.task('html', function() {
		let beautifyOptions = {
			indent_with_tabs: true,
			indentSize: 2
		}
		return $.gulp.src($.path.src.html)
		.pipe($.fileinclude({
			prefix: '~'
		}))
		.pipe($.htmlBeautify(beautifyOptions))
		.pipe($.gulp.dest($.path.build.html))
		.on('end', $.browserSync.reload)
	});

}
