'use strict';

angular.module('incexps')

	.directive('incexpsList', ['INCEXP_CONST', function(INCEXP_CONST) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: INCEXP_CONST.INCEXP_LIST_TEMPLATE_URL,
	        link: function(scope, element, attrs) {
	        }
	    };
	}])

    .directive('selectUsers', ['Authentication', 'UserStatics',
                               function(Authentication, UserStatics) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: UserStatics.getListUsersComboTmpl(),
            link: function(scope, element, attrs) {
            },
            scope: {
                currentUser: '=user',
                ngDisabled: '='
            },
            controller: function($scope){
                $scope.authentication = Authentication;
                var curUsersArr = [];
                curUsersArr.push(Authentication.user.id);
                $scope.queryUsers = function(query){
                    return UserStatics.queryUsers(query, curUsersArr.join());
                };
            }
        };
    }])

;
