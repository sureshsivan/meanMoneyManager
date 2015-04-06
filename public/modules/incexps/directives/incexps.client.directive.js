'use strict';

angular.module('incexps')

	.directive('incexpsList', ['Incexps', 'TrackerIncexps', 'Notify', function(Incexps, TrackerIncexps, Notify) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'modules/incexps/views/incexps-list-template.html',
	        link: function(scope, element, attrs) {
	            Notify.getMsg('RefreshIncexps', function(event, data) {
                    scope.incexpCtrl.trackerIncexps = TrackerIncexps.listTrackerIncexps(data);
	            });
	        }
	    };
	}])

    .directive('selectUsers', ['Incexps', 'TrackerIncexps', 'AppStatics', 'Authentication', 'UserStatics', 
                               function(Incexps, TrackerIncexps, AppStatics, Authentication, UserStatics) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: UserStatics.getListUsersComboTmpl(),
            link: function(scope, element, attrs) {
            },
            scope: {
                currentUser: '=user'
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
