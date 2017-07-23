/* globals require, exports */

'use strict';

// gulp plugins
const gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer     = require('vinyl-buffer'),
    babelify = require("babelify");

// Script task
gulp.task('scripts', function () {
    browserify('app/scripts/app.js', {debug: true})
        .transform(babelify.configure({
            presets: ['es2015']
        }))
        .require('./app/scripts/app.js', {entry: true})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('watch', function () {
    gulp.watch(['app/scripts' + '/**/*.js'], ['scripts']);
    gulp.watch(['./app/**/*.html'], ['html']);
});

gulp.task('build', ['scripts'], function () {
});
