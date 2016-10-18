
'use strict';

var yosay = require('yosay');
var chalk = require('chalk');
var $ = require('./util.js');
var initOptions = {
	'user': 'Freeman',
	'appName': 'app',
	'appVersion': '0.0.1',
	'cssFramework': null,
	// 'bowerInit': false,
	// 'npmInit': false,
	'modules': {
		'root': 'app',

	},
	'instalation': 'progress', // checking and store state of instalation
	'_privat': {
		'repair': false,
		'extend': false,
	},
};
function setConfig ( type ) {
	var config = $.get();
	switch ( type ) {
		// here the extend configuration (without installation)
		case 'extend':
			config['_privat'] = {
				'repair': false,
				'extend': true,
			};
		// here the repair configuration (without installation prompting)
		break;case 'repair':
			config['_privat'] = {
				'extend': false,
				'repair': true,
			};
		// here the installation configuration from scratch
		break;default: config = initOptions;
	}
	$.set( config );
}


/**
 * asks for define generator variables
 *
 */
var variables = module.exports = {
	/**
	 * try to get a username from system
	 * on fail ask from user
	 */
	getUser: function () {
		// make alias
		var generator = this;
		// try get user name
		var username = $.get('user') || generator.user.git.name();
		// var userEmail = generator.user.git.email();
		// firstly default project name take from dirname
		initOptions.appName = $('destDir', 'DIR_NAME');
		if ( !username ) {
			// if can`t find user name ask from user
			return new Promise( function ( resolve, reject ) {
				$.askString('Sorry, I could not identify your name. Enter it please.',{ default: username })
					.then( function ( name ) {
						initOptions.user = name;
						resolve();
					});
			});
		} else {
			initOptions.user = username;
		}
	},

	/**
	 * choose wich type of generate
	 * initialize/repair/extend
	 */
	generatorHello: function () {
		// make alias
		var generator = this;
		// detect previous installation
		var existConfig = $.get();

		if ( existConfig.instalation == 'complete' ) {
			generator.log(yosay('\nHello again '+chalk.red.bold($.get('user'))+' !\nWhat would you like to do ?'));
			var choices = [
				{ name: 'Add element angular application. (extend)', value: 'extend'},
				{ name: 'Something broke. (repair)', value: 'repair'},
				{ name: 'I cannot use this shit! (clear all)', value: 'clear'},
			];
			return new Promise( function ( resolve, reject ) {
				$.askChoose('\nangulr-dft '+$.highlight('TODO:'), {choices: choices})
					.then( function ( res ) {
						if ( res == 'clear' ) {
							$('removeFiles', [
								'.gitignore', '.npmignore', '.bowerrc', '.bower/**',
								'.tmp/**', '.yo-rc.json', '**/*.*', '**'
							]);
							$('preventInstalation'); // throw error
						} else {
							setConfig(res);
							resolve();
						}
					});
			});
		} else {
			$('clearConfig');
			setConfig('default-init');
			generator.log(yosay(
				'Hello '+chalk.red.bold($.get('user'))+' !\nlet`s create a '+
				chalk.cyan.bold('angulr-dft')+'\nproject - '+
				chalk.magenta.bold($.get('appName'))+' ?'
			));
		}
	},

	/**
	 * method to get project options
	 */
	main: function () {
		return new Promise( function ( resolve, reject ) {
			// 
			$.askString('Enter the project '+$.highlight('name')+':', {default: $.get('appName')})
				.then( function ( name ) {
					// app name to "package.json" format
					name = name.toLowerCase().replace(/^\s+|\s+$/g, '').replace(/\s+/g,'_');
					// validation app name
					if ( !/^[a-zA-Z0-9@\/][a-zA-Z0-9@\/\.\-_]*$/.test(name) ) {
						name = $.get('appName');
					}
					$.set('appName', name);
					//
					$.askString('Enter a project '+$.highlight('version')+':', {default: $.get('appVersion')})
						.then( function ( version ) {
							// validation app version
							var valid = /^[0-9]+\.[0-9]+[0-9+a-zA-Z\.\-]+$/;
							if ( !valid.test(version) ) {
								version = valid.test(parseInt(version)+'.0.0') ? parseInt(version)+'.0.0' : $.get('appVersion');
							}
							$.set('appVersion', version);
							resolve();
						});
				});
		});
	},

	/**
	 * method to get choosen preprocessors
	 */
	preprocessors: function ( generator ) {
		var jsList = [ // js preprocessor list
			{ name: 'None (js)', value: null },
			// { name: 'Babel', value: 'babel' },
			{ name: 'TypeScript (ts)', value: 'typeScript' },
			{ name: 'CofeeScript (cofee)', value: 'cofeeScript' }
		];
		var cssList = [ // css preprocessor list
			{ name: 'None (css)', value: null },
			{ name: 'LESS (less)', value: 'less' },
			{ name: 'STYLUS (styl)', value: 'stylus' },
			{ name: 'SASS (sass/scss)', value: 'sass' },
		];
		return new Promise( function ( resolve, reject ) {
			//
			$.askChoose('Choose a preprocessing for '+$.highlight('javascript')+':', {choices: jsList})
				.then( function ( js ) {
					//
					$.askChoose('Choose a preprocessing for '+$.highlight('css')+':', {choices: cssList})
						.then( function ( css ) {
							$.set('preprocessors', { 'css': css, 'js': js });
							resolve();
						});
				});
		});
	},

	/**
	 * asc about initialization Bower and NPM
	 */
	install: function () {
		return new Promise( function ( resolve, reject ) {
			//
			$.askСonfirm('Initialize the '+$.highlight('NPM')+' ?')
				.then( function ( npmInit ) {
					// 
					$.askСonfirm('Initialize the '+$.highlight('Bower')+' ?')
						.then( function ( bowerInit ) {
							resolve({ 'bower': bowerInit, 'npm': npmInit });
						});
				});
		});
	},

	/**
	 * angular architecture implementation
	 */
	angularName: function ( generator ) {
		var variables = $.get();
		var modules = variables.modules;
		modules.root = $('abbr', variables.appName)+'app';

		return new Promise( function ( resolve, reject ) {
			//
			$.askString('Angular root module '+$.highlight('name')+':', {default: modules.root})
				.then( function ( root ) {
					// validation app version
					var valid = /^[^0-9\W\_]+$/g;
					if ( !valid.test(root) ) { root = root.replace(/^[^0-9\W\_]+$/g, ''); }
					modules.root = root;
					$.set('modules', modules);
					resolve();
				});
		});
	}

};