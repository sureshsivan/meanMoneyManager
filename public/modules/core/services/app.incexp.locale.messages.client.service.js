'use strict';

angular.module('incexps').service('CoreLocaleMessages', [ '$http',
	function($http) {
		var incexpLocaleMessageService = {};
		
		incexpLocaleMessageService.pullMessages = function(){
			return $http.get('modules/incexps/json/labels.json', {cached: true});
		};
		incexpLocaleMessageService.get = function(key){
			if(! this.msgs){
				this.pullMessages().then(function(response){
					this.msgs = response;
				});
			} else {
				return this.msgs[key];
			}
		};
		return incexpLocaleMessageService;
	}
]);
