'use strict';

// Vaults controller
angular.module('vaults')



    .controller('VaultsController', ['$scope', '$stateParams', '$location', 'Authentication', '$state',
                'Vaults', 'TrackerVaults', '$modal', '$log', 'moment', 'AppStatics', 'Notify', 'AppMessenger',
        function($scope, $stateParams, $location, Authentication, $state,
                    Vaults, TrackerVaults, $modal, $log, moment, AppStatics, Notify, AppMessenger) {
            var _this = this;
            _this.authentication = Authentication;
            _this.appStatics = AppStatics;


            //var pullMsgs = function(){
            //    return TrackerLocaleMessages.pullMessages().then(function(labels){
            //        _this.labelsObj = labels;
            //    });
            //};
            //
            //var pullTrackers = function () {
            //    _this.trackers = Trackers.query();
            //};
            //
            //var pullTracker = function () {
            //    $scope.tracker = Trackers.get({
            //        trackerId: $stateParams.trackerId
            //    });
            //};


            _this.findAll = function() {
                _this.trackerVaults = TrackerVaults.listTrackerVaults($stateParams);
            };
            _this.findOne = function() {
                $scope.vault = Vaults.get({
                    vaultId: $stateParams.vaultId
                });
            };
            _this.createVault = function() {
                _this.vault = {};
                $state.go('createVault', $stateParams);
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

        }
    ])

;
