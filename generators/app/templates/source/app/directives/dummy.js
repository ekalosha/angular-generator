
'use strict';

angular
	// as a deep for root module
	.module('<%=app%>')
	// directive injector name
	.directive('<%=name%>', function () {
		// privat methods of directive


		// directive properties what can be specified
		return {

			// not necessary options
			priority: 0,
			scope: false,
			restrict: 'AE',
			terminal:false,
			replace: false,
			transclude: false,

			// dummy of template ( you must choose one of them )
			template: '<div></div>',
			templateUrl: 'template.html',

			// controller can be specified here, or injected by injection name, or removed
			controller: function ( $scope, $element, $attrs, $transclude ) {

			},

			// dummy link/compile ( you must choose one of them )
			link: function ( scope, element, attrs ) {

			},
			compile: function ( temaplateElement, templateAttrs ) {
				
				return {
					pre: function ( scope, element, attrs ) {

					},
					post: function( scope, element, attrs ) {

					}
				};
			},
		};
	});