
'use strict';

angular

	.module('layout.home')

	.controller('homeController', function ( $scope, $log, fromRoot ) {

		var vm = $scope.vm = {
			user: fromRoot,
			hello: 'Hello i am a child state home'
		};

		$log.debug('homeController vm.hello', vm.hello);

	});