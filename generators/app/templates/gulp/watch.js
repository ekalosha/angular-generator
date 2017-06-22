'use strict';

var gulp = require('gulp');
var path = require('path');
var $ = require('./util.js');

/*-------------------------------------------------
    for more understanding created aliases for paths
---------------------------------------------------*/
var typescriptPath = path.join($.gulpVars.app.src, $.gulpVars.js.root, '/**/*.ts');
var coffeescriptPath = path.join($.gulpVars.app.src, $.gulpVars.js.root, '/**/*.cofee');
var stylusPath = path.join($.gulpVars.app.src, $.gulpVars.css.root, '/**/*.styl');
var lessPath = path.join($.gulpVars.app.src, $.gulpVars.css.root, '/**/*.less');
var sassPath = path.join($.gulpVars.app.src, $.gulpVars.css.root, '/**/*.{sass,scss}');

var jsPath = path.join($.gulpVars.app.src, $.gulpVars.js.root, '/**/*.js');
var cssPath = [path.join($.gulpVars.app.src, $.gulpVars.css.root, '/**/*.css'), path.join($.gulpVars.app.temp, '/**/*.css')];
var assetsPath = path.join($.gulpVars.app.src, $.gulpVars.assets.root, '/**/*.*');
var htmlPath = [$.gulpVars.app.src+'/**/**/*.html'];
var bower = path.join('.', '/bower.json');

/*-------------------------------------------------
    WATCHERS
    By default watch all preprocessing files
---------------------------------------------------*/
gulp.task('watch', function ( done ) {
    /*-------------------------------------------------
        When preprocessors source is changed
    ---------------------------------------------------*/
    gulp.watch(typescriptPath, ['typescript']);
    gulp.watch(coffeescriptPath, ['coffeescript']);
    gulp.watch(stylusPath, ['stylus']);
    gulp.watch(lessPath, ['less']);
    gulp.watch(sassPath, ['sass']);
    /*-------------------------------------------------
        When config is changed
    ---------------------------------------------------*/
    gulp.watch('./environment/**/*.*', ['env-reload']);
    /*-------------------------------------------------
        When source is changed
    ---------------------------------------------------*/
    gulp.watch(assetsPath, function ( event ) { gulp.src( event.path ).pipe( $.browserSync.stream() ); });
    gulp.watch(htmlPath,  function ( event ) { gulp.src( event.path ).pipe( $.browserSync.stream() ); });
    gulp.watch(cssPath, ['inject-style']);
    gulp.watch(jsPath, ['inject-scripts']);
    gulp.watch(bower, ['inject-bower']);

});


// package serve/serve-reload dependencies
// "browser-sync": "^2.14.0",
// "browser-sync-spa": "^1.0.3",
$.browserSync.use( $.syncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));
gulp.task('server-prod', function () { server( './', [$.gulpVars.app.dist]); });
gulp.task('server-dev', function () { server( './', [$.gulpVars.app.temp, $.gulpVars.app.src, './']); });
function server ( start, dirs ) {
    $.browserSync.init({
        startPath: start,
        // browser: $.gulpVars.browserSync.browser,
        port: $.gulpVars.browserSync.port,
        server: {
            baseDir: dirs
        },
    });
}
