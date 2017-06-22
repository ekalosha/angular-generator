
'use strict';

angular
    /**
     * root controller
     */
    .module('<%=angular.app%>.layout')

    .controller('layoutController', function ( $scope, toastr, user ) {

        var root = $scope.root = {
            sayNo: function ( state ) {
                toastr.error('Sorry but this state not specified by scaffolding.', state);
            }
        };

    });
