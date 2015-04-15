'use strict';

angular.module('core').service('UserStatics', [ '$http',
	function($http) {
		var userStatics = {};
		userStatics.getAddUsersTmpl = function(){
			return 'modules/users/views/add-users-template.html';
		};
		userStatics.getListUsersComboTmpl = function(){
			return 'modules/users/views/list-users-combo-template.html';
		};
		userStatics.queryUsers = function(query, users){
			return $http.get('/users/search', {
			      params: {
			        q: query,
			        nu: users
			      }
			    }).then(function(response){
			      return response.data.map(function(item){
			        return item;
			      });
			    });
		};
		return userStatics;
	}
]);
