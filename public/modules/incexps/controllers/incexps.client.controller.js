'use strict';

// Incexps controller
angular.module('incexps').controller('IncexpsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Incexps',
        'TrackerIncexps', '$modal', '$log', 'moment', 'AppStatics', 'Notify', 'VaultStatics', '$state', 'IncexpStatics', 'AppMessenger', 'IncexpLocaleMessages', '$q', 'INCEXP_CONST',
	function($scope, $stateParams, $location, Authentication, Incexps,
             TrackerIncexps, $modal, $log, moment, AppStatics, Notify, VaultStatics, $state, IncexpStatics, AppMessenger, IncexpLocaleMessages, $q, INCEXP_CONST) {
		var _this = this;
        _this.authentication = Authentication;
		_this.vaultStatics = VaultStatics;
        _this.appStatics = AppStatics;
        _this.incexpStatics = IncexpStatics;
        $scope.$stateParams = $stateParams;
        var minDate = new Date();
        minDate.setDate(minDate.getDate() - 60);
        $scope.minDate = minDate;
        $scope.maxDate = new Date();
        //	TODO - bootstrapping the module only if the dependencies are loaded 
        //	Not sure whether this is correct way - but it works.

        var pullMsgs = function(){
            console.log('Start Pull Msg');
			var deferred = $q.defer();
			IncexpLocaleMessages.pullMessages().then(function(labels){
                console.log('Complete Pull Msg');
    			_this.labelsObj = labels;
    			deferred.resolve(null);
            });
            return deferred.promise;
        };
        var pullVaults = function(){
            console.log('Start Pull Vaults');
        	var deferred = $q.defer();
            _this.vaultStatics.queryVaults($stateParams.trackerId).then(function(response){
                _this.vaultsResult = [];
                response.data.map(function(item){
                    _this.vaultsResult.push(item);
                });
                console.log('Complete Pull Vault');
                deferred.resolve(null);
            });
            return deferred.promise;
        };
        var pullIncexpTypes = function(){
            console.log('Start Pull Types');
        	var deferred = $q.defer();
        	var cachedVal = _this.incexpStatics.getIncexpTypes();
        	//	If value is already cached by service - then use it otherwise 
        	if(cachedVal){
        		_this.incexpTypes = cachedVal;
        		deferred.resolve(null);
        	} else {
        		_this.incexpStatics.loadIncexpTypes().then(function(response){
                    _this.incexpTypes = [];
                    response.map(function(item){
                        _this.incexpTypes.push(item);
                    });
                    console.log('Complete Pull Types');
                    deferred.resolve(null);
                });	
        	}
        	
            return deferred.promise;
        };
        var pullTags = function(){
            console.log('Start Pull Tags');
            var deferred = $q.defer();
            var cachedVal = _this.incexpStatics.getIncexpTags();
            //	If value is already cached by service - then use it otherwise
            if(cachedVal){
                _this.incexpTags = cachedVal;
                console.log('Complete Pull Tags');
                deferred.resolve(null);
            } else {
                _this.incexpStatics.loadIncexpTags().then(function(response){
                    _this.incexpTags = [];
                    response.map(function(item){
                        _this.incexpTags.push(item);
                    });
                    console.log('Complete Pull Tags');
                    deferred.resolve(null);
                });
            }

            return deferred.promise;
        };
        var loadCurrencies = function(){
            console.log('Start Pull Currencies');
        	return AppStatics.loadCurrencies();
        };
        
        var pullIncexps = function () {
            console.log('Start pullIncexps');
        	_this.trackerIncexps = TrackerIncexps.listTrackerIncexps($stateParams);
        	return _this.trackerIncexps.$promise; 
        };
        var pullIncexp = function () {
            console.log('Start Pull Incexp');
            var deferred = $q.defer();
            TrackerIncexps.get($stateParams).$promise.then(function(response){
                $scope.incexp = response;
                if($scope.incexp.isPending){
                    console.log(44);
                    _this.approvalModel = {
                        'isPending': $scope.incexp.isPending,
                        'pendingType': $scope.incexp.pendingType,
                        'pendingWith' : $scope.incexp.pendingWith,
                        'pendingMsg': $scope.incexp.pendingMsg
                    };
                } else {
                    console.log(55);
                    _this.approvalModel = {'isPending': false};
                }

                console.log('Complete Pull Incexp');
                deferred.resolve(null);
            });
            return deferred.promise;
        };
        var loadIncexpAlerts = function(response){
            console.log('Start Pull loadIncexpAlerts');
        	var deferred = $q.defer();
            response.$promise.then(function(incexps){
                for(var i=0; i<incexps.length; i++){
                    var incexp = incexps[i];
                    incexp.infoAlerts = [];
                    if(incexp.owner._id === Authentication.user._id){
                        incexp.infoAlerts.push({
                            'clazz': 'fa-user info-icon',
                            'tooltip': _this.labelsObj['app.incexps.tt.createdByMe']
                        });
                    }
                    if(incexp.isPending && incexp.pendingWith._id === Authentication.user._id){
                        incexp.infoAlerts.push({
                            'clazz': 'fa-warning danger-icon',
                            'tooltip': _this.labelsObj['app.incexps.tt.requireActionFrmMe']
                        });
                    }
                    if(incexp.isPending && incexp.pendingWith._id !== Authentication.user._id){
                        incexp.infoAlerts.push({
                            'clazz': 'fa-exclamation-circle warn-icon',
                            'tooltip': _this.labelsObj['app.incexps.tt.requireActionFrm'] + incexp.pendingWith.displayName
                        });
                    }
                    if(incexp.infoAlerts.length === 0){
                        incexp.infoAlerts.push({
                            'clazz': 'fa-check-circle info-icon',
                            'tooltip': _this.labelsObj['app.incexps.tt.allOk']
                        });
                    }
                    incexp.collapsed = true;
                    incexp.currencyObj = AppStatics.getCurrencyObj(incexp.tracker.currency);
                    console.log('Start Pull loadIncexpAlerts');
                    deferred.resolve(null);
                }
            });
            return deferred.promise; 
        };

        var bootmodule = function(){
            console.log('Start Boot module');
              //populate 'approvalModel' for the directive
            if($scope.incexp){  //  Editing an item

            } else {    //  For New Income Expense Creation
                console.log('_this.approvalModel');
                _this.approvalModel = {'isPending': false, 'pendingType': null,'pendingMsg': null};
            }
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
            _this.onChangeReqApproval = function(val){
                if(! val){
                    _this.pendingType = null;
                    _this.pendingWith = null;
                }
            };
            _this.openDatePicker = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.datePickerOpened = true;
            };
            _this.expandRow = function(incexpArg){
                if(!incexpArg.collapsed){
                    incexpArg.collapsed = true;
                    return;
                }
                for(var i=0; i<_this.trackerIncexps.length; i++){
                    var incexp = _this.trackerIncexps[i];
                    if(incexp._id === incexpArg._id){
                        incexp.collapsed = false;
                    } else {
                        incexp.collapsed = true;
                    }
                }
            };
            //_this
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
            _this.canApprove = function(incexp){
                return incexp && incexp.isPending && (incexp.pendingWith._id === Authentication.user._id);
            };
            _this.canApproveEditRequest = function(incexp){
                return incexp && incexp.isPending && (incexp.pendingWith._id === Authentication.user._id)
                    && (incexp.owner._id === Authentication.user._id);
            };
            _this.createIncexp = function(){
                _this.incexp = {};
                $state.go(INCEXP_CONST.CREATE_INCEXP_STATE_NAME, $stateParams);
            };
            _this.editIncexp = function(updatedIncexp){
                $state.go(INCEXP_CONST.EDIT_INCEXP_STATE_NAME, {
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
                if(_this.approvalModel && _this.approvalModel.isPending){
                    incexp.isPending = _this.approvalModel.isPending;
                    incexp.pendingType = _this.approvalModel.pendingType;
                    incexp.pendingWith = _this.approvalModel.pendingWith._id;
                    incexp.pendingMsg = _this.approvalModel.pendingMsg;
                }
                // Redirect after save
                incexp.$save($stateParams, function(response) {
                    $state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams);
                    AppMessenger.sendInfoMsg('Successfully Created New Tracker');
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            _this.cancel = function(){
                $state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams);
            };
            _this.updateIncexp = function(updatedIncexp){
                var incexp = updatedIncexp;
                if(_this.approvalModel && _this.approvalModel.isPending){
                    incexp.isPending = _this.approvalModel.isPending;
                    incexp.pendingType = _this.approvalModel.pendingType;
                    incexp.pendingWith = _this.approvalModel.pendingWith._id;
                    incexp.pendingMsg = _this.approvalModel.pendingMsg;
                }
                delete incexp.tracker;
                incexp.$update($stateParams, function() {
                  $state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams);
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
    					$state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams, {reload: true});
    		            AppMessenger.sendInfoMsg('Successfully Deleted the Income/Expense');
                    });
    			}
    		};        	
        };
        
        if($state.current.name === INCEXP_CONST.LIST_INCEXPS_STATE_NAME){
        	pullMsgs().then(loadCurrencies).then(pullIncexps).then(loadIncexpAlerts).then(bootmodule);
        } else if($state.current.name === INCEXP_CONST.CREATE_INCEXP_STATE_NAME){
        	pullMsgs().then(pullVaults).then(pullIncexpTypes).then(pullTags).then(bootmodule);
            //TODO - load up this with boot module
            _this.approvalModel = {'isPending': false, 'pendingType': null,'pendingMsg': null};
        } else if($state.current.name === INCEXP_CONST.EDIT_INCEXP_STATE_NAME){
            pullMsgs().then(pullVaults).then(pullIncexpTypes).then(pullTags).then(pullIncexp).then(bootmodule);
        }
	}
])

;
