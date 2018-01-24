
'use strict';

angular
    /**
     * default bootstraping of angular application
     * structure dependencies application
     */
    .module('<%=angular.app%>.layout', [
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
                session:  function ( $q ) {
                    var deferred = $q.defer();
                    deferred.resolve('YO');
                    return deferred.promise;
                },
                /**
                * try to get a owner user
                * these just example how it can be
                */
                user: function ( $q, session ) {
                    var deferred = $q.defer();
                    deferred.resolve({'guest': true, session: session });
                    return deferred.promise;
                }
            }
        });

    });
