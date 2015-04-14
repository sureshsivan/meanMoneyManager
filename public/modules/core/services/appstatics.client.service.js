'use strict';

angular.module('core').service('AppStatics', [ '$http',
	function($http) {
		var appStatics = {};
		appStatics.getCurrencies = function(){
            this.loadCurrencies();
            return this.currencies;
		};
        appStatics.loadCurrencies = function(){
            if(! this.currencies){
                this.currencies = [{id: 'INR', label: 'Indian Rupee', faIconCls: 'fa-inr'},
                    {id: 'USD', label: 'US Dollor', faIconCls: 'fa-usd'},
                    {id: 'JPY', label: 'Japanese YEN', faIconCls: 'fa-jpy'},
                    {id: 'EUR', label: 'Euro', faIconCls: 'fa-eur'}];
            }
        };
        appStatics.getCurrencyObj = function(currencyId){
            console.log(currencyId);
            this.loadCurrencies();
            for(var i in this.currencies){
                var currency = this.currencies[i];
                if(currency.id === currencyId)  return currency;
            }
        };

		return appStatics;
	}



]);
