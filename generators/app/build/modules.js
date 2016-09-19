
'use strict';

var $ = require('./util.js');


var validModuleName = /^[^0-9\W\]+$/g;
function toValid ( name ) {
	return validModuleName.test(name) ?
		name.replace(validModuleName, '') : name;
}

function make () {

}






function makePath ( name ) {
	return this.root+this.type+'s/'name+'.'+this.type+this.ext;
}

function dummy ( type, options ) {
	// 
	options = options||{};
	if ( typeof type !== 'string' ) { throw new Error('AngularDummy: "type" must be specified.'); }
	// get generator context from utils
	var generator = $.generator();
	// make a variables
	var module = {
		type: type,
		root: 'source/app/',
		ext: '.'+(options.ext||'js'),
	};
	var root = 'source/app/'+type+
	module.src = module.root+module.type+'s/dummy'+module.ext;

	return new Promise( function ( resolve, reject ) {
		$.askString('Angular module '+$.highlight('name')+':', {default: 'dummy'})
			.then(function (name) {
				generator.fs.copyTpl(
					$('sourceDir', module.src),
					$('destDir', makePath.call(module, name)),
					{root: $.get('modules').root, name: name}
				);
				resolve();
			});
	});
}

module.exports = {
	/**
	 * 
	 *
	 */
	makeDummy: function () {

	},


};