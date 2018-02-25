'use strict';

var
    gulp = require('gulp'),
    watch = require('gulp-watch'), // следим за изменениями файлов
    pug = require('gulp-pug'), //шаблонизатор pug
    prefixer = require('gulp-autoprefixer'), // автопрефиксы
    uglify = require('gulp-uglify'), // минификация js
    sass = require('gulp-sass'), // работа с препроцессором SCSS
    csso = require('gulp-csso'), // Минификация CSS-файлов
    imagemin = require('gulp-imagemin'), // сжимаем изображения
    rimraf = require('rimraf'), //rm -rf для ноды
    browserSync = require("browser-sync"), // локальный dev сервер с livereload, так же с его помощью мы сможем сделать тунель на наш localhost
    reload = browserSync.reload;

//Пропишем пути
var path = {
    build: {
        html: '../build/',
        js: '../build/js/',
        css: '../build/css/',
        img: '../build/img/',
        fonts: '../build/fonts/'
    },
    src: { //исходники
        pug: '../src/templates/*.pug',
        js: '../src/js/index.js',
        style: '../src/style/style.scss',
        img: '../src/img/**/*.*',
        fonts: '../src/fonts/**/*.*'
    },
    watch: { //отслеживание
        pug: '../src/**/*.pug',
        js: '../src/js/**/*.js',
        style: '../src/style/**/*.scss',
        img: '../src/img/**/*.*',
        fonts: '../src/fonts/**/*.*'
    },
    clean: '../build'
};

//Конфигурация сервера
var config = {
    server: {
        baseDir: "../build"
    },
    tunnel: true,
    host: 'localhost',
    port: 8000,
    logPrefix: "Frontend"
};

//обрабатываем html
gulp.task('html:build', function() {
    gulp.src(path.src.pug)
        .pipe(pug())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({ stream: true }));
});

//обрабатываем js
gulp.task('js:build', function() {
    gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream: true }));
});

// собираем стили
gulp.task('style:build', function() {
    gulp.src(path.src.style)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(csso())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream: true }));
});

//собираем изображения
gulp.task('image:build', function() {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({ stream: true }));
});

//копируем шрифты
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts))
});

//общий build
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

//отслеживание изменений
gulp.task('watch', function() {
    watch([path.watch.pug], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

//сервер
gulp.task('webserver', function() {
    browserSync(config);
});

//очистка
gulp.task('clean', function(cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);