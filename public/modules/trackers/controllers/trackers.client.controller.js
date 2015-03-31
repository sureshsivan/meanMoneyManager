'use strict';

// Trackers controller

angular.module('trackers')
	.controller('TrackersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trackers', '$modal', '$log', 'moment', 'AppStatics', '$state',   //'angularMoment',
		function($scope, $stateParams, $location, Authentication, Trackers, $modal, $log, moment, AppStatics, $state) {
			this.authentication = Authentication;
			this.trackers = Trackers.query();
			// this.appStatics = AppStatics;
			// this.getCurrencies = function(){
			// 	return this.appStatics.getCurrencies()
			// };
			//open a modal window to create a single customer record
	        this.modalCreate = function(size) {
	            var modalInstance = $modal.open({
	                templateUrl: 'modules/trackers/views/create-tracker.client.view.html',
	                controller: function($scope, $modalInstance) {
	                    $scope.ok = function() {
	                        // if (createCustomerForm.$valid){
	                        $modalInstance.close();
	                        // }
	                    };
	                    $scope.cancel = function() {
	                        $modalInstance.dismiss('cancel');
	                    };
	                },
	                size: size
	            });
	            modalInstance.result.then(function(selectedItem) {

	            	}, function() {
		                $log.info('Modal dismissed at: ' + new Date());
	            });
	        };
	        this.getLocalTime = function(time){
	        	return moment(time).toString();
	        };
					this.getOwnerTxt = function(tracker){
						return (tracker.owner && tracker.owner._id && (tracker.owner._id.toString() === Authentication.user._id.toString()))	? 'Me - This is my Awesome tracker' :
													((tracker.owner && tracker.owner.displayName) ? tracker.owner.displayName : 'No Name');
					};
					this.getUsersTxt = function(tracker){
						var users = '';
						//TODO - splice owner name from this
						if(tracker.users && tracker.users.length > 1){
							for(var i = 0; i < tracker.users.length; i++){
								if(i !== 0){
									users = users + ((i===tracker.users.length-2) ? ' , ' : ' and ') + tracker.users[i].displayName;
								} else {
									users = tracker.users[i].displayName;
								}
							}
						} else if(tracker.users){
							users = tracker.users[0].displayName;
						} else {
							// TODO - remove it later
							users = 'Something wrong';
						}
						return users;
					};
					this.loadVaults = function(trackerId, vaultId){
						console.log(trackerId);
						console.log(vaultId);
						var dd = {trackerId: trackerId, vaultId: vaultId, 'summa' : 'afsdvbafsdvasdfv'};
						console.log(dd);
						$state.go('listTrackerVaults', dd);
					};
	        //pasted in from angular-ui bootstrap modal example
	        //open a modal window to update a single customer record
	        this.modalUpdate = function(size, selectedTracker) {

	            var modalInstance = $modal.open({
	                templateUrl: 'modules/trackers/views/edit-tracker.client.view.html',
	                controller: function($scope, $modalInstance, tracker) {
	                    $scope.tracker = tracker;
	                    $scope.ok = function() {
	                        // if (updateCustomerForm.$valid){
	                        $modalInstance.close($scope.tracker);
	                        // }
	                    };
	                    $scope.cancel = function() {
	                        $modalInstance.dismiss('cancel');
	                    };
	                },
	                size: size,
	                resolve: {
	                    tracker: function() {
	                        return selectedTracker;
	                    }
	                }
	            });

	            modalInstance.result.then(function(selectedItem) {
	                $scope.selected = selectedItem;
	            }, function() {
	                $log.info('Modal dismissed at: ' + new Date());
	            });
	        };


	        // Remove existing Customer
	        this.remove = function(tracker) {
	            if (tracker) {
	            	tracker.$remove();

	                for (var i in this.trackers) {
	                    if (this.trackers[i] === tracker) {
	                        this.trackers.splice(i, 1);
	                    }
	                }
	            } else {
	                this.tracker.$remove(function() {});
	            }
	        };

		}
	])


	.controller('TrackersCreateController', ['$scope', 'Trackers', 'Notify', 'AppStatics', 'Authentication', 'AppMessenger',
	    function($scope, Trackers, Notify, AppStatics, Authentication, AppMessenger) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
	    	this.assignedUsers = [];
	    	this.assignedUsers.push(Authentication.user);
	    	this.getCurrencies = function(){
					return this.appStatics.getCurrencies();
				};
        this.create = function() {
            var tracker = new Trackers({
                displayName: this.displayName,
                description: this.description,
                currency: this.currency,
                owner: this.owner,
                // users: this.users,
                created: this.created
            });
            tracker.users = [];
            angular.forEach(this.assignedUsers, function(value, key) {
						  tracker.users.push(value._id);
						});
            // Redirect after save
            tracker.$save(function(response) {
                Notify.sendMsg('RefreshTrackers', {
                    'id': response._id
                });
                AppMessenger.sendInfoMsg(response);
                // Notify.sendMsg('TrackerSaved', {
                // });
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
	    }
	])
	.controller('TrackersUpdateController', ['$scope', 'Trackers', 'AppStatics', 'Authentication', 'Notify',
	    function($scope, Trackers, AppStatics, Authentication, Notify) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
	    	this.getCurrencies = function(){
					return this.appStatics.getCurrencies();
				};
        this.update = function(updatedTracker) {
            var tracker = updatedTracker;
            var users = [];
            var owner = tracker.owner._id;
            angular.forEach(tracker.users, function(value, key) {
						  users.push(value._id);
						});
						tracker.owner = owner;
						tracker.users = users;
            tracker.$update(function() {
              Notify.sendMsg('RefreshTrackers', {});
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

	    }
	])

	.directive('trackersList', ['Trackers', 'Notify', function(Trackers, Notify) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'modules/trackers/views/trackers-list-template.html',
	        link: function(scope, element, attrs) {
	            //when a new customer is added, update the customer list
	            Notify.getMsg('RefreshTrackers', function(event, data) {
	                scope.trackersCtrl.trackers = Trackers.query();
	            });
	        }
	    };
	}])

	.directive('addUsers', ['Trackers', 'AppStatics', 'Authentication', function(Trackers, AppStatics, Authentication) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'modules/trackers/views/add-users-template.html',
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
							return AppStatics.queryUsers(query, curUsersArr.join());
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
