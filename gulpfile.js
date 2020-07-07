'use strict';

global.$ = {
    gulp: require('gulp'),
    sass: require('gulp-sass'),
    sourcemaps: require('gulp-sourcemaps'),
    autoprefixer: require('gulp-autoprefixer'),
    browserSync: require('browser-sync').create(),
    uglify: require('gulp-uglify'),
    del: require('del'),
    stripCss: require('gulp-strip-css-comments'),
    imagemin: require('gulp-imagemin'),
    cache: require('gulp-cache'),
    jpegRecompress: require('imagemin-jpeg-recompress'),
    pngQuant: require('imagemin-pngquant'),
    svgSprite: require('gulp-svg-sprite'),
    replace: require('gulp-replace'),
    svgmin: require('gulp-svgmin'),
    cheerio: require('gulp-cheerio'),
    aliases: require('gulp-style-aliases'),
    webpack: require('webpack'),
    webpackStream: require('webpack-stream'),
    pug: require('gulp-pug'),
    path: {
        tasks: require('./gulp/config/tasks.js'),
        src: {
            html: 'src/html/pages/*.pug',
            sass: 'src/sass/*.scss',
            js: 'src/js/main.js',
            fonts: 'src/fonts/**/*.*',
            img: 'src/img/images/**/*.*',
            svg: 'src/img/sprite/*.svg'
        },
        build: {
            html: 'build/',
            css: 'build/css/',
            js: 'build/js/',
            fonts: 'build/fonts/',
            img: 'build/img/'
        },
        watch: {
            html: 'src/html/**/*.pug',
            sass: 'src/sass/**/*.scss',
            js: ['src/js/**/*.js', 'src/js/svelte/**/*.svelte'],
            img: 'src/img/images/**/*.*',
            svg: 'src/img/sprite/*.svg',
            fonts: 'src/fonts/**/*.*'
        }
    }
};

$.sass.compiler = require('node-sass');

$.path.tasks.forEach((taskPath) => require(taskPath)());

$.gulp.task('common', $.gulp.series('clean', $.gulp.parallel('html', 'fonts', 'svg')));

$.gulp.task('dev', $.gulp.series('sass:development', 'js:development', 'img:development',));

$.gulp.task('build', $.gulp.series('common', $.gulp.parallel('sass:production', 'js:production', 'img:production',),
    function completion(done) {
        done();
        process.exit();
    }
));

$.gulp.task('default', $.gulp.series('common', $.gulp.parallel('dev'), $.gulp.parallel('watch', 'server')));