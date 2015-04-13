'use strict';

angular.module('vaults').service('VaultLocaleMessages', [ '$http', '$q',
	function($http, $q) {
		return {
			pullMessages: function(){
				var _this = this;
				var deferred = $q.defer();
				if(_this.msgs){
					deferred.resolve(_this.msgs);
				} else {
					$http.get('modules/vaults/json/labels.json').success(function(response){
						_this.msgs = response;
						deferred.resolve(_this.msgs);
					});
				}
				return deferred.promise;
			}
		};
	}
]);
