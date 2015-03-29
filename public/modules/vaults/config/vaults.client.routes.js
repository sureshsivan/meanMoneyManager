'use strict';

//Setting up route
angular.module('vaults').config(['$stateProvider',
	function($stateProvider) {
		// '$stateProvider', '$urlRouterProvider'
		// Vaults state routing
		$stateProvider.
		state('listTrackerVaults', {
			url: '/trackervaults/:trackerId',
			templateUrl: 'modules/vaults/views/list-vaults.client.view.html'
		// }).
		// state('listVaults', {
		// 	url: '/vaults',
		// 	templateUrl: 'modules/vaults/views/list-vaults.client.view.html'
		// }).
		// state('createVault', {
		// 	url: '/vaults/create',
		// 	templateUrl: 'modules/vaults/views/create-vault.client.view.html'
		// }).
		// state('viewVault', {
		// 	url: '/vaults/:vaultId',
		// 	templateUrl: 'modules/vaults/views/view-vault.client.view.html'
		// }).
		// state('editVault', {
		// 	url: '/vaults/:vaultId/edit',
		// 	templateUrl: 'modules/vaults/views/edit-vault.client.view.html'
		});
	}
]);
