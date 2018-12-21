module.exports = function() {
	$.gulp.task('watch', function(){
		$.gulp.watch($.path.src.html, $.gulp.series('html'));
		$.gulp.watch($.path.src.sass, $.gulp.series('sass:development'));
		$.gulp.watch($.path.src.js, $.gulp.series('js:development'));
		$.gulp.watch($.path.src.fonts, $.gulp.series('fonts'));
		$.gulp.watch($.path.src.img, $.gulp.series('img:development'));
		$.gulp.watch($.path.src.svg, $.gulp.series('svg'));
	})
}