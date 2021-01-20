module.exports = function() {
	$.gulp.task('svg', function() {

		return $.gulp.src($.path.src.svg)
			.pipe($.svgmin({
				plugins: [
					{ removeViewBox: false }, { removeDimensions: true }, { removeXMLNS: true }, {removeRasterImages: true}, {removeStyleElement: true},
					{
						removeAttrs: {
							attr: ['fill', 'stroke']
						}
					}
				]
			}))
			.pipe($.svgStore())
			.pipe($.gulp.dest($.path.build.img))
	});
};
