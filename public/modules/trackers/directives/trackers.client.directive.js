'use strict';

// Trackers controller

angular.module('trackers')
	.directive('trackersList', ['Trackers', 'TRACKER_CONST', '$state', function(Trackers, TRACKER_CONST, $state) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: TRACKER_CONST.TRACKER_LIST_TEMPLATE_URL,
	        link: function(scope, element, attrs) {
	        }
	    };
	}])

	.directive('addUsers', ['Authentication', 'UserStatics', function(Authentication, UserStatics) {
	    return {
	        restrict: 'E',
	        transclude: true,
//	        templateUrl: 'modules/core/views/add-users-template.html',
	        templateUrl: UserStatics.getAddUsersTmpl(),
	        link: function(scope, element, attrs) {
	        },
	        scope: {
	        	assignedUsers: '=users'
	        },
	        controller: function($scope){
	        	$scope.authentication = Authentication;
						$scope.queryUsers = function(query){
							var curUsersArr = [];
							  angular.forEach($scope.assignedUsers, function(value, key) {
								  curUsersArr.push(value._id);
								});
							return UserStatics.queryUsers(query, curUsersArr.join());
						};
						$scope.assignNewUser = function(user){
							$scope.currentUser = null;
							$scope.assignedUsers.push(user);
			    	};
			    	$scope.removeUser = function(index){
			    		$scope.assignedUsers.splice(index, 1);
			    	};
	        }
	    };
	}])

;
