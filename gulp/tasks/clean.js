module.exports = function() {
	$.gulp.task('clean', function() {
		$.cache.clearAll();
		return $.del('./build');
	});
};