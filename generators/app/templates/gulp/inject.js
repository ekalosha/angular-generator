'use strict';

var path = require('path');
var gulp = require('gulp');
var $ = require('./util.js');

/*-------------------------------------------------
    for more understanding created aliases for paths
---------------------------------------------------*/
var src = $.gulpVars.app.src;
var temp = $.gulpVars.app.temp;
var jsPath = path.join(src, $.gulpVars.js.root, $.gulpVars.js.src);
var cssPath = path.join(src, $.gulpVars.css.root, $.gulpVars.css.src);
var indexPath = path.join(temp, '/index.html');

// format ignorePaths from array
function ignor ( dir, ignores ) {
    var res = [];
    if ( String(ignores) === ignores ) return res;
        for ( var key = 0; key < ignores.length; key ++ ) {
            if ( ignores[key] ) {
                res.push( path.join('!'+src+dir+ignores[key]) );
            }
        }
    return res;
}

// package inject-bower dependencies
// "wiredep": "^4.0.0",
gulp.task('inject-bower', function() { return injectBower(); });
/*-------------------------------------------------
    goes here to customize "wiredep"
---------------------------------------------------*/
var wiredepOptions = {
    // exclude: [/\/bootstrap\.js$/, /\/bootstrap\.css/],
    // directory: './bower_components',
    // fileTypes: {
    //  fileExtension: {
    //      replace: {
    //          js: function ( path ) {
    //              return '<script src="'+path.replace(/([\.\/])*bower_components\//, '')+'" type="text/javascript"></script>';
    //          },
    //          css: function ( path ) {
    //              return '<link rel="stylesheet" href="'+path.replace(/([\.\/])*bower_components\//, '')+'">';
    //          }
    //      }
    //  }
    // }
};
function injectBower () {
    // creating index to dev server from source template
    return gulp
        .src( indexPath )
        .pipe( $.wiredep.stream(wiredepOptions) )
        .pipe( gulp.dest(temp) )
        .pipe( $.browserSync.stream() );
}



// package inject-scripts dependencies
// "gulp-inject": "^4.1.0",
// "gulp-angular-filesort": "^1.1.1",
gulp.task('inject-scripts', function() { return injectAngular(); });
/*-------------------------------------------------
    goes here to customize inject "inject"
---------------------------------------------------*/
// var srcReplace = src.replace(/[\.\/]/g,'');
var injectOptions = {
    addRootSlash: false,
    addPrefix: '..',
    // transform: function ( path ) {
    //  if ( /.js/g.test(path) ) {
    //      return '<script src="'+path.replace(new RegExp('^'+srcReplace+'\/*','g'), '')+'" type="text/javascript"></script>';
    //  } else if ( /.css/g.test(path) ) {
    //      return '<link rel="stylesheet" href="'+path.replace(new RegExp('^'+srcReplace+'\/*','g'), '')+'">';
    //  }
    // }
};
function injectAngular () {
    return gulp
        .src( indexPath )
        .pipe( $.inject(angularFilter(), injectOptions) )
        .pipe( gulp.dest(temp) )
        .pipe( $.browserSync.stream() );
}
function angularFilter () {
    // before inject sortin by angular rules
    return gulp
        .src( [jsPath].concat(ignor($.gulpVars.js.root, $.gulpVars.js.ignores)) )
        .pipe( $.angularFilesort() )
        .on('error', function ( error ) {
            console.log( 'ERROR:[ Angular-Filesort ]', String(error) );
            this.emit('end');
        });
}



// package inject-scripts dependencies
// "gulp-inject": "^4.1.0",
gulp.task('inject-style', function() {
    return injectStyle( gulp.src([cssPath, path.join(temp, '**/*.css')].concat(ignor($.gulpVars.css.root, $.gulpVars.css.ignores))) );
});
function injectStyle ( styles ) {
    return gulp
        .src( indexPath )
        .pipe( $.inject(styles, injectOptions) )
        .pipe( gulp.dest(temp) )
        .pipe( $.browserSync.stream() );
}


// package inject dependencies
// "wiredep": "^4.0.0",
// "main-bower-files": "^2.13.1",
// "gulp-filter": "^4.0.0",
// "gulp-inject": "^4.1.0",
// "gulp-htmlmin": "^2.0.0",
// "gulp-angular-filesort": "^1.1.1",
// "gulp-angular-templatecache": "^2.0.0",
gulp.task('inject', ['clean', 'preprocessor'], function () {
    return gulp
        .src( path.join(src, '/index.html') )
        .pipe( $.replace('{BASE_URL}', $.gulpVars.config&&$.gulpVars.config.baseUrl ? $.gulpVars.config.baseUrl : '/') )
        .pipe( $.wiredep.stream(wiredepOptions) )
        .pipe( $.inject(gulp.src([cssPath, path.join(temp, '**/*.css')].concat(ignor($.gulpVars.css.root, $.gulpVars.css.ignores))), injectOptions) )
        .pipe( $.inject(angularFilter(), injectOptions) )
        .pipe( gulp.dest(temp) );
});
