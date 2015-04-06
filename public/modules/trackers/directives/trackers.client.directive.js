'use strict';

// Trackers controller

angular.module('trackers')
	.directive('trackersList', ['Trackers', 'Notify', '$state', function(Trackers, Notify, $state) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'modules/trackers/views/trackers-list-template.html',
	        link: function(scope, element, attrs) {
	            Notify.getMsg('RefreshTrackers', function(event, data) {
	                scope.trackersCtrl.trackers = Trackers.query();
                    $state.go('listTrackers');
	            });
	        }
	    };
	}])

	.directive('addUsers', ['Trackers', 'AppStatics', 'Authentication', 'UserStatics', function(Trackers, AppStatics, Authentication, UserStatics) {
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
