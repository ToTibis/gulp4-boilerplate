module.exports = function() {
	$.gulp.task('server', function() {
		$.browserSync.init({
			server: {
				baseDir: './build'
			},
			notify: false,
			open: true
		});
	});
}