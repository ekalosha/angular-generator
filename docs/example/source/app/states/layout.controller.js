
'use strict';

angular
	/**
	 * root controller
	 */
	.module('exampleapp.layout')

	.controller('layoutController', function ( $scope, $log, user ) {

		var root = $scope.root = {
			sayNo: function () {
				$log.debug('Sorry but this state not specified by scaffolding.');
			}
		};

	});