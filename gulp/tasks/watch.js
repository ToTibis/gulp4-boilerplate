module.exports = function() {
	$.gulp.task('watch', function(){
		$.gulp.watch($.path.watch.sass, $.gulp.series('sass:development'));
		$.gulp.watch($.path.watch.js, $.gulp.series('js:development'));
		$.gulp.watch($.path.watch.fonts, $.gulp.series('fonts'));
		$.gulp.watch($.path.watch.img, $.gulp.series('img:development'));
		$.gulp.watch($.path.watch.svg, $.gulp.series('svg'));
		$.gulp.watch($.path.watch.html, $.gulp.series('html'));

	})
};