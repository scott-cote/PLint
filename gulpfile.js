var gulp = require('gulp');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var insert = require('gulp-insert');
var chmod = require('gulp-chmod');
var merge = require('merge-stream');
var generator = require('gulp-parsergen');

gulp.task('parser', function() {
  return gulp.src('plsql.grammar')
    .pipe(generator())
    .pipe(rename(function (path) { path.basename = 'parser'; path.extname = '.js'; }))
    .pipe(gulp.dest('bin'));
});

gulp.task('scripts', ['parser'], function() {
  var src = gulp.src('src/*.es6')
    .pipe(babel())
    .pipe(rename(function (path) { path.extname = ".js"; }))
    .pipe(gulp.dest('bin'));
  var cli = gulp.src(['cli.es6','test.es6'])
    .pipe(babel())
    .pipe(rename(function (path) { path.extname = ".js"; }))
    .pipe(insert.prepend('#!/usr/bin/env node\n\n'))
    .pipe(chmod(755))
    .pipe(gulp.dest('bin'));
  return merge(src, cli);
});

gulp.task('default', ['scripts']);
