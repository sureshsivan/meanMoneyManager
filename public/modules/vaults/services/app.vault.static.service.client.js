'use strict';

angular.module('vaults').service('VaultStatics', [ '$http', '$q',
	function($http, $q) {
		var vaultStatics = {};
        vaultStatics.queriedVaults = [];
        //TODO - remove
		vaultStatics.queryVaultsX = function( trackerId, excludeVaults){
			return $http.get('/queryvaults/queryByTracker', {
			      params: {
			    	tId: trackerId,
			        exv: excludeVaults
			      }
			    }).then(function(response){
                    //if(this.vaults && this.vaults.length && this.vaults.length > 0){
                    //    this.vaults = [];
                    //};
                    vaultStatics.queriedVaults = [];
			      response.data.map(function(item){
			        //return item;
                      vaultStatics.queriedVaults.push(item);
			      });
                  return vaultStatics.queriedVaults;
			    });
		};
        //TODO - remove
        vaultStatics.queryVaults1 = function(vaultsArr, trackerId, excludeVaults){
            return $http.get('/queryvaults/queryByTracker', {
                params: {
                    tId: trackerId,
                    exv: excludeVaults
                }
            }).then(function(response){
                response.data.map(function(item){
                    //return item;
                    vaultsArr.push(item);
                });
                return vaultsArr;
            });
        };
        //TODO - remove
        vaultStatics.queryVaults2 = function(){
            if(! this.vaults){
                this.vaults = [{_id : '111', displayName : 'Oneeee'}, {_id : '222', displayName : 'Twoooo'}];
            }
            return this.vaults;
        };
        //TODO - remove
        vaultStatics.queryVaults3 = function(vaultsArr, trackerId, excludeVaults){
            $http.get('/queryvaults/queryByTracker', {
                params: {
                    tId: trackerId,
                    exv: excludeVaults
                }
            }).then(function(response){
                var _this = this;
                _this.vaultsResult = [];
                response.data.map(function(item){
                    //return item;
                    _this.vaultsResult.push(item);
                });
                return _this.vaultsResult;
            });
        };
        //TODO - refactor it with promises
        vaultStatics.queryVaults = function(trackerId, excludeVaults){
            //http://stackoverflow.com/questions/19405548/default-angularjs-ng-option-when-data-is-returned-from-a-service
            return $http.get('/queryvaults/queryByTracker', {
                params: {
                    tId: trackerId,
                    exv: excludeVaults
                }
            })
        };


		return vaultStatics;
	}
]);
