'use strict';

//Vaults service used to communicate Vaults REST endpoints
angular.module('vaults').factory('Vaults', ['$resource',
	function($resource) {
		return $resource('vaults/:vaultId', { vaultId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);