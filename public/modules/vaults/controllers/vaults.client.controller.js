'use strict';

// Vaults controller
angular.module('vaults')



    .controller('VaultsController', ['$scope', '$stateParams', '$location', 'Authentication', '$state',
                'Vaults', 'TrackerVaults', '$modal', '$log', 'moment', 'AppStatics', 'Notify', 'AppMessenger',
        function($scope, $stateParams, $location, Authentication, $state,
                    Vaults, TrackerVaults, $modal, $log, moment, AppStatics, Notify, AppMessenger) {
            this.authentication = Authentication;
            this.appStatics = AppStatics;
            this.findAll = function() {
                this.trackerVaults = TrackerVaults.listTrackerVaults($stateParams);
            };
            this.findOne = function() {
                $scope.vault = Vaults.get({
                    vaultId: $stateParams.vaultId
                });
            };
            this.createVault = function() {
                this.vault = {};
                $state.go('createVault', $stateParams);
            };
            this.saveVault = function() {
                var vault = new TrackerVaults({
                    displayName: this.displayName,
                    description: this.description,
                    tracker: $stateParams.trackerId,
                    owner: this.authentication.user._id,
                    created: this.created
                });
                // Redirect after save
                vault.$save(function(response) {
                    $state.go('listTrackerVaults', $stateParams);
                    AppMessenger.sendInfoMsg('Successfully Created New Vault');
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            this.editVault = function(vault) {
                $state.go('editVault', {vaultId: vault._id});
            };
            this.updateVault = function(updatedVault){
                var vault = updatedVault;
                var trackerId = vault.tracker._id;
                delete vault.tracker;
                vault.$update({
                    vaultId: vault._id
                }, function() {
                    $state.go('listTrackerVaults', {trackerId: trackerId});
                    AppMessenger.sendInfoMsg('Successfully Updated the Vault');
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

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

;
