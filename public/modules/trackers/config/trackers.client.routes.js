'use strict';

//Setting up route
angular.module('trackers').config(['$stateProvider',
	function($stateProvider) {
		// Trackers state routing
		$stateProvider.
		state('listTrackers', {
			url: '/trackers',
			templateUrl: 'modules/trackers/views/list-trackers.client.view.html'
//		}).
//		state('createTracker', {
//			url: '/trackers/create',
//			templateUrl: 'modules/trackers/views/create-tracker.client.view.html'
//		}).
//		state('viewTracker', {
//			url: '/trackers/:trackerId',
//			templateUrl: 'modules/trackers/views/view-tracker.client.view.html'
//		}).
//		state('editTracker', {
//			url: '/trackers/:trackerId/edit',
//			templateUrl: 'modules/trackers/views/edit-tracker.client.view.html'
		});
	}
]);