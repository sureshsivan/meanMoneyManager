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
            //this.trackers = Trackers.query();
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
            this.findAll = function() {
                this.trackers = Trackers.query();
            };
            this.findOne = function() {
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

            this.createTracker = function(size) {
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
;
