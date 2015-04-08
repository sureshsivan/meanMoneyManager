'use strict';

// Incexps controller
angular.module('incexps').controller('IncexpsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Incexps',
        'TrackerIncexps', '$modal', '$log', 'moment', 'AppStatics', 'Notify', 'VaultStatics', '$state', 'IncexpStatics', 'AppMessenger', 'IncexpLocaleMessages', 
	function($scope, $stateParams, $location, Authentication, Incexps,
             TrackerIncexps, $modal, $log, moment, AppStatics, Notify, VaultStatics, $state, IncexpStatics, AppMessenger, IncexpLocaleMessages) {
		var _this = this;
        this.authentication = Authentication;
		this.vaultStatics = VaultStatics;
        this.appStatics = AppStatics;
        this.incexpStatics = IncexpStatics;
        //	TODO - bootstrapping the module only if the dependencies are loaded 
        //	Not sure whether this is correct way - but it works.
        loadMessages().then(loadVaults).then(bootIncexModule);
        
        function loadMessages(){
        	return IncexpLocaleMessages.pullMessages().then(function(response){
    			_this.labelsObj = response.data;
            })
        };
        function loadVaults(){
            return _this.vaultStatics.queryVaults($stateParams.trackerId).then(function(response){
                _this.vaultsResult = [];
                response.data.map(function(item){
                    _this.vaultsResult.push(item);
                });
            });
        }
        function bootIncexModule(){
            _this.getLabel = function(key){
            	return _this.labelsObj[key];
            }; 
            _this.getCurrencies = function(){
                return _this.appStatics.getCurrencies();
            };
            _this.getApprovalTypes = function(){
                //_this.pendingType = _this.incexpStatics.getApprovalTypesForCreation()[0];
                return _this.incexpStatics.getApprovalTypesForCreation();
            };
            _this.getIncexpType = function(){
                //_this.type = _this.incexpStatics.getIncexpType()[0];
                return _this.incexpStatics.getIncexpType();
            };
            _this.onChangeReqApproval = function(val){
                if(! val){
                    _this.pendingType = null;
                    _this.pendingWith = null;
                }
            };
            _this.vaultStatics.queryVaults($stateParams.trackerId).then(function(response){
                _this.vaultsResult = [];
                response.data.map(function(item){
                    _this.vaultsResult.push(item);
                });
            });
            _this.openDatePicker = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.datePickerOpened = true;
            };
            _this.getInfoIconClasses = function(incExp, idx){
                var classes = [];
                classes.push('fa-user');
                classes.push('fa-bell');
                return classes;
            };
            _this.canEdit = function(incexp){
            	return incexp && incexp.owner && ((incexp.owner._id === Authentication.user._id) || 
    						(incexp.pendingWith && (incexp.pendingWith._id === Authentication.user._id)));
            };
            _this.canDelete = function(incexp){
            	return incexp && incexp.owner && incexp.owner._id === Authentication.user._id;
            };
            _this.canRequestEditAccess = function(incexp){
            	return incexp && incexp.owner && (incexp.owner._id !== Authentication.user._id) && (! incexp.pendingWith) ;
            };
            _this.applyDisablePendingFields = function(isSelected, incexp){
            	var toDisable = false;
            	if(typeof incexp === 'undefined'){
            		toDisable = !isSelected;
            	} else if(incexp && incexp.owner){
            		toDisable = (Authentication.user._id !== incexp.owner._id) || (!isSelected);
            	}
            	return toDisable;
            };
            _this.applyDisableForPendingCheckbox = function(incexp){
            	if(incexp && incexp.owner){
            		return Authentication.user._id !== incexp.owner._id;	
            	} else {
            		return false;
            	}
            };
            _this.findAll = function() {
                _this.trackerIncexps = TrackerIncexps.listTrackerIncexps($stateParams);
            };
            _this.findOne = function() {
                $scope.incexp = TrackerIncexps.get($stateParams);
            };

            _this.createIncExp = function(){
                _this.incexp = {};
                $state.go('createIncexp', $stateParams);
            };
            _this.editIncexp = function(updatedIncexp){
                $state.go('editIncexp', {
                    trackerId: $stateParams.trackerId,
                    incexpId: updatedIncexp._id
                });
            };
            _this.saveIncexp = function() {
                var incexp = new TrackerIncexps({
                    displayName: _this.displayName,
                    description: _this.description,
                    type: _this.type,
                    tracker: $stateParams.trackerId,
                    tags: _this.tags,
                    amount: _this.amount,
                    vault: _this.vault,
                    owner: _this.authentication.user._id,
                    created: _this.created
                });
                if(_this.isPending){
                    incexp.isPending = _this.isPending;
                    incexp.pendingType = _this.pendingType;
                    incexp.pendingWith = _this.pendingWith._id;
                    incexp.pendingMsg = _this.pendingMsg;
                }
                // Redirect after save
                incexp.$save(function(response) {
                    $state.go('listTrackerIncexps', $stateParams);
                    AppMessenger.sendInfoMsg('Successfully Created New Tracker');
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            
            _this.updateIncexp = function(updatedIncexp){
                var incexp = updatedIncexp;
                delete incexp.tracker;
                incexp.$update($stateParams, function() {
                  $state.go('listTrackerIncexps', $stateParams);
                  AppMessenger.sendInfoMsg('Successfully Updated the Income/Expense');
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            _this.requestForEdit = function(incexp){
            	alert('Requesting _this for edit access...');
            };
    		_this.remove = function(incexp) {
    			if ( incexp ) {
    				incexp.$remove({
    						incexpId : incexp._id,
    						trackerId: $stateParams.trackerId
    					}, function(res){
    					$state.go('listTrackerIncexps', $stateParams, {reload: true});
    		            AppMessenger.sendInfoMsg('Successfully Deleted the Income/Expense');
                    });
    			}
    		};        	
        };


	}
])

;
