'use strict';

//Setting up route
angular.module('trackers').config(['$stateProvider', 'TRACKER_CONST',
	function($stateProvider, TRACKER_CONST) {
		// Trackers state routing
		$stateProvider.
		state(TRACKER_CONST.LIST_TRACKERS_STATE_NAME, {
			url: TRACKER_CONST.LIST_TRACKERS_STATE_URL,
			templateUrl: TRACKER_CONST.LIST_TRACKERS_STATE_TEMPLATE_URL
		}).
		state(TRACKER_CONST.CREATE_TRACKER_STATE_NAME, {
			url: TRACKER_CONST.CREATE_TRACKER_STATE_URL,
			templateUrl: TRACKER_CONST.CREATE_TRACKER_STATE_TEMPLATE_URL
		}).
		state(TRACKER_CONST.EDIT_TRACKER_STATE_NAME, {
			url: TRACKER_CONST.EDIT_TRACKER_STATE_URL,
			templateUrl: TRACKER_CONST.EDIT_TRACKER_STATE_TEMPLATE_URL
		});
	}
]);
