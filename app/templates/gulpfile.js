'use strict';

var gulp = require('gulp');
var webpack = require('webpack');

var gutil = require('gulp-util');
var argv = require('yargs').argv;

var env = require('./configs/environments/index');

var webpackConf = require(env.inProject(env.DIR_CONFIG, 'webpack/build.config'))('production');

var src = env.inSrc();
var assets = env.inDist('assets');

// js check
gulp.task('hint', function() {
    var jshint = require('gulp-jshint')
    var stylish = require('jshint-stylish')

    return gulp.src([
            '!' + src + '/scripts/vendor/**/*.js',
            src + '/scripts/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
})

// clean assets
gulp.task('clean', ['hint'], function() {
    var clean = require('gulp-clean')

    return gulp.src(assets, {
        read: true
    }).pipe(clean())
})

// run webpack pack
gulp.task('pack', ['clean'], function(done) {
    webpack(webpackConf, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err)
        gutil.log('[webpack]', stats.toString({
            colors: true
        }))
        console.log(argv)
        done()
    })
})

// html process
gulp.task('default', ['pack'])
    /*gulp.task('default', ['pack'], () => {
        var replace = require('gulp-replace')
        var htmlmin = require('gulp-htmlmin')

        return gulp
            .src(assets + '/*.html')
            // @see https://github.com/kangax/html-minifier
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(gulp.dest(assets))
    })*/

// deploy assets to remote server
gulp.task('deploy', function() {
    var sftp = require('gulp-sftp')

    return gulp.src(assets + '/**')
        .pipe(sftp({
            host: '10.238.253.9',
            remotePath: '/usr/webApp/java/tomcat/carry6-static/data-center/test', // 执行前修改预发布地址
            user: 'root',
            pass: 'abc@123'
        }))
})