'use strict';

angular.module('core').service('AppStatics', [ '$http',
	function($http) {
		var appStatics = {};
		appStatics.getCurrencies = function(){
				if(! this.currencies){
					this.currencies = [{id: 'INR', label: 'Indian Rupee'},
					    		            {id: 'USD', label: 'US Dollor'},
					    		            {id: 'JPY', label: 'Japanese YEN'},
					    		            {id: 'EUR', label: 'Euro'}];
				}
				return this.currencies;
			};
		return appStatics;
	}
]);
