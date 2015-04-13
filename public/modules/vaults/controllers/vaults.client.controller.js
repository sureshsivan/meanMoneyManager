'use strict';

// Vaults controller
angular.module('vaults')



    .controller('VaultsController', ['$scope', '$stateParams', 'Authentication', '$state', 'VAULT_CONST',
                'Vaults', 'TrackerVaults', '$modal', '$log', 'moment', 'AppStatics', 'Notify', 'AppMessenger', 'VaultLocaleMessages',
        function($scope, $stateParams, Authentication, $state, VAULT_CONST, 
                    Vaults, TrackerVaults, $modal, $log, moment, AppStatics, Notify, AppMessenger, VaultLocaleMessages) {
            var _this = this;
            _this.authentication = Authentication;
            _this.appStatics = AppStatics;


            var pullMsgs = function(){
                return VaultLocaleMessages.pullMessages().then(function(labels){
                    _this.labelsObj = labels;
                });
            };
            
            var pullVaults = function () {
            	_this.trackerVaults = TrackerVaults.listTrackerVaults($stateParams);
            };
            
            var pullVault = function () {
                $scope.vault = Vaults.get($stateParams);
            };

            var bootmodule = function(){
                _this.createVault = function() {
                    _this.vault = {};
                    $state.go(VAULT_CONST.CREATE_VAULT_STATE_NAME, $stateParams);
                };
                _this.saveVault = function() {
                    var vault = new TrackerVaults({
                        displayName: _this.displayName,
                        description: _this.description,
                        tracker: $stateParams.trackerId,
                        owner: _this.authentication.user._id,
                        created: _this.created
                    });
                    // Redirect after save
                    vault.$save(function(response) {
                        $state.go('listTrackerVaults', $stateParams);
                        AppMessenger.sendInfoMsg('Successfully Created New Vault');
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };
                _this.editVault = function(vault) {
                    $state.go('editVault', {vaultId: vault._id});
                };
                _this.updateVault = function(updatedVault){
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

                _this.remove = function(vault) {
                    console.log(vault);
                    if ( vault ) {
                        vault.$remove({vaultId : vault._id}, function(res){
                            console.log(res);
                            Notify.sendMsg('RefreshVaults', $stateParams);
                        });
                    }
                };	
            };

            
        	//Bootstrapping based on application state
            if($state.current.name === VAULT_CONST.LIST_VAULTS_STATE_NAME){
            	pullMsgs().then(pullVaults).then(bootmodule);
            } else if($state.current.name === VAULT_CONST.CREATE_VAULT_STATE_NAME){
            	pullMsgs().then(bootmodule);
            } else if($state.current.name === VAULT_CONST.EDIT_VAULT_STATE_NAME){
            	pullMsgs().then(pullVault).then(bootmodule);
            }


        }
    ])

;
