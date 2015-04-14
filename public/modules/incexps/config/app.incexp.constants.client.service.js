'use strict';

angular.module('incexps').constant('INCEXP_CONST', {
	'INCEXP_LIST_TEMPLATE_URL': 'modules/incexps/templates/incexps-list-template.client.html',
	
	'LIST_INCEXPS_STATE_NAME': 'listTrackerIncexps',
	'LIST_INCEXPS_STATE_URL': '/trackerincexps/:trackerId',
	'LIST_INCEXPS_STATE_TEMPLATE_URL': 'modules/incexps/views/list-incexps.client.view.html',

	'CREATE_INCEXP_STATE_NAME': 'createIncexp',
	'CREATE_INCEXP_STATE_URL': '/trackerincexps/:trackerId/create',
	'CREATE_INCEXP_STATE_TEMPLATE_URL': 'modules/incexps/views/create-incexp.client.view.html',
	
	'EDIT_INCEXP_STATE_NAME': 'editIncexp',
	'EDIT_INCEXP_STATE_URL': '/trackerincexps/:trackerId/:incexpId/edit',
	'EDIT_INCEXP_STATE_TEMPLATE_URL': 'modules/incexps/views/edit-incexp.client.view.html'
	
});
