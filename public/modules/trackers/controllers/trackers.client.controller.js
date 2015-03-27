'use strict';

// Trackers controller

angular.module('trackers')
	.controller('TrackersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trackers', '$modal', '$log', 'moment', 'AppStatics', //'angularMoment',
		function($scope, $stateParams, $location, Authentication, Trackers, $modal, $log, moment, AppStatics) {
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
					this.getOwner = function(tracker){
						return (tracker.owner && tracker.owner._id && (tracker.owner._id.toString() === Authentication.user._id.toString()))	? 'Me - This is my Awesome tracker' :
													((tracker.owner && tracker.owner.displayName) ? tracker.owner.displayName : 'No Name');
					};
	        //pasted in from angular-ui bootstrap modal example
	        //open a modal window to update a single customer record
	        this.modalUpdate = function(size, selectedTracker) {

	            var modalInstance = $modal.open({
	                templateUrl: 'modules/trackers/views/edit-tracker.client.view.html',
	                controller: function($scope, $modalInstance, tracker) {
	        			$scope.currencyOptions = [
	        				      		            {id: 'INR', label: 'Indian Rupee'},
	        				      		            {id: 'USD', label: 'US Dollor'},
	        				      		            {id: 'AUD', label: 'Australian Dollor'},
	        				      		            {id: 'JPY', label: 'Japanese YEN'},
	        				      		            {id: 'EUR', label: 'Euro'},
	        				      	            ];
//	        			for(var idx in $scope.currencyOptions){
//	                    	var currentOption = $scope.currencyOptions[idx];
//	                    	if(currentOption.id === tracker.currency.id){
//	                    		tracker.currency = currentOption;
//	                    	}
//	                    };
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


	.controller('TrackersCreateController', ['$scope', 'Trackers', 'Notify', 'AppStatics', 'Authentication',
	    function($scope, Trackers, Notify, AppStatics, Authentication) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
	    	this.assignedUsers = [];
	    	this.assignedUsers.push(Authentication.user);
	    	this.assignNewUser = function(user){
	    		$scope.currentUser = null;
	    		this.assignedUsers.push(user);
	    	};
	    	this.getCurrencies = function(){
					return this.appStatics.getCurrencies()
				};
				this.getAssignedUsers = function(){

				};
				this.queryUsers = function(query){
					var curUsersArr = [];
					  angular.forEach(this.assignedUsers, function(value, key) {
						  curUsersArr.push(value._id);
						});
					return this.appStatics.queryUsers(query, curUsersArr.join())
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
						console.log(tracker);
            // Redirect after save
            tracker.$save(function(response) {
                Notify.sendMsg('NewTracker', {
                    'id': response._id
                });
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
	    }
	])
	.controller('TrackersUpdateController', ['$scope', 'Trackers', 'AppStatics',
	    function($scope, Trackers, AppStatics) {
	    	this.appStatics = AppStatics;
	    	this.getCurrencies = function(){
					return this.appStatics.getCurrencies()
				};
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
