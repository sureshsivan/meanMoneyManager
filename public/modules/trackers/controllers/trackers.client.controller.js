'use strict';

// Trackers controller

angular.module('trackers')
	.controller('TrackersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trackers', '$modal', '$log',
		function($scope, $stateParams, $location, Authentication, Trackers, $modal, $log) {
			this.authentication = Authentication;
			this.trackers = Trackers.query();
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
	        
	        
//			// Create new Tracker
//			$scope.create = function() {
//				// Create new Tracker object
//				var tracker = new Trackers ({
//					name: this.name
//				});
//	
//				// Redirect after save
//				tracker.$save(function(response) {
//					$location.path('trackers/' + response._id);
//	
//					// Clear form fields
//					$scope.name = '';
//				}, function(errorResponse) {
//					$scope.error = errorResponse.data.message;
//				});
//			};
//	
//			// Remove existing Tracker
//			$scope.remove = function(tracker) {
//				if ( tracker ) { 
//					tracker.$remove();
//	
//					for (var i in $scope.trackers) {
//						if ($scope.trackers [i] === tracker) {
//							$scope.trackers.splice(i, 1);
//						}
//					}
//				} else {
//					$scope.tracker.$remove(function() {
//						$location.path('trackers');
//					});
//				}
//			};
//	
//			// Update existing Tracker
//			$scope.update = function() {
//				var tracker = $scope.tracker;
//	
//				tracker.$update(function() {
//					$location.path('trackers/' + tracker._id);
//				}, function(errorResponse) {
//					$scope.error = errorResponse.data.message;
//				});
//			};
//	
//			// Find a list of Trackers
//			$scope.find = function() {
//				$scope.trackers = Trackers.query();
//			};
//	
//			// Find existing Tracker
//			$scope.findOne = function() {
//				$scope.tracker = Trackers.get({ 
//					trackerId: $stateParams.trackerId
//				});
//			};
		}
	])
	
	
	.controller('TrackersCreateController', ['$scope', 'Trackers', 'Notify',
	    function($scope, Trackers, Notify) {
	        this.create = function() {
	            var tracker = new Trackers({
	                displayName: this.displayName,
	                description: this.description,
	                currency: this.currency,
	                owner: this.owner,
	                users: this.users,
	                created: this.created
	            });
	
	            // Redirect after save
	            tracker.$save(function(response) {
	
	                Notify.sendMsg('NewTracker', {
	                    'id': response._id
	                });
	
	                // // Clear form fields
	                // $scope.firstName = '';
	                // $scope.lastName = '';
	                // $scope.city = '';
	                // $scope.country = '';
	                // $scope.industry = '';
	                // $scope.email = '';
	                // $scope.phone = '';
	                // $scope.referred = '';
	                // $scope.channel = '';
	            }, function(errorResponse) {
	                $scope.error = errorResponse.data.message;
	            });
	        };
	
	    }
	])
	.controller('TrackersUpdateController', ['$scope', 'Trackers',
	    function($scope, Trackers) {
	        $scope.channelOptions = [
	            {id: 1 , item: 'Facebook'},
	            {id: 2 , item: 'Twitter'},
	            {id: 3 , item: 'Email'},
	            ];
	
	
	        // Update existing Customer
	        this.update = function(updatedTracker) {
	            var tracker = updatedTracker;
	
	            tracker.$update(function() {
	
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
	            Notify.getMsg('NewTracker', function(event, data) {
	                scope.trackersCtrl.trackers = Trackers.query();
	
	            });
	        }
	    };
	}]);