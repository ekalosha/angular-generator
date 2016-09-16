
'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var beautify = require('gulp-beautify');

/*-------------------------------------------------
	GENERATOR S-ANGULAR
---------------------------------------------------*/
var $ = require('./build/util.js');
var variables = require('./build/variables.js');
var writeFiles = require('./build/writefiles.js');



/**
 * generetor have a three three ways.
 *
 * installation - it works on first time (project generation)
 *
 * 			second and more run on one dir (stored .yo-rc.json)
 *			generator looking at the configuration options can offer:
 *
 * repair - generator resored by params:
 			"gulp tasks", .gitignore, .npmignore,
 			and extended a bower.json, pacage.json
 *
 * extend - (futures) can offer add in your aplication angular parts:
		all the additional parts will be added to the core (.yo-rc.json) application module as a dependent on his elements
		oauth -
		filters - 
		dummy service -
		dummy filter -
		dummy interceptor -

 * clear - it clear all files in derictory
 */
module.exports = yeoman.Base.extend({
	/*-------------------------------------------------
	PHASE INITIALIZING  
	---------------------------------------------------*/
	initializing: {
		// prepare util to work with this generator generator
		makeUtils: $.generator,
		// try to get a user data
		getUser: variables.getUser,
		// try find .yo-rc.json and choose restore/extend/rewrite
		generatorHello: variables.generatorHello,
	},
	/*-------------------------------------------------
	PHASE DEFINATION extend generator variables from user options
	---------------------------------------------------*/
	prompting: {
		instalation: function () {
			var config = $.get();
			if ( config['instalation'] == 'progress' ) {
				return new Promise( function ( resolve, reject ) {
					variables.main().then( function () {
						variables.preprocessors().then(function () {
							variables.angularName().then(resolve);
						});
					});
				});
			}
		},
		extend: function () { return 'futures'; }
	},
	/*-------------------------------------------------
		PHASE CONFIGURATION 
	---------------------------------------------------*/
	configuring: {
		instalation: function () {
			var generator = this;
			var config = $.get();
			if ( config['instalation'] == 'progress' || config['_privat']['repair'] ) {
				var packageOptions = {
					name: config.appName,
					version: config.appVersion,
				}
				// merge project/template bower.json and options from variables
				writeFiles.writePackage('bower.json', packageOptions);
				// if first install add owner like a contributor
				if ( config['instalation'] == 'progress' ) {
					packageOptions.contributors = [
						{name: config.user, email: generator.user.git.email()||(config.user+'@unknown.com')}
					];
				}
				// merge project/template package.json and options from variables
				writeFiles.writePackage('package.json', packageOptions);
			}
		},
		extend: function () { return 'futures'; }
	},
	/*-------------------------------------------------
		PHASE DEFAULT
	---------------------------------------------------*/
	default: {
		instalation: function () {
			var generator = this;
			var config = $.get();
			if ( config['instalation'] == 'progress' ) {
				console.log('instalation default');
			}
		},	
		repair: function () { return 'futures'; },
		extend: function () { return 'futures'; }
	},
	/*-------------------------------------------------
		PHASE WRITING
	---------------------------------------------------*/
	writing: {
		instalation: function () {
			var generator = this;
			var config = $.get();
			if ( config['instalation'] == 'progress' || config['_privat']['repair'] ) {
				if ( config['instalation'] == 'progress' ) {
					// just empty dirs - map of futures project
					$.createDirs([
						'source/assets/images',
						'source/assets/fonts',
						'source/styles/vendor',
						'source/styles/less',
						'source/styles/sass',
						'source/styles/styl',
						'source/app/directives',
						'source/app/filters',
						'source/app/interceptors',
						'source/app/services',
						'source/app/states'
					]);
					// simple copy files
					$.copy([
						'.gitignore',
						'.npmignore',
						'.bowerrc',
						'source/assets/images/favicon.ico',
						'source/assets/images/favicon-16x16.png',
						'source/assets/images/favicon-32x32.png',
					]);

					// basic dummy for angular project for this gulpfile
					writeFiles.angularDummy();
				}

				// build gulp tasks with choosed preprocessors
				writeFiles.gulpTasks();
			}
		},
		extend: function () {

		}
	},
	/*-------------------------------------------------
		PHASE REPAIRING
	---------------------------------------------------*/
	conflicts: {
		instalation: function () {
			var generator = this;
			var config = $.get();
			if ( config['instalation'] == 'progress' ) {
				console.log('instalation conflicts');
			}
		},
		repair: function () { return 'futures'; },
		extend: function () { return 'futures'; }
	},
	/*-------------------------------------------------
		PHASE INSTALATION
	---------------------------------------------------*/
	install: {
		repair: function () { return 'futures'; },
		extend: function () { return 'futures'; }
	},
	/*-------------------------------------------------
		PHASE AFTER ALL
	---------------------------------------------------*/
	end: {
		instalation: function () {
			var config = $.get();
			this.log( // say bye
				yosay(
					chalk.white('\nThank you very much, it`s been a')+' '+
					chalk.red.bold('pleasure')+'\ndoing business with you '+
					chalk.cyan(config['user'])+' .'
				)
			);
			$('clearConfig', '_privat');
			$.set('instalation', 'complete');
		},
		end: function () {
			var generator = this;
			var config = $.get();
			return new Promise( function ( resolve, reject ) {
				variables.install().then( function ( answer ) {
					if ( answer.bower||answer.npm ) {
						generator.installDependencies({
							bower: answer.bower,
							npm: answer.npm,
							callback: resolve
						});
					} else {
						resolve();
					}
				});
			});
		}
	}
});