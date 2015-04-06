'use strict';

// Incexps controller
angular.module('incexps').controller('IncexpsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Incexps',
        'TrackerIncexps', '$modal', '$log', 'moment', 'AppStatics', 'Notify', 'VaultStatics', '$state',
	function($scope, $stateParams, $location, Authentication, Incexps,
             TrackerIncexps, $modal, $log, moment, AppStatics, Notify, VaultStatics, $state) {
        this.authentication = Authentication;
		this.vaultStatics = VaultStatics;
        var _this = this;
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
            console.dir(response);
            response.data.map(function(item){
                console.dir(item);
                _this.vaultsResult.push(item);
            });
        });

        this.findAll = function() {
            this.trackerIncExps = TrackerIncexps.listTrackerVaults($stateParams);
        };
        this.findOne = function() {
            $scope.incexp = Incexps.get({
                incexpId: $stateParams.incexpId
            });
        };


        this.createIncExp = function(){
            $state.go('createIncexp', $stateParams);
        };

        this.getInfoIconClasses = function(incExp, idx){
            //TT
            var classes = [];
            if((idx+1)%2 === 0){
                classes.push('fa-user');
                //} else {
                //    classes.push('fa-user');
            }
            if((idx+1)%3 === 0){
                classes.push('fa-bell');
                //} else {
                //    classes.push('fa-thumbs-up')
            }
            console.log(classes);
            return classes;
        };

        this.create = function() {
            var incexp = new TrackerIncexps({
                displayName: this.displayName,
                description: this.description,
                type: this.type,
                tracker: $stateParams.trackerId,
                tags: this.tags,
                amount: this.amount,
                vault: this.vault,
                isPending: this.isPending,
                pendingType: this.pendingType,
                pendingWith: this.pendingWith._id,
                pendingMsg: this.pendingMsg,
                owner: this.authentication.user._id,
                created: this.created
            });
            // Redirect after save
            incexp.$save(function(response) {
                Notify.sendMsg('RefreshIncexps', {
                    'trackerId': response.tracker
                });
                AppMessenger.sendInfoMsg(response);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

		//this.modalCreate = function(size) {
		//    var modalInstance = $modal.open({
		//        templateUrl: 'modules/incexps/views/create-incexp.client.view.html',
		//        controller: function($scope, $modalInstance) {
		//            $scope.ok = function() {
		//                // if (createCustomerForm.$valid){
		//                $modalInstance.close();
		//                // }
		//            };
		//            $scope.cancel = function() {
		//                $modalInstance.dismiss('cancel');
		//            };
		//        },
		//        size: size
		//    });
		//    modalInstance.result.then(function(selectedItem) {
        //
		//    	}, function() {
		//          $log.info('Modal dismissed at: ' + new Date());
		//    });
		//};
		//this.modalUpdate = function(size, selectedIncexp) {
		//    var modalInstance = $modal.open({
		//        templateUrl: 'modules/incexps/views/edit-incexp.client.view.html',
		//        controller: function($scope, $modalInstance, incexp) {
		//            $scope.incexp = incexp;
		//            $scope.ok = function() {
		//                // if (updateCustomerForm.$valid){
		//                $modalInstance.close($scope.incexp);
		//                // }
		//            };
		//            $scope.cancel = function() {
		//                $modalInstance.dismiss('cancel');
		//            };
		//        },
		//        size: size,
		//        resolve: {
		//            incexp: function() {
		//                return selectedIncexp;
		//            }
		//        }
		//    });
        //
		//    modalInstance.result.then(function(selectedItem) {
		//        $scope.selected = selectedItem;
		//    }, function() {
		//        $log.info('Modal dismissed at: ' + new Date());
		//    });
		//};



        //$location.
		// Remove existing Incexp
		this.remove = function(incexp) {
			console.log(incexp);
			if ( incexp ) {
				incexp.$remove({incexpId : incexp._id}, function(res){
                    console.log(res);
                    Notify.sendMsg('RefreshIncexps', $stateParams);
                });
			}
		};

	}
])


	.controller('IncexpsCreateController', ['$scope', '$stateParams', 'Incexps', 'TrackerIncexps', 'Notify', 'AppStatics', 'Authentication', 'AppMessenger', 'VaultStatics', 'IncexpStatics',
	    function($scope, $stateParams, Incexps, TrackerIncexps, Notify, AppStatics, Authentication, AppMessenger, VaultStatics, IncexpStatics) {
            var _this = this;
            this.appStatics = AppStatics;
            this.incexpStatics = IncexpStatics;
            this.authentication = Authentication;
            this.vaultStatics = VaultStatics;
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
                console.dir(response);
                response.data.map(function(item){
                    console.dir(item);
                    _this.vaultsResult.push(item);
                });
            });
            this.create = function() {
                var incexp = new TrackerIncexps({
                    displayName: this.displayName,
                    description: this.description,
                    type: this.type,
                    tracker: $stateParams.trackerId,
                    tags: this.tags,
                    amount: this.amount,
                    vault: this.vault,
                    isPending: this.isPending,
                    pendingType: this.pendingType,
                    pendingWith: this.pendingWith._id,
                    pendingMsg: this.pendingMsg,
                    owner: this.authentication.user._id,
                    created: this.created
                });
                // Redirect after save
                incexp.$save(function(response) {
                    Notify.sendMsg('RefreshIncexps', {
                        'trackerId': response.tracker
                    });
                    AppMessenger.sendInfoMsg(response);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
	    }
	])
	.controller('IncexpsUpdateController', ['$scope', '$stateParams', 'Incexps', 'TrackerIncexps', 'AppStatics', 'Authentication', 'Notify',
	    function($scope, $stateParams, Incexps, TrackerIncexps, AppStatics, Authentication, Notify) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
			 this.update = function(updatedIncexp) {
			     var incexp = updatedIncexp;

			     delete incexp.tracker;

			     incexp.$update({
			    	 trackerId: $stateParams.trackerId,
                     incexpId: incexp._id
			     }, function() {
			       Notify.sendMsg('RefreshIncexps', {});
			     }, function(errorResponse) {
			         $scope.error = errorResponse.data.message;
			     });
			 };

	    }
	])

;
