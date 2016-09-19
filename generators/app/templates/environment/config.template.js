
'use strict';

/*-------------------------------------------------
	Source of this template in root directory
	environment/config.template.js
	this is only example which you may define any structure
---------------------------------------------------*/
angular
	/**
	 * app configuration from enveronment
	 */
	.module('<%=angular.app%>')

	.constant('config', {
		version: {{version}},
		apiPath: '{{apiPath}}', // data type String may wrapped on quotes
		some1: {{object}},
		some2: {{array}},
		static: {any: true}
	});