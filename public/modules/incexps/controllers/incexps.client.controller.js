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
			var deferred = $q.defer();
			IncexpLocaleMessages.pullMessages().then(function(labels){
    			_this.labelsObj = labels;
    			deferred.resolve(null);
            });
            return deferred.promise;
        };
        var pullVaults = function(){
        	var deferred = $q.defer();
            _this.vaultStatics.queryVaults($stateParams.trackerId).then(function(response){
                _this.vaultsResult = [];
                response.data.map(function(item){
                    _this.vaultsResult.push(item);
                });
                deferred.resolve(null);
            });
            return deferred.promise;
        };
        var pullIncexpTypes = function(){
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
                    deferred.resolve(null);
                });	
        	}
        	
            return deferred.promise;
        };
        var loadCurrencies = function(){
        	console.log('Load Currencies');
        	return AppStatics.loadCurrencies();
        };
        
        var pullIncexps = function () {
        	console.log('Load Incexps.......');
        	_this.trackerIncexps = TrackerIncexps.listTrackerIncexps($stateParams);
        	return _this.trackerIncexps.$promise; 
        };

        var loadIncexpAlerts = function(response){
        	console.log('Load INcexp alerts...');
        	var deferred = $q.defer();
            response.$promise.then(function(incexps){
            	console.dir(incexps);
                for(var i=0; i<incexps.length; i++){
                    var incexp = incexps[i];
                    console.log('>>> : ' + incexps.length);
                    console.log('>>> : ' + incexp.currency);
                    incexp.infoAlerts = [];
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
                        if(incexp.owner._id === Authentication.user._id){
                            incexp.infoAlerts.push({
                                'clazz': 'fa-user info-icon',
                                'tooltip': _this.labelsObj['app.incexps.tt.createdByMe']
                            });
                        }
                        incexp.infoAlerts.push({
                            'clazz': 'fa-check-circle info-icon',
                            'tooltip': _this.labelsObj['app.incexps.tt.allOk']
                        });
                    }
                    incexp.collapsed = true;
//                    incexp.currency = AppStatics.getCurrencyObj(incexp.currency);
                    incexp.currencyObj = AppStatics.getCurrencyObj(incexp.currency);
                    deferred.resolve(null);
                }
            });
            return deferred.promise; 
        };

        var bootmodule = function(){
            _this.getLabel = function(key){
            	console.log(key);
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
            //_this.applyDisablePendingFields = function(isSelected, incexp){
            //	var toDisable = false;
            //	if(typeof incexp === 'undefined'){
            //		toDisable = !isSelected;
            //	} else if(incexp && incexp.owner){
            //		toDisable = (Authentication.user._id !== incexp.owner._id) || (!isSelected);
            //	}
            //	return toDisable;
            //};
            //_this.applyDisableForPendingCheckbox = function(incexp){
            //	if(incexp && incexp.owner){
            //		return Authentication.user._id !== incexp.owner._id;
            //	} else {
            //		return false;
            //	}
            //};
            _this.findAll = function() {
                _this.trackerIncexps = TrackerIncexps.listTrackerIncexps($stateParams);
            };
            _this.findOne = function() {
                $scope.incexp = TrackerIncexps.get($stateParams);
            };

            _this.createIncexp = function(){
                _this.incexp = {};
                $state.go(INCEXP_CONST.CREATE_INCEXP_STATE_NAME, $stateParams);
            };
            _this.editIncexp = function(updatedIncexp){
                $state.go('editIncexp', {
                    trackerId: $stateParams.trackerId,
                    incexpId: updatedIncexp._id
                });
            };
            _this.saveIncexp = function() {
                console.log(_this);
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
        
        if($state.current.name === INCEXP_CONST.LIST_INCEXPS_STATE_NAME){
        	pullMsgs().then(loadCurrencies).then(pullIncexps).then(loadIncexpAlerts).then(bootmodule);
//        	pullMsgs().then(bootmodule);
//        	$q.all([pullMsgs, loadCurrencies, pullIncexps]).then(bootmodule);
        } else if($state.current.name === INCEXP_CONST.CREATE_INCEXP_STATE_NAME){
        	pullMsgs().then(pullVaults).then(pullIncexpTypes).then(bootmodule);
            _this.approvalModel = {'isPending': false, 'pendingType': null,'pendingMsg': null};
        }
        
//        loadmsgs().then(loadvaults).then(bootmodule);
        //$q.all([loadmsgs, loadvaults]).then(bootmodule);

	}
])

;
