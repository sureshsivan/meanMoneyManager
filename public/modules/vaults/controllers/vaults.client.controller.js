'use strict';

// Vaults controller
angular.module('vaults').controller('VaultsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vaults', 'TrackerVaults', '$modal', '$log', 'moment', 'AppStatics', 'Notify',
	function($scope, $stateParams, $location, Authentication, Vaults, TrackerVaults, $modal, $log, moment, AppStatics, Notify) {
        this.authentication = Authentication;
		this.trackerVaults = TrackerVaults.listTrackerVaults($stateParams);
        this.trackerId = $stateParams.trackerId;
        this.vaultId = $stateParams.vaultId;
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
		this.remove = function(vault) {
			console.log(vault);
			if ( vault ) {
				vault.$remove({vaultId : vault._id}, function(res){
                    console.log(res);
                    Notify.sendMsg('RefreshVaults', $stateParams);
                });
			}
		};

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

			     delete vault.tracker;

			     vault.$update({
			    	 trackerId: $stateParams.trackerId,
                     vaultId: vault._id
			     }, function() {
			       Notify.sendMsg('RefreshVaults', {});
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
                    scope.vaultCtrl.trackerVaults = TrackerVaults.listTrackerVaults(data);
	            });
	        }
	    };
	}])

;
