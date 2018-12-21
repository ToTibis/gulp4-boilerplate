module.exports = function() {

	$.gulp.task('js:development', function() {
		return $.browserify({
			entries: [$.path.src.js],
			debug: true,
			cache: {},
			packageCache: {},
			plugin: [$.watchify]
		})
		.transform($.babel.configure({presets: ['@babel/preset-env']}))
		.bundle()
		.on('error', function(error) {console.log(`Error : ${error.message}`);this.emit('end');})
		.pipe($.source('bundle.min.js'))
		.pipe($.buffer())
		.pipe($.sourcemaps.init({ loadMaps: true }))
		.pipe($.sourcemaps.write('./'))
		.pipe($.gulp.dest($.path.build.js))
		.pipe($.browserSync.reload({
			stream: true
		}))
	});

	$.gulp.task('js:production', function() {
		return $.browserify({
			entries: [$.path.src.js],
			debug: true,
			cache: {},
			packageCache: {},
			plugin: [$.watchify]
		})
		.transform($.babel.configure({presets: ['@babel/preset-env']}))
		.bundle()
		.pipe($.source('bundle.min.js'))
		.pipe($.buffer())
		.pipe($.stripJs())
		.pipe($.uglify())
		.pipe($.gulp.dest($.path.build.js))
	});

};