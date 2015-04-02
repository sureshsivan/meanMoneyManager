'use strict';

angular.module('core').service('AppLocaleMessages', [ '$http',
	function($http) {
		var appLocaleMessages = {};
		
		appLocaleMessages.localeMessages = {
				'app.err.msg.XX' : 'App Error Message',
				'app.warn.msg.XX' : 'App Warn Message',
				'app.info.msg.XX' : 'App Info Message'
		};
		appLocaleMessages.getMsg = function(key){
			//	TODO - check for better logic
			if(Object.getOwnPropertyNames(appLocaleMessages.localeMessages).length === 0){
				return $http.get('/users/search', {
				      params: {
				    	  locale: 'en'
				      }
				    }).then(function(response){
				    	// build props
				    	return appLocaleMessages[key];
				    //}, function(response) {
	                 //   // something went wrong
				    //	console.log(response);
	                 //   return $q.reject(response.data);
	            	});
			} else {
				return appLocaleMessages[key];	
			}
			
		};
		return appLocaleMessages;
	}
]);
