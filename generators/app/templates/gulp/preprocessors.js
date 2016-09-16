'use strict';

var gulp = require('gulp');
var path = require('path');
var $ = require('./util.js');

/*-------------------------------------------------
	for more understanding created aliases for paths
	
	Each preprocessor searches for files in the specified path,
	and after compilation adds the same with the same name
	but a different extension ('.js'/'.css')
---------------------------------------------------*/
var typescriptPath = path.join($.gulpVars.app.src, $.gulpVars.js.root, $.gulpVars.js.typescript);
var coffeescriptPath = path.join($.gulpVars.app.src, $.gulpVars.js.root, $.gulpVars.js.coffeescript);
var lessPath = path.join($.gulpVars.app.src, $.gulpVars.css.root, $.gulpVars.css.less);
var sassPath = path.join($.gulpVars.app.src, $.gulpVars.css.root, $.gulpVars.css.sass);
var stylusPath = path.join($.gulpVars.app.src, $.gulpVars.css.root, $.gulpVars.css.stylus);
var eslintPath = path.join($.gulpVars.app.src, $.gulpVars.js.root, $.gulpVars.js.src);


/*-------------------------------------------------
		JavaScipt
---------------------------------------------------*/
// package typescript dependencies
// "gulp-typescript": "^2.13.6",
gulp.task('typescript', function () { return typescript( typescriptPath, path.dirname(typescriptPath) ); });
function typescript ( source, dest ) {
	return gulp
		.src( source )
		.pipe( $.typescript() )
		.pipe( gulp.dest(dest) );
}


// package coffeescript dependencies
// "gulp-coffee": "^2.3.2",
gulp.task('coffeescript', function () { return coffeescript( coffeescriptPath, path.dirname(coffeescriptPath) ); });
function coffeescript ( source, dest ) {
	return gulp
		.src( source )
		.pipe( $.coffee({ bare: true }) )
		.pipe( gulp.dest(dest) );
}


/*-------------------------------------------------
		CSS
---------------------------------------------------*/
// package less dependencies
// "gulp-less": "^3.1.0",
// "less-plugin-autoprefix": "^1.5.1",
gulp.task('less', function () { return less( lessPath, path.dirname(lessPath) ); });
function less ( source, dest ) {
	var lessAutoprefix = new $.lessAutoprefix({ browsers: ['last 2 versions'] });
	return gulp
		.src( source )
		.pipe( $.less({ plugins: [lessAutoprefix] }) )
		.pipe( gulp.dest(dest) );
}


// package sass dependencies
// "gulp-sass": "^2.3.2",
gulp.task('sass', function () { return sass( sassPath, path.dirname(sassPath) ); });
function sass ( source, dest ) {
	return gulp
		.src( source )
		.pipe( $.sass() )
		.pipe( gulp.dest(dest) );
}


// package stylus dependencies
// "gulp-stylus": "^2.5.0",
gulp.task('stylus', function () { return stylus( stylusPath, path.dirname(stylusPath) ); });
function stylus ( source, dest ) {
	return gulp
		.src( source )
		.pipe( $.stylus() )
		.pipe( gulp.dest(dest) );
}

// package eslint dependencies
// "gulp-eslint": "^3.0.1",
gulp.task('eslint', <%-preprocessors.js%> function () { return eslint( eslintPath ); });
function eslint ( source ) {
	/*-------------------------------------------------
		goes here to customize rules "eslint"
	---------------------------------------------------*/
	var rulesOption = {
		rules: {
			'valid-typeof': 'warn',
			'use-isnan': 'warn',
		},
		globals: ['angular', 'jQuery', '$'],
		envs: []
	};
	return gulp
		.src( source )
		.pipe( $.eslint(rulesOption) )
		.pipe( $.eslint.format() )
		.pipe( $.eslint.failAfterError() );
}

/*-------------------------------------------------
 	How can I customize ?

 	task "preprocessor" for example usage of preprocessing.
 	By default, this tasks write yo s-angular props
	but you can use it as a working example
---------------------------------------------------*/
gulp.task('preprocessor', [<%-preprocessors.css%>]);