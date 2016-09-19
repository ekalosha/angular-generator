
'use strict';

angular
	/**
	 * root controller
	 */
	.module('<%=angular.app%>.layout')

	.controller('layoutController', function ( $scope, $log, user ) {

		var root = $scope.root = {
			hello: 'Hello angular-dft !!!'
		};

		$log.debug('layoutController root.hello', root.hello );

	});