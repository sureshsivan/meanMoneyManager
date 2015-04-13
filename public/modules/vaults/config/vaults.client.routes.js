'use strict';

//Setting up route
angular.module('vaults').config(['$stateProvider', 'VAULT_CONST',
	function($stateProvider, VAULT_CONST) {
		$stateProvider.
		state(VAULT_CONST.LIST_VAULTS_STATE_NAME, {
			url: VAULT_CONST.LIST_VAULTS_STATE_URL,
			templateUrl: VAULT_CONST.LIST_VAULTS_STATE_TEMPLATE_URL
		}).
		state(VAULT_CONST.CREATE_VAULT_STATE_NAME, {
			url: VAULT_CONST.CREATE_VAULT_STATE_URL,
			templateUrl: VAULT_CONST.CREATE_VAULT_STATE_TEMPLATE_URL
		}).
		state(VAULT_CONST.EDIT_VAULT_STATE_NAME, {
			url: VAULT_CONST.EDIT_VAULT_STATE_URL,
			templateUrl: VAULT_CONST.EDIT_VAULT_STATE_TEMPLATE_URL
		});
	}
]);
