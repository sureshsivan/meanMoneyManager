'use strict';

// Trackers controller


angular.module('trackers')
    .controller('TrackersController', ['$scope', '$stateParams', '$location', 'Authentication',
            'Trackers', '$modal', '$log', 'moment', 'AppStatics', '$state',  'UserStatics',
            'Notify', 'AppMessenger', //'angularMoment',
        function($scope, $stateParams, $location, Authentication,
                 Trackers, $modal, $log, moment, AppStatics, $state, UserStatics,
                 Notify, AppMessenger) {
            this.appStatics = AppStatics;
            this.userStatics = UserStatics;
            this.authentication = Authentication;
            this.assignedUsers = [];
            this.assignedUsers.push(Authentication.user);
            this.trackers = Trackers.query();
            this.getLocalTime = function(time){
                return moment(time).toString();
            };
            this.getOwnerTxt = function(tracker){
                return (tracker.owner && tracker.owner._id && (tracker.owner._id.toString() === Authentication.user._id.toString()))	? 'Me - This is my Awesome tracker' :
                    ((tracker.owner && tracker.owner.displayName) ? tracker.owner.displayName : 'No Name');
            };
            this.getCurrencies = function(){
                return this.appStatics.getCurrencies();
            };
            this.getUsersTxt = function(tracker){
                var users = '';
                //TODO - splice owner name from this
                if(tracker.users && tracker.users.length > 1){
                    for(var i = 0; i < tracker.users.length; i++){
                        if(i !== 0){
                            users = users + ((i===tracker.users.length-2) ? ' , ' : ' and ') + tracker.users[i].displayName;
                        } else {
                            users = tracker.users[i].displayName;
                        }
                    }
                } else if(tracker.users){
                    users = tracker.users[0].displayName;
                } else {
                    // TODO - remove it later
                    users = 'Something wrong';
                }
                return users;
            };

            $scope.findOne = function() {
                $scope.tracker = Trackers.get({
                    trackerId: $stateParams.trackerId
                });
            };

            this.loadVaults = function(trackerId){
                $state.go('listTrackerVaults', {trackerId: trackerId});
            };
            this.loadIncexps = function(trackerId){
                $state.go('listTrackerIncexps', {trackerId: trackerId});
            };

            this.createNew = function(size) {
                this.tracker = {};
                $state.go('createTracker');
            };
            this.editTracker = function(tracker){
                $state.go('editTracker', {trackerId: tracker._id});
            };
            this.saveTracker = function(size) {
                var tracker = new Trackers({
                    displayName: this.displayName,
                    description: this.description,
                    currency: this.currency,
                    owner: this.owner,
                    // users: this.users,
                    created: this.created
                });
                tracker.users = [];
                angular.forEach(this.assignedUsers, function(value, key) {
                    tracker.users.push(value._id);
                });
                tracker.$save(function(response) {
                    $state.go('listTrackers');
                    AppMessenger.sendInfoMsg('Successfully Created New Tracker');
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            this.updateTracker = function(updatedTracker){
                var tracker = updatedTracker;
                var users = [];
                var owner = tracker.owner._id;
                angular.forEach(tracker.users, function(value, key) {
                    users.push(value._id);
                });
                tracker.owner = owner;
                tracker.users = users;
                tracker.$update(function() {
                    $state.go('listTrackers');
                    AppMessenger.sendInfoMsg('Successfully Updated theTracker');
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            ////pasted in from angular-ui bootstrap modal example
            ////open a modal window to update a single customer record
            //this.modalUpdate = function(size, selectedTracker) {
            //
            //    var modalInstance = $modal.open({
            //        templateUrl: 'modules/trackers/views/edit-tracker.client.view.html',
            //        controller: function($scope, $modalInstance, tracker) {
            //            $scope.tracker = tracker;
            //            $scope.ok = function() {
            //                // if (updateCustomerForm.$valid){
            //                $modalInstance.close($scope.tracker);
            //                // }
            //            };
            //            $scope.cancel = function() {
            //                $modalInstance.dismiss('cancel');
            //            };
            //        },
            //        size: size,
            //        resolve: {
            //            tracker: function() {
            //                return selectedTracker;
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


            // Remove existing Customer
            this.remove = function(tracker) {
                if (tracker) {
                    tracker.$remove();

                    for (var i in this.trackers) {
                        if (this.trackers[i] === tracker) {
                            this.trackers.splice(i, 1);
                        }
                    }
                } else {
                    this.tracker.$remove(function() {});
                }
            };

        }
    ])


    .controller('TrackersCreateController', ['$scope', 'Trackers', 'Notify', 'AppStatics', 'Authentication', 'AppMessenger', 'UserStatics',
        function($scope, Trackers, Notify, AppStatics, Authentication, AppMessenger, UserStatics) {
            this.appStatics = AppStatics;
            this.userStatics = UserStatics;
            this.authentication = Authentication;
            this.assignedUsers = [];
            this.assignedUsers.push(Authentication.user);
            this.getCurrencies = function(){
                return this.appStatics.getCurrencies();
            };
            this.create = function() {
                var tracker = new Trackers({
                    displayName: this.displayName,
                    description: this.description,
                    currency: this.currency,
                    owner: this.owner,
                    // users: this.users,
                    created: this.created
                });
                tracker.users = [];
                angular.forEach(this.assignedUsers, function(value, key) {
                    tracker.users.push(value._id);
                });
                // Redirect after save
                tracker.$save(function(response) {
                    Notify.sendMsg('RefreshTrackers', {
                        'id': response._id
                    });
                    AppMessenger.sendInfoMsg(response);
                    // Notify.sendMsg('TrackerSaved', {
                    // });
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
        }
    ])
    .controller('TrackersUpdateController', ['$scope', 'Trackers', 'AppStatics', 'Authentication', 'Notify', 'UserStatics',
        function($scope, Trackers, AppStatics, Authentication, Notify, UserStatics) {
            this.appStatics = AppStatics;
            this.userStatics = UserStatics;
            this.authentication = Authentication;
            this.getCurrencies = function(){
                return this.appStatics.getCurrencies();
            };
            this.update = function(updatedTracker) {
                var tracker = updatedTracker;
                var users = [];
                var owner = tracker.owner._id;
                angular.forEach(tracker.users, function(value, key) {
                    users.push(value._id);
                });
                tracker.owner = owner;
                tracker.users = users;
                tracker.$update(function() {
                    Notify.sendMsg('RefreshTrackers', {});
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

        }
    ])

;


//angular.module('trackers')
//	.controller('TrackersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trackers', '$modal', '$log', 'moment', 'AppStatics', '$state',  'UserStatics', //'angularMoment',
//		function($scope, $stateParams, $location, Authentication, Trackers, $modal, $log, moment, AppStatics, $state, UserStatics) {
//			this.authentication = Authentication;
//			this.trackers = Trackers.query();
//			// this.appStatics = AppStatics;
//			// this.getCurrencies = function(){
//			// 	return this.appStatics.getCurrencies()
//			// };
//			//open a modal window to create a single customer record
//	        this.modalCreate = function(size) {
//	            var modalInstance = $modal.open({
//	                templateUrl: 'modules/trackers/views/create-tracker.client.view.html',
//	                controller: function($scope, $modalInstance) {
//	                    $scope.ok = function() {
//	                        // if (createCustomerForm.$valid){
//	                        $modalInstance.close();
//	                        // }
//	                    };
//	                    $scope.cancel = function() {
//	                        $modalInstance.dismiss('cancel');
//	                    };
//	                },
//	                size: size
//	            });
//	            modalInstance.result.then(function(selectedItem) {
//
//	            	}, function() {
//		                $log.info('Modal dismissed at: ' + new Date());
//	            });
//	        };
//	        this.getLocalTime = function(time){
//	        	return moment(time).toString();
//	        };
//					this.getOwnerTxt = function(tracker){
//						return (tracker.owner && tracker.owner._id && (tracker.owner._id.toString() === Authentication.user._id.toString()))	? 'Me - This is my Awesome tracker' :
//													((tracker.owner && tracker.owner.displayName) ? tracker.owner.displayName : 'No Name');
//					};
//					this.getUsersTxt = function(tracker){
//						var users = '';
//						//TODO - splice owner name from this
//						if(tracker.users && tracker.users.length > 1){
//							for(var i = 0; i < tracker.users.length; i++){
//								if(i !== 0){
//									users = users + ((i===tracker.users.length-2) ? ' , ' : ' and ') + tracker.users[i].displayName;
//								} else {
//									users = tracker.users[i].displayName;
//								}
//							}
//						} else if(tracker.users){
//							users = tracker.users[0].displayName;
//						} else {
//							// TODO - remove it later
//							users = 'Something wrong';
//						}
//						return users;
//					};
//					this.loadVaults = function(trackerId){
//						$state.go('listTrackerVaults', {trackerId: trackerId});
//					};
//					this.loadIncexps = function(trackerId){
//						$state.go('listTrackerIncexps', {trackerId: trackerId});
//					};
//
//	        //pasted in from angular-ui bootstrap modal example
//	        //open a modal window to update a single customer record
//	        this.modalUpdate = function(size, selectedTracker) {
//
//	            var modalInstance = $modal.open({
//	                templateUrl: 'modules/trackers/views/edit-tracker.client.view.html',
//	                controller: function($scope, $modalInstance, tracker) {
//	                    $scope.tracker = tracker;
//	                    $scope.ok = function() {
//	                        // if (updateCustomerForm.$valid){
//	                        $modalInstance.close($scope.tracker);
//	                        // }
//	                    };
//	                    $scope.cancel = function() {
//	                        $modalInstance.dismiss('cancel');
//	                    };
//	                },
//	                size: size,
//	                resolve: {
//	                    tracker: function() {
//	                        return selectedTracker;
//	                    }
//	                }
//	            });
//
//	            modalInstance.result.then(function(selectedItem) {
//	                $scope.selected = selectedItem;
//	            }, function() {
//	                $log.info('Modal dismissed at: ' + new Date());
//	            });
//	        };
//
//
//	        // Remove existing Customer
//	        this.remove = function(tracker) {
//	            if (tracker) {
//	            	tracker.$remove();
//
//	                for (var i in this.trackers) {
//	                    if (this.trackers[i] === tracker) {
//	                        this.trackers.splice(i, 1);
//	                    }
//	                }
//	            } else {
//	                this.tracker.$remove(function() {});
//	            }
//	        };
//
//		}
//	])
//
//
//	.controller('TrackersCreateController', ['$scope', 'Trackers', 'Notify', 'AppStatics', 'Authentication', 'AppMessenger', 'UserStatics',
//	    function($scope, Trackers, Notify, AppStatics, Authentication, AppMessenger, UserStatics) {
//	    	this.appStatics = AppStatics;
//	    	this.userStatics = UserStatics;
//	    	this.authentication = Authentication;
//	    	this.assignedUsers = [];
//	    	this.assignedUsers.push(Authentication.user);
//	    	this.getCurrencies = function(){
//					return this.appStatics.getCurrencies();
//				};
//        this.create = function() {
//            var tracker = new Trackers({
//                displayName: this.displayName,
//                description: this.description,
//                currency: this.currency,
//                owner: this.owner,
//                // users: this.users,
//                created: this.created
//            });
//            tracker.users = [];
//            angular.forEach(this.assignedUsers, function(value, key) {
//						  tracker.users.push(value._id);
//						});
//            // Redirect after save
//            tracker.$save(function(response) {
//                Notify.sendMsg('RefreshTrackers', {
//                    'id': response._id
//                });
//                AppMessenger.sendInfoMsg(response);
//                // Notify.sendMsg('TrackerSaved', {
//                // });
//            }, function(errorResponse) {
//                $scope.error = errorResponse.data.message;
//            });
//        };
//	    }
//	])
//	.controller('TrackersUpdateController', ['$scope', 'Trackers', 'AppStatics', 'Authentication', 'Notify', 'UserStatics',
//	    function($scope, Trackers, AppStatics, Authentication, Notify, UserStatics) {
//	    	this.appStatics = AppStatics;
//	    	this.userStatics = UserStatics;
//	    	this.authentication = Authentication;
//	    	this.getCurrencies = function(){
//					return this.appStatics.getCurrencies();
//				};
//        this.update = function(updatedTracker) {
//            var tracker = updatedTracker;
//            var users = [];
//            var owner = tracker.owner._id;
//            angular.forEach(tracker.users, function(value, key) {
//						  users.push(value._id);
//						});
//						tracker.owner = owner;
//						tracker.users = users;
//            tracker.$update(function() {
//              Notify.sendMsg('RefreshTrackers', {});
//            }, function(errorResponse) {
//                $scope.error = errorResponse.data.message;
//            });
//        };
//
//	    }
//	])
//
//;
