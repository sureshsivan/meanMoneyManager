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
            $scope.$stateParams = $stateParams;

            var pullMsgs = function(){
                return VaultLocaleMessages.pullMessages().then(function(labels){
                    _this.labelsObj = labels;
                });
            };
            
            var pullVaults = function () {
            	_this.trackerVaults = TrackerVaults.listTrackerVaults($stateParams);
            };
            
            var pullVault = function () {
                $scope.vault = TrackerVaults.get($stateParams);
            };

            var bootmodule = function(){
                _this.getLabel = function(key){
                	return _this.labelsObj[key];
                };
                _this.getOwnerTxt = function (vault) {
                    return (vault.owner && vault.owner._id && (vault.owner._id === Authentication.user._id)) ? 'Me' :
                        ((vault.owner && vault.owner.displayName) ? vault.owner.displayName : 'No Name');
                };
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
                    vault.$save($stateParams,function(response) {
                        $state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams);
                        AppMessenger.sendInfoMsg('Successfully Created New Vault');
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };
                _this.editVault = function(vault) {
                    $state.go('editVault', {
                    	trackerId : $stateParams.trackerId,
                    	vaultId: vault._id
                    });
                };
                _this.updateVault = function(updatedVault){
                    var vault = updatedVault;
                    var trackerId = vault.tracker._id;
                    delete vault.tracker;
                    vault.$update($stateParams, function() {
                    	$state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams);
                        AppMessenger.sendInfoMsg('Successfully Updated the Vault');
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };
                _this.cancelVaultEdit = function(){
                	$state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams);
                };
                _this.deleteVault = function(vault) {
                    if (vault) {
                        vault.$remove({
                        	trackerId : $stateParams.trackerId,
                        	vaultId: vault._id
                        }, function(res){
                        	$state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams, {reload: true});
                            AppMessenger.sendInfoMsg('Successfully Deleted the Vault');
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
