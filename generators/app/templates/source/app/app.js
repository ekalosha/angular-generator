
'use strict';

angular
    /**
     * default bootstraping of angular application
     * structure dependencies application
     */
    .module('<%=angular.app%>', [
        'ui.utils',
        'ui.router',
        'restangular',
        'ui.bootstrap',
        'toastr',
        '<%=angular.app%>.layout'
    ])

    .config( function ( $urlRouterProvider, $logProvider, $locationProvider, RestangularProvider, config ) {
        //
        $locationProvider.html5Mode(false);
        // OTHERWICE
        $urlRouterProvider.otherwise('/layout/home');
        // Do I need to have a log.debug message visible ?
        $logProvider.debugEnabled(!config.production);

        // Do I need customize a request base url ?
        // RestangularProvider.setBaseUrl(config.apiPath);
        // Do I need customize a request headers for application ?
        // RestangularProvider.setDefaultHeaders({'custom-header': 'best request'});

    })

    .run( function ( $rootScope, $state, $log, config ) {
        // Do I need to state parameters visible in the html view ?
        $rootScope.$state = $state;
        // log a configuration of aplication
        $log.debug('app config\n', config);

    });
