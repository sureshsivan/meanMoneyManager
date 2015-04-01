'use strict';

// Incexps controller
angular.module('incexps').controller('IncexpsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Incexps', 'TrackerIncexps', '$modal', '$log', 'moment', 'AppStatics', 'Notify',
	function($scope, $stateParams, $location, Authentication, Incexps, TrackerIncexps, $modal, $log, moment, AppStatics, Notify) {
        this.authentication = Authentication;
		this.trackerIncexps = TrackerIncexps.listTrackerIncexps($stateParams);
        this.trackerId = $stateParams.trackerId;
        this.incexpId = $stateParams.incexpId;
		this.modalCreate = function(size) {
		    var modalInstance = $modal.open({
		        templateUrl: 'modules/incexps/views/create-incexp.client.view.html',
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
		this.modalUpdate = function(size, selectedIncexp) {
		    var modalInstance = $modal.open({
		        templateUrl: 'modules/incexps/views/edit-incexp.client.view.html',
		        controller: function($scope, $modalInstance, incexp) {
		            $scope.incexp = incexp;
		            $scope.ok = function() {
		                // if (updateCustomerForm.$valid){
		                $modalInstance.close($scope.incexp);
		                // }
		            };
		            $scope.cancel = function() {
		                $modalInstance.dismiss('cancel');
		            };
		        },
		        size: size,
		        resolve: {
		            incexp: function() {
		                return selectedIncexp;
		            }
		        }
		    });

		    modalInstance.result.then(function(selectedItem) {
		        $scope.selected = selectedItem;
		    }, function() {
		        $log.info('Modal dismissed at: ' + new Date());
		    });
		};
		// Remove existing Incexp
		this.remove = function(incexp) {
			console.log(incexp);
			if ( incexp ) {
				incexp.$remove({incexpId : incexp._id}, function(res){
                    console.log(res);
                    Notify.sendMsg('RefreshIncexps', $stateParams);
                });
			}
		};

	}
])


	.controller('IncexpsCreateController', ['$scope', '$stateParams', 'Incexps', 'TrackerIncexps', 'Notify', 'AppStatics', 'Authentication', 'AppMessenger',
	    function($scope, $stateParams, Incexps, TrackerIncexps, Notify, AppStatics, Authentication, AppMessenger) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;

            this.getCurrencies = function(){
                return this.appStatics.getCurrencies();
            };

            this.create = function() {
                var incexp = new TrackerIncexps({
                    displayName: this.displayName,
                    description: this.description,
                    tracker: $stateParams.trackerId,
                    owner: this.authentication.user._id,
                    created: this.created
                });
                // Redirect after save
                incexp.$save(function(response) {
                    Notify.sendMsg('RefreshIncexps', {
                        'trackerId': response.tracker
                    });
                    AppMessenger.sendInfoMsg(response);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
	    }
	])
	.controller('IncexpsUpdateController', ['$scope', '$stateParams', 'Incexps', 'TrackerIncexps', 'AppStatics', 'Authentication', 'Notify',
	    function($scope, $stateParams, Incexps, TrackerIncexps, AppStatics, Authentication, Notify) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
			 this.update = function(updatedIncexp) {
			     var incexp = updatedIncexp;

			     delete incexp.tracker;

			     incexp.$update({
			    	 trackerId: $stateParams.trackerId,
                     incexpId: incexp._id
			     }, function() {
			       Notify.sendMsg('RefreshIncexps', {});
			     }, function(errorResponse) {
			         $scope.error = errorResponse.data.message;
			     });
			 };

	    }
	])

	.directive('incexpsList', ['Incexps', 'TrackerIncexps', 'Notify', function(Incexps, TrackerIncexps, Notify) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'modules/incexps/views/incexps-list-template.html',
	        link: function(scope, element, attrs) {
	            //when a new customer is added, update the customer list
	            Notify.getMsg('RefreshIncexps', function(event, data) {
                    scope.incexpCtrl.trackerIncexps = TrackerIncexps.listTrackerIncexps(data);
	            });
	        }
	    };
	}])

;
