'use strict';

angular.module('core').service('AppStatics', [ '$http', '$q', 
	function($http, $q) {
		var appStatics = {};
		appStatics.getCurrencies = function(){
//            this.loadCurrencies();
            return this.currencies;
		};
		appStatics.loadCurrencies = function(){
			var deferred = $q.defer();
            $http.get('modules/core/json/currencies.json').then(function(response){
            	appStatics.currencies = response.data;
            	deferred.resolve(response.data);
            });
            return deferred.promise;
        };
		
//        appStatics.loadCurrencies = function(){
//            if(! this.currencies){
//                this.currencies = [{id: 'INR', label: 'Indian Rupee', faIconCls: 'fa-inr'},
//                    {id: 'USD', label: 'US Dollor', faIconCls: 'fa-usd'},
//                    {id: 'JPY', label: 'Japanese YEN', faIconCls: 'fa-jpy'},
//                    {id: 'EUR', label: 'Euro', faIconCls: 'fa-eur'}];
//            }
//        };
        appStatics.getCurrencyObj = function(currencyId){
        	console.log(currencyId);
            for(var i in this.currencies){
                var currency = this.currencies[i];
                if(currency.id === currencyId)  return currency;
            }
        };

		return appStatics;
	}
]);
