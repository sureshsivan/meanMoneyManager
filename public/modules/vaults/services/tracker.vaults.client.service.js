'use strict';

//Vaults service used to communicate Vaults REST endpoints
angular.module('vaults').factory('TrackerVaults', ['$resource',
	function($resource) {
		return $resource('trackervaults', null, {
			update: {
				method: 'PUT',
                params: {vaultId : 'vaultId'}
			},
              listTrackerVaults: {
                method: 'GET',
                  params: {trackerId : 'trackerId'},
                isArray: true
          }
		});
	}
]);
