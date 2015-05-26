'use strict';

// Incexps controller
angular.module('incexps').controller('IncexpsController', ['$scope', '$stateParams', '$location', 'Authentication', '$filter', '$timeout', 
        'TrackerIncexps', '$modal', '$log', 'moment', 'AppStatics', 'Notify', 'VaultStatics', '$state', 'IncexpStatics', 'AppMessenger', 'IncexpLocaleMessages', '$q', 'INCEXP_CONST', 'ChartService', 
	function($scope, $stateParams, $location, Authentication, $filter, $timeout, 
             TrackerIncexps, $modal, $log, moment, AppStatics, Notify, VaultStatics, $state, IncexpStatics, AppMessenger, IncexpLocaleMessages, $q, INCEXP_CONST, ChartService) {
		var _this = this;
        $scope.parseInt = parseInt;
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
        	//	dummy comment
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
        var pullTags = function(){
            var deferred = $q.defer();
            var cachedVal = _this.incexpStatics.getIncexpTags();
            //	If value is already cached by service - then use it otherwise
            if(cachedVal){
                _this.incexpTags = cachedVal;
                deferred.resolve(null);
            } else {
                _this.incexpStatics.loadIncexpTags().then(function(response){
                    _this.incexpTags = [];
                    response.map(function(item){
                        _this.incexpTags.push(item);
                    });
                    deferred.resolve(null);
                });
            }

            return deferred.promise;
        };


        var pullApprovalTypes = function(){
            var displayMode = 'CREATE';
            var deferred = $q.defer();
            var cachedVal = _this.incexpStatics.getApprovalTypes();
            //	If value is already cached by service - then use it otherwise
            if(cachedVal){
                _this.approvalTypes = [];
                cachedVal.map(function(item){
                    if(displayMode){
                        if(item && item.displayMode &&
                            (item.displayMode.indexOf(displayMode) > -1 || item.displayMode.indexOf('ALL') > -1)){
                            _this.approvalTypes.push(item);
                        }
                    } else {
                        _this.approvalTypes.push(item);
                    }
                });
                deferred.resolve(null);
            } else {
                _this.incexpStatics.loadApprovalTypes().then(function(response){
                    _this.approvalTypes = [];
                    response.map(function(item){
                        if(displayMode){
                            if(item && item.displayMode &&
                                (item.displayMode.indexOf(displayMode) > -1 || item.displayMode.indexOf('ALL') > -1)){
                                _this.approvalTypes.push(item);
                            }
                        } else {
                            _this.approvalTypes.push(item);
                        }
                    });
                    deferred.resolve(null);
                });
            }

            return deferred.promise;
        };

        var loadCurrencies = function(){
        	return AppStatics.loadCurrencies();
        };
        
        var pullIncexps = function () {
        	_this.trackerIncexps = TrackerIncexps.listTrackerIncexps($stateParams);
        	return _this.trackerIncexps.$promise; 
        };
        var pullIncexpsByMonth = function () {
            _this.trackerIncexps = TrackerIncexps.listTrackerIncexpsByMonth($stateParams);
            return _this.trackerIncexps.$promise;
        };


        var pullIncexp = function () {
            var deferred = $q.defer();
            TrackerIncexps.get($stateParams).$promise.then(function(response){
                $scope.incexp = response;
                if($scope.incexp.isPending){
                    _this.approvalModel = {
                        'isPending': $scope.incexp.isPending,
                        'pendingType': $scope.incexp.pendingType,
                        'pendingWith' : $scope.incexp.pendingWith,
                        'pendingMsg': $scope.incexp.pendingMsg
                    };
                } else {
                    _this.approvalModel = {'isPending': false};
                }

                deferred.resolve(null);
            });
            return deferred.promise;
        };
        var loadIncexpAlerts = function(response){
        	var deferred = $q.defer();
            response.$promise.then(function(incexps){
                for(var i=0; i<incexps.length; i++){
                    var incexp = incexps[i];
                    incexp.infoAlerts = [];
                    if(!incexp.isPending){
                        incexp.infoAlerts.push({
                            'clazz': 'fa-check-circle info-icon lpad',
                            'tooltip': _this.labelsObj['app.incexps.tt.allOk']
                        });
                    } else {
                        if(incexp.pendingWith._id === Authentication.user._id){
                            incexp.infoAlerts.push({
                                'clazz': 'fa-exclamation-circle danger-icon lpad',
                                'tooltip': _this.labelsObj['app.incexps.tt.requireActionFrmMe']
                            });
                        }else {
                            incexp.infoAlerts.push({
                                'clazz': 'fa-exclamation-circle warn-icon lpad',
                                'tooltip': _this.labelsObj['app.incexps.tt.requireActionFrm'] + incexp.pendingWith.displayName
                            });
                        }
                    }
                    if(incexp.owner._id === Authentication.user._id){
                        incexp.infoAlerts.push({
                            'clazz': 'fa-user info-icon',
                            'tooltip': _this.labelsObj['app.incexps.tt.createdByMe']
                        });
                    } else {
                        incexp.infoAlerts.push({
                            'clazz': 'fa-user-secret info-icon',
                            'tooltip': _this.labelsObj['app.incexps.tt.createdByOther']
                        });
                    }
                    incexp.collapsed = true;
                    incexp.currencyObj = AppStatics.getCurrencyObj(incexp.tracker.currency);
                }
                deferred.resolve(null);
            });
            return deferred.promise; 
        };

        var bootmodule = function(){
              //populate 'approvalModel' for the directive
            if($scope.incexp){  //  Editing an item
            	console.log('Sample Log');
            } else {    //  For New Income Expense Creation
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
            _this.canEdit = function(incexp){
            	return incexp && incexp.owner && ((incexp.owner._id === Authentication.user._id) || 
    						(incexp.pendingWith && incexp.pendingType === 'UPD_REQ' && incexp.pendingWith._id === Authentication.user._id)) &&
                    (! (incexp.isPending && incexp.pendingType === 'UPD_ACC_REQ'));
            };
            _this.canDelete = function(incexp){
            	return incexp && incexp.owner && incexp.owner._id === Authentication.user._id &&
                    (! (incexp.isPending && incexp.pendingType === 'UPD_ACC_REQ'));
            };
            _this.canRequestEditAccess = function(incexp){
            	return incexp && incexp.owner && (incexp.owner._id !== Authentication.user._id) && (! incexp.pendingWith) ;
            };
            _this.canApproveEditRequest = function(incexp){
                return incexp && incexp.isPending && (incexp.pendingWith._id === Authentication.user._id) &&
                    (incexp.owner._id === Authentication.user._id) && (incexp.pendingType === 'UPD_ACC_REQ');
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
            _this.showNextMonth = function(){
            	if((parseInt($stateParams.month) === parseInt($scope.now.getMonth()+1)) && (parseInt($stateParams.year) === parseInt($scope.now.getFullYear()))){
            		AppMessenger.sendInfoMsg('Cannot move to Future');
            		return;
            	}
            	var nav = $filter('navmonths')($stateParams.month, $stateParams.year, 1);
            	nav.trackerId = $stateParams.trackerId;
                $state.go($state.current.name, nav, {reload: true});
            };
            _this.showPrevMonth = function(){
            	if((parseInt($stateParams.month) === parseInt($scope.now.getMonth()+1)) && (parseInt($stateParams.year) === parseInt($scope.now.getFullYear()-1))){
            		AppMessenger.sendInfoMsg('Cannot move beyond 1 Yr');
            		return;
            	}
                var nav = $filter('navmonths')($stateParams.month, $stateParams.year, -1);
                nav.trackerId = $stateParams.trackerId;
                $state.go($state.current.name, nav, {reload: true});
            };
            _this.saveIncexp = function() {
                //amDateFormat
                //evDate : $filter('amDateFormat')(_this.evDate,'dd-MMMM-yyyy'),
                //$filter('amDateFormat')(item.evDate,'YYYYMMDD')
                var incexp = new TrackerIncexps({
                    displayName: _this.displayName,
                    description: _this.description,
                    type: _this.type,
                    tracker: $stateParams.trackerId,
                    tags: _this.tags,
                    //evDate : $filter('date')(_this.evDate,'dd-MMMM-yyyy', '+0530'),
                    evDate : _this.evDate,
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
                    var current = moment(_this.evDate);
                    var month = current.format('MM');
                    var year = current.format('YYYY');
                    $state.go(INCEXP_CONST.LIST_INCEXPS_BY_MONTH_STATE_NAME, {
                        trackerId: $stateParams.trackerId,
                        month : month,
                        year: year
                    });
                    //$state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams);
                    AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.createdIncexp']);
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
                } else {
                	incexp.isPending = false;
                    incexp.pendingType = null;
                    incexp.pendingWith = null;
                    incexp.pendingMsg = null;
                }
                delete incexp.tracker;
                incexp.$update($stateParams, function() {
                    var current = moment(incexp.evDate);
                    var month = current.format('MM');
                    var year = current.format('YYYY');
                    $state.go(INCEXP_CONST.LIST_INCEXPS_BY_MONTH_STATE_NAME, {
                        trackerId: $stateParams.trackerId,
                        month : month,
                        year: year
                    });
                  //$state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams);
                  AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.updatedIncexp']);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            _this.approveIncexpChanges = function(updatedIncexp){
                var incexp = updatedIncexp;
                delete incexp.isPending;
                delete incexp.pendingType;
                delete incexp.pendingWith;
                delete incexp.pendingMsg;
                delete incexp.tracker;
                incexp.$approveIncexpChanges($stateParams, function() {
                    $state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams);
                    AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.approveIncexpChanges']);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            _this.requestForEdit = function(incexp){
                incexp.$requestEditAccess({
                    incexpId : incexp._id
                }, function(response){
                    $state.go($state.current.name, $stateParams, {reload: true});
                    //$state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams, {reload: true});
                    AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.reqEditAccess']);
                });
            };
            _this.approveEditAccessRequest = function(incexp){
                incexp.$approveEditAccessRequest({
                    incexpId : incexp._id
                }, function(response){
                    $state.go($state.current.name, $stateParams, {reload: true});
                    //$state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams, {reload: true});
                    AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.approveIncexpEditAccReq']);
                });
            };
            _this.rejectEditAccessRequest = function(incexp){
                incexp.$rejectEditAccessRequest({
                    incexpId : incexp._id
                }, function(response){
                    $state.go($state.current.name, $stateParams, {reload: true});
                    //$state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams, {reload: true});
                    AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.rejectIncexpEditAccReq']);
                });
            };
    		_this.remove = function(incexp) {
    			if ( incexp ) {
    				incexp.$remove({
    						incexpId : incexp._id,
    						trackerId: $stateParams.trackerId
    					}, function(res){
                        $state.go($state.current.name, $stateParams, {reload: true});
    					//$state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams, {reload: true});
    		            AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.deletedIncexp']);
                    });
    			}
    		};
        };
        var loadCharts = function(){
        	return $timeout(function(){
        		$scope.incomeHeatMapChartConfig = ChartService.getIncomeHeatMapConfig(_this.labelsObj, _this.trackerIncexps);
                $scope.expenseHeatMapChartConfig = ChartService.getExpenseHeatMapConfig(_this.labelsObj, _this.trackerIncexps);
        	}, 1);
        };
        if($state.current.name === INCEXP_CONST.LIST_INCEXPS_STATE_NAME){
            pullMsgs().then(loadCurrencies).then(pullIncexps).then(loadIncexpAlerts).then(bootmodule);
        } else if($state.current.name === INCEXP_CONST.LIST_INCEXPS_BY_MONTH_STATE_NAME){
            pullMsgs().then(loadCurrencies).then(pullIncexpsByMonth).then(loadIncexpAlerts).then(bootmodule);
            $scope.monthlyView = true;
            $scope.now = new Date();
        } else if($state.current.name === INCEXP_CONST.CREATE_INCEXP_STATE_NAME){
        	pullMsgs().then(pullVaults).then(pullIncexpTypes).then(pullTags).then(pullApprovalTypes).then(bootmodule);
            //TODO - load up this with boot module
            _this.approvalModel = {'isPending': false, 'pendingType': null,'pendingMsg': null};
        } else if($state.current.name === INCEXP_CONST.EDIT_INCEXP_STATE_NAME){
            pullMsgs().then(pullVaults).then(pullIncexpTypes).then(pullTags).then(pullApprovalTypes).then(pullIncexp).then(bootmodule);
        } else if($state.current.name === INCEXP_CONST.DASH_INCEXPS_BY_MONTH_STATE_NAME){
            pullMsgs().then(pullIncexpsByMonth).then(loadCharts).then(bootmodule);
            $scope.monthlyView = true;
            $scope.now = new Date();
        }
	}
])

;
