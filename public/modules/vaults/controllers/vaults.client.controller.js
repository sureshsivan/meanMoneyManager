'use strict';

// Vaults controller
angular.module('vaults').controller('VaultsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vaults', 'TrackerVaults', '$modal', '$log', 'moment', 'AppStatics',
	function($scope, $stateParams, $location, Authentication, Vaults, TrackerVaults, $modal, $log, moment, AppStatics) {
        this.authentication = Authentication;
		this.trackerVaults = TrackerVaults.listTrackerVaults($stateParams);
        this.trackerId = $stateParams.trackerId;
		this.modalCreate = function(size) {
		    var modalInstance = $modal.open({
		        templateUrl: 'modules/vaults/views/create-vault.client.view.html',
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
		this.modalUpdate = function(size, selectedVault) {
			console.dir('DVASDVA');
			console.dir(selectedVault);
		    var modalInstance = $modal.open({
		        templateUrl: 'modules/vaults/views/edit-vault.client.view.html',
		        controller: function($scope, $modalInstance, vault) {
		            $scope.vault = vault;
		            $scope.ok = function() {
		                // if (updateCustomerForm.$valid){
		                $modalInstance.close($scope.vault);
		                // }
		            };
		            $scope.cancel = function() {
		                $modalInstance.dismiss('cancel');
		            };
		        },
		        size: size,
		        resolve: {
		            vault: function() {
		                return selectedVault;
		            }
		        }
		    });

		    modalInstance.result.then(function(selectedItem) {
		        $scope.selected = selectedItem;
		    }, function() {
		        $log.info('Modal dismissed at: ' + new Date());
		    });
		};
		// Remove existing Vault
		$scope.remove = function(vault) {
			if ( vault ) {
				vault.$remove();

				for (var i in $scope.vaults) {
					if ($scope.vaults [i] === vault) {
						$scope.vaults.splice(i, 1);
					}
				}
			} else {
				$scope.vault.$remove(function() {
					$location.path('vaults');
				});
			}
		};

		// // Update existing Vault
		// $scope.update = function() {
		// 	var vault = $scope.vault;

		// 	vault.$update(function() {
		// 		$location.path('vaults/' + vault._id);
		// 	}, function(errorResponse) {
		// 		$scope.error = errorResponse.data.message;
		// 	});
		// };

		// // Find a list of Vaults
		// $scope.find = function() {
		// 	$scope.vaults = Vaults.query();
		// };

		// // Find existing Vault
		// $scope.findOne = function() {
		// 	$scope.vault = Vaults.get({
		// 		vaultId: $stateParams.vaultId
		// 	});
		// };
	}
])


	.controller('VaultsCreateController', ['$scope', '$stateParams', 'Vaults', 'TrackerVaults', 'Notify', 'AppStatics', 'Authentication', 'AppMessenger',
	    function($scope, $stateParams, Vaults, TrackerVaults, Notify, AppStatics, Authentication, AppMessenger) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
            this.create = function() {
                var vault = new TrackerVaults({
                    displayName: this.displayName,
                    description: this.description,
                    tracker: $stateParams.trackerId,
                    owner: this.authentication.user._id,
                    created: this.created
                });
                // Redirect after save
                vault.$save(function(response) {
                    Notify.sendMsg('RefreshVaults', {
                        'trackerId': response.tracker
                    });
                    AppMessenger.sendInfoMsg(response);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
	    }
	])
	.controller('VaultsUpdateController', ['$scope', '$stateParams', 'Vaults', 'TrackerVaults', 'AppStatics', 'Authentication', 'Notify',
	    function($scope, $stateParams, Vaults, TrackerVaults, AppStatics, Authentication, Notify) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
			 this.update = function(updatedVault) {
			     var vault = updatedVault;
			     console.log(vault);
//			     delete vault.owner;
//			     delete vault.tracker;
//			     var users = [];
//			     var owner = tracker.owner._id;
//			     angular.forEach(tracker.users, function(value, key) {
//							   users.push(value._id);
//							 });
//							 tracker.owner = owner;
//							 tracker.users = users;
			     vault.$update($stateParams, function() {
			       Notify.sendMsg('RefreshTrackers', {});
			     }, function(errorResponse) {
			         $scope.error = errorResponse.data.message;
			     });
			 };

	    }
	])

	.directive('vaultsList', ['Vaults', 'TrackerVaults', 'Notify', function(Vaults, TrackerVaults, Notify) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'modules/vaults/views/vaults-list-template.html',
	        link: function(scope, element, attrs) {
	            //when a new customer is added, update the customer list
	            Notify.getMsg('RefreshVaults', function(event, data) {
                    console.log(11111111);
                    console.log(data);
	                scope.vaultCtrl.trackerVaults = TrackerVaults.listTrackerVaults(data);
	            });
	        }
	    };
	}])

;
