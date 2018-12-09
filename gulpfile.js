"use strict"

//import modules we need.
var gulp = require('gulp');
var conn = require('gulp-connect');
var open = require('gulp-open');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');


//configuration values
var config = {
    port: 5501,
    baseUr: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        indexJs: './src/index.js',
        css: [
            'node_modules/bootstrap/dist/css/*.css',
            'node_modules/bootstrap/dist/css/*.map'
        ],
        dist: './dist'
    }
}

//launch a local server for developement.
gulp.task('conn', function(){
    conn.server({
        root: ['dist'],
        port: config.port,
        baseUr: config.baseUr,
        livereload: true
    });
});

//open the url on the server.
gulp.task('open',['conn'], function(){
    gulp.src('dist/index.html')
    .pipe(open({
        uri: config.baseUr + ':' + config.port + '/'
    }));
});

//copy html to dist
gulp.task('html', function(){
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(conn.reload());
});

//transform jsx to js
gulp.task('js', function(){
    browserify(config.paths.indexJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist))
        .pipe(conn.reload());    
});

//manage our css
gulp.task('css', function(){
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'))
});

//watch the file and reload
gulp.task('watch', function(){
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);

});

//default task
gulp.task('default', ['html', 'js', 'css', 'open', 'watch']);
