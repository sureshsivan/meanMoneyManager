'use strict';

angular.module('incexps')

	.directive('incexpsList', ['Incexps', 'TrackerIncexps', 'Notify', 'IncexpStatics', function(Incexps, TrackerIncexps, Notify, IncexpStatics) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: IncexpStatics.getListIncexpsTemplatePath(),
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
