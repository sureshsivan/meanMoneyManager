'use strict';

//Setting up route
angular.module('incexps').config(['$stateProvider', 'INCEXP_CONST',
	function($stateProvider, INCEXP_CONST) {
		// Incexps state routing
		$stateProvider.
		state(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, {
			url: INCEXP_CONST.LIST_INCEXPS_STATE_URL,
			templateUrl: INCEXP_CONST.LIST_INCEXPS_STATE_TEMPLATE_URL
		}).
		state(INCEXP_CONST.CREATE_INCEXP_STATE_NAME, {
			url: INCEXP_CONST.CREATE_INCEXP_STATE_URL,
			templateUrl: INCEXP_CONST.CREATE_INCEXP_STATE_TEMPLATE_URL
		}).
		state(INCEXP_CONST.EDIT_INCEXP_STATE_NAME, {
			url: INCEXP_CONST.EDIT_INCEXP_STATE_URL,
			templateUrl: INCEXP_CONST.EDIT_INCEXP_STATE_TEMPLATE_URL
		});
	}
]);
