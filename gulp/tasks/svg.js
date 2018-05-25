module.exports = function() {
	$.gulp.task('svg', function() {
		return $.gulp.src($.path.src.svg)
		.pipe($.loadPlugin.svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe($.loadPlugin.cheerio({
			run: function($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe($.loadPlugin.replace('&gt;', '>'))
		.pipe($.loadPlugin.svgSprite({
			mode: {
				symbol: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe($.gulp.dest($.path.build.svg))
	});
};