module.exports = function() {
	$.gulp.task('sprites', function() {
		var spriteData = $.gulp.src($.path.src.sprites).pipe($.loadPlugin.spritesmith({
			imgName:   '../img/sprite.png',
			padding:   5,
			cssName:   '_sprite.scss',
			algorithm: 'top-down'
		}));
		spriteData.img
		.pipe($.gulp.dest($.path.build.img))
		spriteData.css
		.pipe($.gulp.dest('src/sass/plug/'))
		return spriteData
		.pipe($.browserSync.reload({
			stream: true
		}))
	});
};