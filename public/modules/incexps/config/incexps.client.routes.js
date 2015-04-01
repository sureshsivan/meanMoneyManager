'use strict';

//Setting up route
angular.module('incexps').config(['$stateProvider',
	function($stateProvider) {
		// Incexps state routing
		$stateProvider.
		state('listIncexps', {
			url: '/incexps',
			templateUrl: 'modules/incexps/views/list-incexps.client.view.html'
		}).
		state('createIncexp', {
			url: '/incexps/create',
			templateUrl: 'modules/incexps/views/create-incexp.client.view.html'
		}).
		state('viewIncexp', {
			url: '/incexps/:incexpId',
			templateUrl: 'modules/incexps/views/view-incexp.client.view.html'
		}).
		state('editIncexp', {
			url: '/incexps/:incexpId/edit',
			templateUrl: 'modules/incexps/views/edit-incexp.client.view.html'
		});
	}
]);