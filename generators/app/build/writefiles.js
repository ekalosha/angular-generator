
'use strict';

var fs = require('fs');

/*-------------------------------------------------
	GENERATOR S-ANGULAR
---------------------------------------------------*/
var $ = require('./util.js');


module.exports = {
	/**
	 * to writing (package/bower).json
	 *
	 * @param: { String } - name of package
	 * @param: { Object }
	 * @returns: { Object }
	 */
	writePackage: function ( _package, options ) {
		if ( typeof options != 'object' ) { options = {}; }
		// get generator from utils =))
		var generator = $.generator();
		// get package as default vals 
		// var _default = JSON.parse( fs.readFileSync(generator.templatePath(_package), {encoding: 'utf8'}) );
		var _default = JSON.parse( fs.readFileSync($('sourceDir', _package), {encoding: 'utf8'}) );
		// get package from output dir as origin
		try { 
			// var source = JSON.parse( fs.readFileSync(generator.destinationPath(_package), {encoding: 'utf8'}) );
			var source = JSON.parse( fs.readFileSync($('destDir', _package), {encoding: 'utf8'}) );
		} catch ( err ) { var source = {}; };
		// write extendet package
		generator.write( _package, JSON.stringify($.pryorityMerge(source, options, _default), null, 4) );
	},
	/**
	 * rewrite a gulp tusks file and set config
	 *
	 */
	gulpTasks: function () {
		var variables = $.get();
		var gulpVariables = {};
		gulpVariables.preprocessors = { // format correctly string to include in js =)
			css: variables.preprocessors.css ? "'eslint','"+variables.preprocessors.css+"'" : "'eslint'", 
			js: variables.preprocessors.js ? "['"+variables.preprocessors.js+"']" : '',
		};
		gulpVariables.index = {
			app: variables.modules,
		};
		var files = [
			'environment/config.template.js',
			'environment/development.json',
			'environment/production.json',
			'gulp/preprocessors.js',
			'gulp/.eslintrc',
			'gulp/inject.js',
			'gulp/watch.js',
			'gulp/build.js',
			'gulp/util.js',
			'gulpfile.js'
		];
		// template copy
		$.copy(files, gulpVariables);
	},
	/**
	 * write dummy for angular project
	 * prepering source to extend addition modules
	 */
	angularDummy: function () {
		var variables = $.get();

		var angularVariables = {
			index: {
				title: $('humanize', variables.appName),
				app: variables.modules.root
			},
		};

		var files = [
			'source/index.html',
			'source/app/app.js',
			'source/app/config.js',
			'source/app/state/layout.html',
			'source/app/state/layout.module.js',
			'source/app/state/layout.controller.js',
		];
		// template copy
		$.copy(files, angularVariables);
	}


};