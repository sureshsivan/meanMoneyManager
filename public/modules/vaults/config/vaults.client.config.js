'use strict';

// Configuring the Articles module
angular.module('vaults').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Vaults', 'vaults', 'dropdown', '/vaults(/create)?');
		// Menus.addSubMenuItem('topbar', 'vaults', 'List Vaults', 'vaults');
		// Menus.addSubMenuItem('topbar', 'vaults', 'New Vault', 'vaults/create');
	}
]);
