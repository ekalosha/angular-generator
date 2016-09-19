
'use strict';

angular
	// as a deep for root module
	.module('<%=app%>')
	// interceptor injector name
	.factory('<%=name%>Interceptor', function ( $q, $log ) {
		// privat methods of interceptor


		// event can handle interceptor
		return {
			// each request
			'request': function ( request ) {

				return request;
			},
			
			// each requestError
			'requestError': function ( rejection ) {

				return $q.reject( rejection );
			},

			// each response must try to close own preloader 
			'response': function ( response ) {

				return response;
			},

			// each response must try to close own preloader 
			'responseError': function ( rejection ) {

				return $q.reject( rejection );
			}
		};
	});