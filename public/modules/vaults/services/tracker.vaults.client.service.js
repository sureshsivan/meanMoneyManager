'use strict';

//Vaults service used to communicate Vaults REST endpoints
angular.module('vaults').factory('TrackerVaults', ['$resource',
	function($resource) {
		return $resource('trackervaults/:trackerId', { trackerId: '@trackerId'
		}, {
			update: {
				method: 'PUT'
			},
      listTrackerVaults: {
        method: 'GET',
        isArray: true
      }
		});
	}
]);
