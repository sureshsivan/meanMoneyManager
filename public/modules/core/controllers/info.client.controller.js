'use strict';


angular.module('core').controller('InfoController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

    }
]);
