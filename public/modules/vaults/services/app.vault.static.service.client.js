'use strict';

angular.module('vaults').service('VaultStatics', [ '$http', '$q',
	function($http, $q) {
		var vaultStatics = {};
         //TODO - refactor it with promises
        vaultStatics.queryVaults = function(trackerId, excludeVaults){
            //http://stackoverflow.com/questions/19405548/default-angularjs-ng-option-when-data-is-returned-from-a-service
            return $http.get('/queryvaults/queryByTracker', {
                params: {
                    tId: trackerId,
                    exv: excludeVaults
                }
            });
        };
		return vaultStatics;
	}
]);
