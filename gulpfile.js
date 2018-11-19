const gulp = require('gulp'),
      sass = require('gulp-sass'),
      browserSync = require('browser-sync').create(),
      useref = require('gulp-useref'),
      uglify = require('gulp-uglify'),
      gulpIf = require('gulp-if'),
      cssnano = require('gulp-cssnano'),
      imagemin = require('gulp-imagemin'),
      cache = require('gulp-cache'),
      del = require('del');

const working_dir = 'Bootstrap Junk'

gulp.task('sass', function() {
    return gulp.src(`${working_dir}/scss/**/*.scss`)
        .pipe(sass())
        .pipe(gulp.dest(`${working_dir}/css`))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: working_dir
        },
    });
});

gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch(`${working_dir}/scss/**/*.scss`, ['sass']);
    gulp.watch(`${working_dir}/*.html`, browserSync.reload);
    gulp.watch(`${working_dir}/js/**/*.js`, browserSync.reload);
});

// build testing

gulp.task('images', function(){
    return gulp.src(`${working_dir}/images/**/*.+(png|jpg|gif|svg)`)
        .pipe(imagemin())
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('build', ['sass', 'images'], function(){
    return gulp.src(`${working_dir}/*.html`)
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
})
