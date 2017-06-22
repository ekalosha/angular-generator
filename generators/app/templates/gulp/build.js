'use strict';

var gulp = require('gulp');
var path = require('path');
var $ = require('./util.js');

/*-------------------------------------------------
	for more understanding created aliases for paths

---------------------------------------------------*/
var src = $.gulpVars.app.src;
var temp = $.gulpVars.app.temp;
var dist = $.gulpVars.app.dist;



function fontPathDist () {
	var root = $.gulpVars.assets.root.replace(/[\*\/]/g, '');
	var dir = $.gulpVars.assets.font.replace(/[\*\/]/g, '');
	return '../'+root+'/'+dir+'/';
}
// package fonts dependencies
gulp.task('fonts', ['bower-fonts'], function() {
	return copyFont( path.join(src, $.gulpVars.assets.root, $.gulpVars.assets.font), path.dirname(path.join(dist, $.gulpVars.assets.root, $.gulpVars.assets.font)) );
});
function copyFont ( source, dest ) {
	return gulp
		.src( source )
		.pipe( gulp.dest(dest) );
}
// package bower-fonts dependencies
// "main-bower-files": "^2.13.1",
// "gulp-filter": "^4.0.0",
gulp.task('bower-fonts', function() {
	return bowerFonts( path.dirname(path.join(dist, $.gulpVars.assets.root, $.gulpVars.assets.font)) );
});
function bowerFonts ( dest ) {
	return gulp
		.src( $.bowerFiles({debugging: true}) )
		.pipe( $.filter('**/*.{eot,otf,svg,ttf,woff,woff2}') )
		.pipe( $.flatten() )
		.pipe( gulp.dest(dest) );
}



// package imagemin dependencies
// "gulp-imagemin": "^3.0.3",
gulp.task('imagemin', function() {
	return imagemin( path.join(src, $.gulpVars.assets.root, $.gulpVars.assets.img), path.dirname(path.join(dist, $.gulpVars.assets.root, $.gulpVars.assets.img)) );
});
function imagemin ( source, dest ) {
	return gulp
		.src( source )
		.pipe( $.imagemin() )
		.pipe( gulp.dest(dest) );
}



// package inject-template-cache dependencies
// "gulp-inject": "^4.1.0",
gulp.task('inject-template-cache', ['template-cache'], function() {
	return injectTemplateCache( gulp.src(path.join(temp,$.gulpVars.js.root,'templateCacheHtml.js')) );
});
/*-------------------------------------------------
	goes here to customize inject "template-cache"
---------------------------------------------------*/
var injectTemplateOptions = {
	starttag: '<!-- inject:template-cache -->',
	addRootSlash: false,
	addPrefix: '..'
};
function injectTemplateCache ( templateCache ) {
	return gulp
		.src( path.join(temp, '/index.html') )
		.pipe( $.inject(templateCache, injectTemplateOptions))
		.pipe( gulp.dest(temp) );
}
// package template-cache dependencies
// "gulp-htmlmin": "^2.0.0",
// "gulp-angular-templatecache": "^2.0.0",
gulp.task('template-cache', function() {
	return formatTemplateCache( [path.join($.gulpVars.app.src, '/**/*.html'), '!'+$.gulpVars.app.src+'/index.html'] );
});
/*-------------------------------------------------
	goes here to customize htmlmin "template-cache"
---------------------------------------------------*/
var minOptions = {
	removeEmptyAttributes: true,
	removeAttributeQuotes: false,
	collapseBooleanAttributes: true,
	collapseWhitespace: true
};
/*-------------------------------------------------
	goes here to customize angularTemplatecache "template-cache"
---------------------------------------------------*/
var createOptions = {
	standalone: false,
	module: '<%=gulp.root%>',
	root: '',
};
function formatTemplateCache ( templates ) {
	return gulp
		.src( templates )
		.pipe( $.htmlmin(minOptions) )
		.pipe( $.angularTemplatecache('templateCacheHtml.js', createOptions) )
		.pipe( gulp.dest(path.join(temp, $.gulpVars.js.root)) );
}



/*-------------------------------------------------
	goes here to customize uglify
---------------------------------------------------*/
var uglifyOptions = {
	preserveComments: $.uglifyLicense
};
/*-------------------------------------------------
	goes here to customize index html min
---------------------------------------------------*/
var htmlMinOptions = {
	removeEmptyAttributes: true,
	removeAttributeQuotes: false,
	collapseBooleanAttributes: true,
	collapseWhitespace: true
};


gulp.task('dist', ['fonts', 'inject-template-cache'], function() {

	return gulp
		.src( path.join(temp, '/*.html') )
		.pipe( $.useref() )
		.pipe( $.IF('**/app.js', $.ngAnnotate()) )
		.pipe( $.IF('**/app.js', $.uglify(uglifyOptions)) )
			// replace font path in css libs like a bootstrap or font-awesome
		.pipe( $.IF('**/vendor.css', $.replace('../fonts/', fontPathDist())) )
		.pipe( $.IF('*.css', $.cssnano()) )
		.pipe( $.IF('!*.html', $.rev()) )
		.pipe( $.revReplace() )
		.pipe( $.IF('index.html',  $.htmlmin(htmlMinOptions)) )
		.pipe( gulp.dest(path.join(dist, '/')) )
});

