module.exports = function() {

  $.gulp.task('images:development', function () {
    return $.gulp.src($.path.src.img).pipe($.gulp.dest($.path.build.img));
  });

  $.gulp.task('images:production', function () {
    return $.gulp.src($.path.src.img)
      .pipe($.cache(
        $.image({
          pngquant: ['--speed=1', '--force', 256],
          optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
          zopflipng: true,
          jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
          mozjpeg: ['-optimize', '-progressive'],
          gifsicle: true,
          svgo: true,
          concurrent: 10,
          quiet: false
        })
      ))
      .pipe($.gulp.dest($.path.build.img));
  });

};