
'use strict';

var fs = require('fs');

/*-------------------------------------------------
	GENERATOR ANGULAR-DFT
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
		gulpVariables.gulp = { // format correctly string to include in js =)
			css: variables.preprocessors.css ? "'eslint','"+variables.preprocessors.css+"'" : "'eslint'", 
			js: variables.preprocessors.js ? "['"+variables.preprocessors.js+"']" : '',
			root: variables.modules.root
		};
		var files = [
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
	angularApp: function () {

		// just empty dirs - map of futures project
		$.createDirs([
			'source/assets/images',
			'source/assets/fonts',
			'source/styles/vendor',
			'source/styles/less',
			'source/styles/sass',
			'source/styles/styl',
			'source/app/states',
			'source/app/models',
			'source/app/filters',
			'source/app/services',
			'source/app/directives',
			'source/app/interceptors',
		]);

		var variables = $.get();
		var angularVariables = {
			angular: {
				title: $('humanize', variables.appName),
				app: variables.modules.root
			},
		};

		var files = [
			'source/index.html',
			'source/app/app.js',
			'source/app/config.js',
			'environment/config.template.js',
			'source/app/states/layout.html',
			'source/app/states/layout.module.js',
			'source/app/states/layout.controller.js',
			'source/app/states/home/home.html',
			'source/app/states/home/home.module.js',
			'source/app/states/home/home.controller.js',
			'source/app/filters/humanize.filter.js',
		];
		// template copy
		$.copy(files, angularVariables);
	},

	/**
	 * ask type and name and copy dummy
	 *
	 */
	makeAngularDummy: function () {
		// get generator context from utils
		var generator = $.generator();
		var choices = [ // dummy list
			{ name: 'angular Model', value: 'model' },
			{ name: 'angular Filter', value: 'filter' },
			{ name: 'angular Service', value: 'service' },
			{ name: 'angular Directive', value: 'directive' },
			{ name: 'angular Interceptor', value: 'interceptor' },
		];
		var firstCapital = {
			'model': true,
			'service': true,
			'filter': false,
			'directive': false,
			'interceptor': false
		};
		return new Promise( function ( resolve, reject ) {
			//
			$.askChoose('For what purpose you need a '+$.highlight('dummy')+' ?', {choices: choices})
				.then( function ( type ) {
					//
					$.askString('Angular module '+$.highlight('name')+':', {default: 'dummy'})
						.then( function ( name ) {
							// name to angular named rule
							name = $.angularize(name, firstCapital[type]);
							var root = 'source/app/'+type+'s/';
							generator.fs.copyTpl(
								$('sourceDir', root+'dummy.js'),
								$('destDir', root+name+'.'+type+'.js'),
								{app: $.get('modules').root, name: name}
							);
							resolve();
						});
				});
		});
	}

};