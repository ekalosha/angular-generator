'use strict';

/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split into several files in the gulp directory
 *  because putting it all here was too long
 */
var path = require('path');
var gulp = require('gulp');
var $ = require('./gulp/util.js');

/**
 *  contains the variables used in other gulp files
 *  which defines tasks
 */
$.gulpVars = {
    browserSync: {
        port: 9000,
        browser: 'google chrome'
    },
    // root directory application
    app: {
        temp: './.tmp',
        dist: './dist',
        src: './source',
    },
    // js processing pathes
    js: {
        root: '/app',
        src: '/**/*.js',
        ignores: ['/**/*.mock.js'],
        typescript: '/index.ts',
        coffeescript: '/index.coffee',
    },
    // js processing pathes
    css: {
        root: '/styles',
        src: '/**/*.css',
        ignores: [],
        less: '/all.less',
        sass: '/all.sass',
        stylus: '/all.styl',
    },
    // images, fonts and others processing paths
    assets: {
        root: '/assets',
        img: '/images/**',
        font: '/fonts/**',
    },
    // default configs wich can be replace from environment
    config: {
        initSourceMap: false,
    }
};

/**
 *  This will load all js files in the gulp directory
 *  in order to load all gulp tasks
 */
for ( var fileName of ['preprocessors.js', 'inject.js', 'watch.js', 'build.js'] ) {
    // search a gulp tasks in directory gulp
    require( path.format({ dir: './gulp/', base: fileName }) );
}


/**
 *  Default task clean temporaries directories
 */
gulp.task('default', ['clean'], function ( done ) {
    console.log('default task - clean');
    done();
});


/*-------------------------------------------------
    package environment dependencies
    "gulp-token-replace": "^1.0.3",
    "gulp-rename": "^1.2.2",

     * rewrite config file
     * from template
---------------------------------------------------*/
function environment ( file ) {
    file&&(environment.current = file+'.json');
    // clear cash before require a json file
    var regCache = new RegExp(environment.current);
    for ( var name in require.cache ) {
        if ( regCache.test(name) ) {
            delete require.cache[name];
            break;
        }
    }
    var envPath = './environment/'+environment.current;
    // merge gulp configs with environment
    Object.assign($.gulpVars.config, {
        // addition
        timestamp: (new Date()).toJSON(),
        version: require('./package.json').version,
    // environment
    }, require(envPath) );

    var viewConfig = JSON.stringify($.gulpVars.config, null, 4);
    console.log('\nENVIRONMENT from => ', envPath,'\n', viewConfig,'\n');

    return gulp
        .src('./environment/config.template.js')
        .pipe( $.tokenReplace({ global: {config: viewConfig} }) )
        .pipe( $.rename( function ( path ) { path.basename = 'app-config'; }) )
        .pipe( gulp.dest(path.join($.gulpVars.app.src, $.gulpVars.js.root)) )
        .pipe( $.browserSync.stream() );
}
// already define configs
gulp.task('env-dev', [], function() { return environment('development'); });
gulp.task('env-prod', [], function() { return environment('production'); });
// NODE_ENV
gulp.task('env-node', [], function() { return environment(process.env.NODE_ENV||'development'); });
// reload current enveroment
gulp.task('env-reload', [], function() { return environment(); });


/*-------------------------------------------------
    package clean dependencies
    "del": "^2.2.2",
     * Remove not nessosary directory
     * $.gulpVars.app.dist and $.gulpVars.app.temp
---------------------------------------------------*/
gulp.task('clean', function() { return $.del([path.join($.gulpVars.app.dist, '/'), path.join($.gulpVars.app.temp, '/')]); });


 /*-------------------------------------------------
    package environment dependencies
    "wiredep": "^4.0.0",
    "main-bower-files": "^2.13.1",
    "gulp-filter": "^4.0.0",
    "gulp-inject": "^4.1.0",
    "gulp-htmlmin": "^2.0.0",
    "gulp-angular-filesort": "^1.1.1",
    "gulp-angular-templatecache": "^2.0.0",

     * Task for launch your application in browser
---------------------------------------------------*/
gulp.task('serve-dev', ['env-dev', 'inject'], function () {
    gulp.start('watch');
    gulp.start('server-dev');
});

gulp.task('serve', ['env-node', 'inject'], function () {
    gulp.start('watch');
    gulp.start('server-dev');
});
 /*-------------------------------------------------
    package environment dependencies
    "wiredep": "^4.0.0",
    "main-bower-files": "^2.13.1",
    "gulp-filter": "^4.0.0",
    "gulp-inject": "^4.1.0",
    "gulp-htmlmin": "^2.0.0",
    "gulp-angular-filesort": "^1.1.1",
    "gulp-angular-templatecache": "^2.0.0",

     * Task for build project minimizing version for production
---------------------------------------------------*/
gulp.task('build-prod', ['env-prod', 'inject'], function () {
    gulp.start('imagemin');
    return gulp.start('dist');
});

gulp.task('build', ['env-node', 'inject'], function () {
    gulp.start('imagemin');
    return gulp.start('dist');
});
