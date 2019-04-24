const gulp = require('gulp');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');//оптимизатор js
var concat = require('gulp-concat');//объединение js
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
var babel = require("gulp-babel");

var path = {
    src:{
        style: "./src/style/scss/*.scss",
        script: "./src/script/**/*.js",
        html: "./src/index.html",
    },
    dist:{
        style: "./build/style",
        script: "./build/script",
        html: "./",
    }
}

sass.compiler = require('node-sass');

gulp.task('sass', function(){
    return gulp.src(path.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/style/css'))
});

function styles(){
    return gulp.src('./src/style/css/*.css')
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({level: 2}))
        .pipe(gulp.dest(path.dist.style))
}

function html() {
    return gulp.src(path.src.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(path.dist.html));
};

function scripts() {
    return gulp.src(path.src.script)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('script.js')) //слитие в единый файл
        .pipe(gulp.dest(path.dist.script))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.script))
};

// gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('html', html);
gulp.task('server', server);
gulp.task('styles', styles);


function server() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./src/style/scss/*.scss", gulp.series('sass')).on('change', browserSync.reload);
    gulp.watch("./src/script/**/*.js", gulp.series('scripts')).on('change', browserSync.reload);
    gulp.watch("./src/*.html", gulp.series('html')).on('change', browserSync.reload);
    gulp.watch("./src/style/css/style.css", gulp.series('styles')).on('change', browserSync.reload);
};

gulp.task('default', gulp.parallel('sass', scripts, styles, html, server));