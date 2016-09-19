
'use strict';

angular
	// as a deep for root module
	.module('exampleapp')
	// filter injector name
	.filter('humanizeFilter', function () {
		// filter method
		return function ( string ) {
			// filter executer
			return String( string )
				// from camel case
				.replace( /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5' )
				// .replace(/([a-z]){1,1}([A-Z])/g, function ( sib, f, s ) { return f+" "+s; })
				// spec
				.replace(/[_-]+/g, ' ')
				// normalize
				.replace(/\s+/g, ' ')
				// trim
				.replace(/^\s*|\s*$/g, '')
				// capitalize
				.toLowerCase()
				.replace(/^.{1,1}/, function ( sib ) { return sib.toUpperCase(); });
		};
	});