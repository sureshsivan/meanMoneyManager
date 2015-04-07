'use strict';

// Incexps controller
angular.module('incexps').controller('IncexpsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Incexps',
        'TrackerIncexps', '$modal', '$log', 'moment', 'AppStatics', 'Notify', 'VaultStatics', '$state', 'IncexpStatics', 'AppMessenger',
	function($scope, $stateParams, $location, Authentication, Incexps,
             TrackerIncexps, $modal, $log, moment, AppStatics, Notify, VaultStatics, $state, IncexpStatics, AppMessenger) {
		var _this = this;
        this.authentication = Authentication;
		this.vaultStatics = VaultStatics;
        this.appStatics = AppStatics;
        this.incexpStatics = IncexpStatics;
        this.getCurrencies = function(){
            return this.appStatics.getCurrencies();
        };
        this.getApprovalTypes = function(){
            //this.pendingType = this.incexpStatics.getApprovalTypesForCreation()[0];
            return this.incexpStatics.getApprovalTypesForCreation();
        };
        this.getIncexpType = function(){
            //this.type = this.incexpStatics.getIncexpType()[0];
            return this.incexpStatics.getIncexpType();
        };
        this.onChangeReqApproval = function(val){
            if(! val){
                this.pendingType = null;
                this.pendingWith = null;
            }
        };
        this.vaultStatics.queryVaults($stateParams.trackerId).then(function(response){
            _this.vaultsResult = [];
            response.data.map(function(item){
                _this.vaultsResult.push(item);
            });
        });
        this.openDatePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datePickerOpened = true;
        };
        this.getInfoIconClasses = function(incExp, idx){
            //TT
            var classes = [];
            //if((idx+1)%2 === 0){
            //    classes.push('fa-user');
            //    //} else {
            //    //    classes.push('fa-user');
            //}
            //if((idx+1)%3 === 0){
            //    classes.push('fa-bell');
            //    //} else {
            //    //    classes.push('fa-thumbs-up')
            //}
            classes.push('fa-user');
            classes.push('fa-bell');
            return classes;
        };
        this.canEdit = function(incexp){
        	return incexp && incexp.owner && ((incexp.owner._id === Authentication.user._id) || 
						(incexp.pendingWith && (incexp.pendingWith._id === Authentication.user._id)));
        };
        this.canDelete = function(incexp){
        	return incexp && incexp.owner && incexp.owner._id === Authentication.user._id;
        };
        this.canRequestEditAccess = function(incexp){
        	return incexp && incexp.owner && (incexp.owner._id !== Authentication.user._id) && (! incexp.pendingWith) ;
        };
        this.applyDisablePendingFields = function(isSelected, incexp){
        	var toDisable = false;
        	if(typeof incexp === 'undefined'){
        		toDisable = !isSelected;
        	} else if(incexp && incexp.owner){
        		toDisable = (Authentication.user._id !== incexp.owner._id) || (!isSelected);
        	}
        	return toDisable;
        };
        this.applyDisableForPendingCheckbox = function(incexp){
        	if(incexp && incexp.owner){
        		return Authentication.user._id !== incexp.owner._id;	
        	} else {
        		return false;
        	}
        };
        this.findAll = function() {
            this.trackerIncexps = TrackerIncexps.listTrackerIncexps($stateParams);
        };
        this.findOne = function() {
            $scope.incexp = TrackerIncexps.get($stateParams);
        };

        this.createIncExp = function(){
            this.incexp = {};
            $state.go('createIncexp', $stateParams);
        };
        this.editIncexp = function(updatedIncexp){
            $state.go('editIncexp', {
                trackerId: $stateParams.trackerId,
                incexpId: updatedIncexp._id
            });
        };
        this.saveIncexp = function() {
            var incexp = new TrackerIncexps({
                displayName: this.displayName,
                description: this.description,
                type: this.type,
                tracker: $stateParams.trackerId,
                tags: this.tags,
                amount: this.amount,
                vault: this.vault,

                owner: this.authentication.user._id,
                created: this.created
            });
            if(this.isPending){
                incexp.isPending = this.isPending;
                incexp.pendingType = this.pendingType;
                incexp.pendingWith = this.pendingWith._id;
                incexp.pendingMsg = this.pendingMsg;
            }
            // Redirect after save
            incexp.$save(function(response) {
                $state.go('listTrackerIncexps', $stateParams);
                AppMessenger.sendInfoMsg('Successfully Created New Tracker');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        this.updateIncexp = function(updatedIncexp){
            var incexp = updatedIncexp;
            delete incexp.tracker;
            incexp.$update($stateParams, function() {
              $state.go('listTrackerIncexps', $stateParams);
              AppMessenger.sendInfoMsg('Successfully Updated the Income/Expense');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        this.requestForEdit = function(incexp){
        	alert('Requesting this for edit access...');
        };
		this.remove = function(incexp) {
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

	}
])


	//.controller('IncexpsCreateController', ['$scope', '$stateParams', 'Incexps', 'TrackerIncexps', 'Notify', 'AppStatics', 'Authentication', 'AppMessenger', 'VaultStatics', 'IncexpStatics',
	//    function($scope, $stateParams, Incexps, TrackerIncexps, Notify, AppStatics, Authentication, AppMessenger, VaultStatics, IncexpStatics) {
     //       var _this = this;
     //       this.appStatics = AppStatics;
     //       this.incexpStatics = IncexpStatics;
     //       this.authentication = Authentication;
     //       this.vaultStatics = VaultStatics;
     //       this.getCurrencies = function(){
     //           return this.appStatics.getCurrencies();
     //       };
     //       this.getApprovalTypes = function(){
     //           //this.pendingType = this.incexpStatics.getApprovalTypesForCreation()[0];
     //           return this.incexpStatics.getApprovalTypesForCreation();
     //       };
     //       this.getIncexpType = function(){
     //           //this.type = this.incexpStatics.getIncexpType()[0];
     //           return this.incexpStatics.getIncexpType();
     //       };
     //       this.onChangeReqApproval = function(val){
     //           if(! val){
     //               this.pendingType = null;
     //               this.pendingWith = null;
     //           }
     //       };
     //       this.vaultStatics.queryVaults($stateParams.trackerId).then(function(response){
     //           _this.vaultsResult = [];
     //           console.dir(response);
     //           response.data.map(function(item){
     //               console.dir(item);
     //               _this.vaultsResult.push(item);
     //           });
     //       });
     //       this.create = function() {
     //           var incexp = new TrackerIncexps({
     //               displayName: this.displayName,
     //               description: this.description,
     //               type: this.type,
     //               tracker: $stateParams.trackerId,
     //               tags: this.tags,
     //               amount: this.amount,
     //               vault: this.vault,
     //               isPending: this.isPending,
     //               pendingType: this.pendingType,
     //               pendingWith: this.pendingWith._id,
     //               pendingMsg: this.pendingMsg,
     //               owner: this.authentication.user._id,
     //               created: this.created
     //           });
     //           // Redirect after save
     //           incexp.$save(function(response) {
     //               Notify.sendMsg('RefreshIncexps', {
     //                   'trackerId': response.tracker
     //               });
     //               AppMessenger.sendInfoMsg(response);
     //           }, function(errorResponse) {
     //               $scope.error = errorResponse.data.message;
     //           });
     //       };
	//    }
	//])
	//.controller('IncexpsUpdateController', ['$scope', '$stateParams', 'Incexps', 'TrackerIncexps', 'AppStatics', 'Authentication', 'Notify',
	//    function($scope, $stateParams, Incexps, TrackerIncexps, AppStatics, Authentication, Notify) {
	//    	this.appStatics = AppStatics;
	//    	this.authentication = Authentication;
	//		 this.update = function(updatedIncexp) {
	//		     var incexp = updatedIncexp;
    //
	//		     delete incexp.tracker;
    //
	//		     incexp.$update({
	//		    	 trackerId: $stateParams.trackerId,
     //                incexpId: incexp._id
	//		     }, function() {
	//		       Notify.sendMsg('RefreshIncexps', {});
	//		     }, function(errorResponse) {
	//		         $scope.error = errorResponse.data.message;
	//		     });
	//		 };
    //
	//    }
	//])

;
