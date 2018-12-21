module.exports = function() {
	$.gulp.task('svg', function() {
		return $.gulp.src($.path.src.svg)
		.pipe($.svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe($.cheerio({
			run: function($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe($.replace('&gt;', '>'))
		.pipe($.svgSprite({
			mode: {
				symbol: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe($.gulp.dest($.path.build.img))
	});
};