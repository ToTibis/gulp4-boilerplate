const
		configProd = require('../../webpack/config.production.js'),
		configDev = require('../../webpack/config.development.js');

module.exports = function() {
	$.gulp.task('js:development', function() {
		return $.gulp.src($.path.src.js)
				.pipe($.webpackStream(configDev))
				.pipe($.gulp.dest($.path.build.js))
				.pipe($.browserSync.reload({
					stream: true
				}))
	});

	$.gulp.task('js:production', function() {
		return $.gulp.src($.path.src.js)
				.pipe($.webpackStream(configProd))
				.pipe($.gulp.dest($.path.build.js))
	});

};
