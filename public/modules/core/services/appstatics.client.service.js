'use strict';

angular.module('core').service('AppStatics', [ '$http',
	function($http) {
		return {
			getCurrencies : function(){
				if(! this.currencies){
					this.currencies = [{id: 'INR', label: 'Indian Rupee'},
					    		            {id: 'USD', label: 'US Dollor'},
					    		            {id: 'JPY', label: 'Japanese YEN'},
					    		            {id: 'EUR', label: 'Euro'}];
				};
				return this.currencies;
			},
			queryUsers: function(query){
				return $http.get('/users/search', {
				      params: {
				        q: query
				      }
				    }).then(function(response){
				    	console.log(response);
				      return response.data.map(function(item){
				        return item;
				      });
				    });
			}
		};
	}
]);
