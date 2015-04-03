'use strict';

angular.module('vaults').service('VaultStatics', [ '$http',
	function($http) {
		var vaultStatics = {};
		vaultStatics.queryVaults = function(trackerId, excludeVaults){
			return $http.get('/queryvaults/queryByTracker', {
			      params: {
			    	tId: trackerId,
			        exv: excludeVaults
			      }
			    }).then(function(response){
			      return response.data.map(function(item){
			        return item;
			      });
			    });
		};
		return vaultStatics;
	}
]);
