
'use strict';

angular
	/**
	 * default bootstraping of angular application
	 * structure dependencies application
	 */
	.module('<%=index.app%>.layout', [

	])

	.config( function () {

		$stateProvider.state('layout', {
            url: '/layout',
            abstract: true,
            templateUrl: 'source/layout.html',
            controller: 'LayoutController',
            resolve: {
                /**
                 * try restore session
                 */
                permission: function ( $q, LoginService ) {
                    var deferred = $q.defer();
                    if ( LoginService.isLoggedIn() ) {
                        LoginService
                            .tryRestoreSession()
                            .then(
                                function ( sucess ) { deferred.resolve(true); },
                                function ( error ) { deferred.resolve(false); }
                            );
                        // permission error
                    } else { deferred.resolve(false); }
                    return deferred.promise;
                },
                /**
                 * get a owner user
                 */
                user: function ( $q, permission, LoginService, UserService ) {
                    if ( permission ) {
                        return UserService.getAdmin();
                    } else {
                        // clear stored session
                        LoginService.logout();
                        return deferred.resolve({guest: true});
                    }
                },
            }
        });

	});