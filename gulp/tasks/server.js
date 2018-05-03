module.exports = function() {
	$.gulp.task('server', function() {
		$.browserSync.init({
			injectChanges: true,
			server: {
				baseDir: "./build"
			},
			notify: false
		});
	});
};