module.exports = function() {

	$.gulp.task('img:development', function () {
		return $.gulp.src($.path.src.img).pipe($.gulp.dest($.path.build.img));
	});

	$.gulp.task('img:production', function () {
		return $.gulp.src($.path.src.img)
		.pipe($.cache($.imagemin([
			$.imagemin.gifsicle({interlaced: true}),
			$.imagemin.jpegtran({progressive: true}),
			$.jpegRecompress({
				loops: 5,
				min: 75,
				quality: 'medium'
			}),
			$.imagemin.svgo({
				plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
				]
			}),
			$.imagemin.optipng({optimizationLevel: 3}),
			$.pngQuant({quality: '70-80', speed: 5})
			], {
				verbose: true
			})))
		.pipe($.gulp.dest($.path.build.img));
	});

};