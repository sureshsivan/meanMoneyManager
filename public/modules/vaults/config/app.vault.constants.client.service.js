'use strict';

angular.module('vaults').constant('VAULT_CONST', {
	'VAULT_LIST_TEMPLATE_URL': 'modules/vaults/templates/vaults-list-template.client.html',
	
	'LIST_VAULTS_STATE_NAME': 'listTrackerVaults',
	'LIST_VAULTS_STATE_URL': '/trackervaults/:trackerId',
	'LIST_VAULTS_STATE_TEMPLATE_URL': 'modules/vaults/views/list-vaults.client.view.html',

	'CREATE_VAULT_STATE_NAME': 'createVault',
	'CREATE_VAULT_STATE_URL': '/trackervaults/:trackerId/create',
	'CREATE_VAULT_STATE_TEMPLATE_URL': 'modules/vaults/views/create-vault.client.view.html',
	
	'EDIT_VAULT_STATE_NAME': 'editVault',
	'EDIT_VAULT_STATE_URL': '/trackervaults/:trackerId/:vaultId/edit',
	'EDIT_VAULT_STATE_TEMPLATE_URL': 'modules/vaults/views/edit-vault.client.view.html'
	
});
