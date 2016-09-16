
'use strict';

angular
	/**
	 * default bootstraping of angular application
	 * structure dependencies application
	 */
	.module('<%=index.app%>', [
		'ui.utils',
		'ui.router',
		'restangular',
		'ui.bootstrap',
		'<%=index.app%>.layout'
	])

	.config( function () {


	})

	.run( function () {


	});