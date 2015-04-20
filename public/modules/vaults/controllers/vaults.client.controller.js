'use strict';

// Vaults controller
angular.module('vaults')



    .controller('VaultsController', ['$scope', '$stateParams', 'Authentication', '$state', 'VAULT_CONST',
                'TrackerVaults', 'moment', 'AppStatics', 'AppMessenger', 'VaultLocaleMessages', '$q',
        function($scope, $stateParams, Authentication, $state, VAULT_CONST, 
                    TrackerVaults, moment, AppStatics, AppMessenger, VaultLocaleMessages, $q) {
            var _this = this;
            _this.authentication = Authentication;
            _this.appStatics = AppStatics;
            $scope.$stateParams = $stateParams;
            var pullMsgs = function(){
            	var deferred = $q.defer();
            	VaultLocaleMessages.pullMessages().then(function(labels){
                    _this.labelsObj = labels;
                    deferred.resolve(null);
                });
                return deferred.promise;
            };
            
            var pullVaults = function () {
            	_this.trackerVaults = TrackerVaults.listTrackerVaults($stateParams);
            	return _this.trackerVaults.$promise;
            };
            
            var pullVault = function () {
                $scope.vault = TrackerVaults.get($stateParams);
                return $scope.vault.$promise;
            };

            var bootmodule = function(){
                _this.getOwnerTxt = function (vault) {
                    return (vault.owner && vault.owner._id && (vault.owner._id === Authentication.user._id)) ? 'Me' :
                        ((vault.owner && vault.owner.displayName) ? vault.owner.displayName : 'No Name');
                };
                _this.createVault = function() {
                    _this.vault = {};
                    $state.go(VAULT_CONST.CREATE_VAULT_STATE_NAME, $stateParams);
                };
                _this.editVault = function(vault) {
                    $state.go(VAULT_CONST.EDIT_VAULT_STATE_NAME, {
                    	trackerId : $stateParams.trackerId,
                    	vaultId: vault._id
                    });
                };
                _this.cancel = function(){
                	$state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams);
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
                        AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.createdVault']);
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };
                _this.updateVault = function(updatedVault){
                    var vault = updatedVault;
                    var trackerId = vault.tracker._id;
                    delete vault.tracker;
                    vault.$update($stateParams, function() {
                    	$state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams);
                        AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.updatedVault']);
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                _this.deleteVault = function(vault) {
                    if (vault) {
                        vault.$remove({
                        	trackerId : $stateParams.trackerId,
                        	vaultId: vault._id
                        }, function(res){
                        	$state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams, {reload: true});
                            AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.deletedVault']);
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
