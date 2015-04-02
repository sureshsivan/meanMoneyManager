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
			return appLocaleMessages[key];
		}
		return appStatics;
	}
]);
