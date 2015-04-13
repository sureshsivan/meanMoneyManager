'use strict';

angular.module('trackers').constant('TRACKER_CONST', {
	'TRACKER_LIST_TEMPLATE_URL': 'modules/trackers/templates/trackers-list-template.client.html',
	
	'LIST_TRACKERS_STATE_NAME': 'listTrackers',
	'LIST_TRACKERS_STATE_URL': '/trackers',
	'LIST_TRACKERS_STATE_TEMPLATE_URL': 'modules/trackers/views/list-trackers.client.view.html',

	'CREATE_TRACKER_STATE_NAME': 'createTracker',
	'CREATE_TRACKER_STATE_URL': '/trackers/create',
	'CREATE_TRACKER_STATE_TEMPLATE_URL': 'modules/trackers/views/create-tracker.client.view.html',
	
	'EDIT_TRACKER_STATE_NAME': 'editTracker',
	'EDIT_TRACKER_STATE_URL': '/trackers/:trackerId/edit',
	'EDIT_TRACKER_STATE_TEMPLATE_URL': 'modules/trackers/views/edit-tracker.client.view.html'
	
});
