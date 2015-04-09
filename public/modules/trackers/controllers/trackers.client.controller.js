'use strict';

// Trackers controller


angular.module('trackers')
    .controller('TrackersController', ['$scope', '$state', '$stateParams', 'Authentication', 'Trackers', 'TrackerLocaleMessages', 'AppStatics', 'UserStatics', 'AppMessenger', 'moment',
        function($scope, $state, $stateParams, Authentication, Trackers, TrackerLocaleMessages, AppStatics, UserStatics, AppMessenger, moment) {
            var _this = this;
            this.appStatics = AppStatics;
            this.userStatics = UserStatics;
            this.authentication = Authentication;
            this.assignedUsers = [];
            this.assignedUsers.push(Authentication.user);

            var loadmsgs = function(){
                console.log('loadmsgs');
                return TrackerLocaleMessages.pullMessages().then(function(labels){
                    _this.labelsObj = labels;
                })
            };

            var bootmodule = function () {
                console.log('bootmodule');
                _this.getLocalTime = function (time) {
                    return moment(time).toString();
                };
                _this.getOwnerTxt = function (tracker) {
                    return (tracker.owner && tracker.owner._id && (tracker.owner._id.toString() === Authentication.user._id.toString())) ? 'Me - This is my Awesome tracker' :
                        ((tracker.owner && tracker.owner.displayName) ? tracker.owner.displayName : 'No Name');
                };
                _this.getCurrencies = function () {
                    return _this.appStatics.getCurrencies();
                };
                _this.getUsersTxt = function (tracker) {
                    var users = '';
                    //TODO - splice owner name from this
                    if (tracker.users && tracker.users.length > 1) {
                        for (var i = 0; i < tracker.users.length; i++) {
                            if (i !== 0) {
                                users = users + ((i === tracker.users.length - 2) ? ' , ' : ' and ') + tracker.users[i].displayName;
                            } else {
                                users = tracker.users[i].displayName;
                            }
                        }
                    } else if (tracker.users) {
                        users = tracker.users[0].displayName;
                    } else {
                        // TODO - remove it later
                        users = 'Something wrong';
                    }
                    return users;
                };
                _this.findAll = function () {
                    console.log('find all');
                    _this.trackers = Trackers.query();
                };
                _this.findOne = function () {
                    $scope.tracker = Trackers.get({
                        trackerId: $stateParams.trackerId
                    });
                };
                _this.loadVaults = function (trackerId) {
                    $state.go('listTrackerVaults', {trackerId: trackerId});
                };
                _this.loadIncexps = function (trackerId) {
                    $state.go('listTrackerIncexps', {trackerId: trackerId});
                };

                _this.createTracker = function (size) {
                    _this.tracker = {};
                    $state.go('createTracker');
                };
                _this.editTracker = function (tracker) {
                    $state.go('editTracker', {trackerId: tracker._id});
                };
                _this.saveTracker = function (size) {
                    var tracker = new Trackers({
                        displayName: _this.displayName,
                        description: _this.description,
                        currency: _this.currency,
                        owner: _this.owner,
                        // users: _this.users,
                        created: _this.created
                    });
                    tracker.users = [];
                    angular.forEach(_this.assignedUsers, function (value, key) {
                        tracker.users.push(value._id);
                    });
                    tracker.$save(function (response) {
                        $state.go('listTrackers');
                        AppMessenger.sendInfoMsg('Successfully Created New Tracker');
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };
                _this.updateTracker = function (updatedTracker) {
                    var tracker = updatedTracker;
                    var users = [];
                    var owner = tracker.owner._id;
                    angular.forEach(tracker.users, function (value, key) {
                        users.push(value._id);
                    });
                    tracker.owner = owner;
                    tracker.users = users;
                    tracker.$update(function () {
                        $state.go('listTrackers');
                        AppMessenger.sendInfoMsg('Successfully Updated theTracker');
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };


                _this.remove = function (tracker) {
                    if (tracker) {
                        tracker.$remove();

                        for (var i in _this.trackers) {
                            if (_this.trackers[i] === tracker) {
                                _this.trackers.splice(i, 1);
                            }
                        }
                    } else {
                        _this.tracker.$remove(function () {
                        });
                    }
                };

            };

            //loadmsgs().then(bootmodule);
            loadmsgs();
            bootmodule();
        }
    ])
;
