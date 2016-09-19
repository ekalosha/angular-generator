
'use strict';

angular
	/**
	 * default bootstraping of angular application
	 * structure dependencies application
	 */
	.module('exampleapp.layout', [
		'layout.home'
	])

	.config( function ( $stateProvider ) {

		$stateProvider.state('layout', {
			url: '/layout',
			abstract: true,
			templateUrl: 'app/states/layout.html',
			controller: 'layoutController',
			/**
			* before load a root view it makes sense to try to restore session
			* becose resolve on this state can be called from any child states
			*/
			resolve: {
				/**
				* try restore session
				* these just example how it can be
				*/
				session:  function ( $q/*, LoginService*/ ) {
					// var deferred = $q.defer();
					// if ( LoginService.isLoggedIn() ) {
					// 	LoginService
					// 		.tryRestoreSession()
					// 		.then(
					// 			function ( sucess ) { deferred.resolve(true); },
					// 			function ( error ) { deferred.resolve(false); }
					// 		);
					// 	// permission error
					// } else { deferred.resolve(false); }
					// return deferred.promise;
					return true;
				},
				/**
				* try to get a owner user
				* these just example how it can be
				*/
				user: function ( $q, session/*, LoginService, UserService*/ ) {
					// if ( session ) {
					// 	return UserService.getOwner();
					// } else {
					// 	// clear stored session
					// 	LoginService.logout();
					// 	// emulate a user without permissions
					// 	return deferred.resolve({'guest': true});
					// }
					return 'user';
				}
			}
		});

	});