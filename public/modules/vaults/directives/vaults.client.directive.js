'use strict';

// Vaults controller
angular.module('vaults')
	.directive('vaultsList', ['VAULT_CONST', function(VAULT_CONST) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: VAULT_CONST.VAULT_LIST_TEMPLATE_URL,
	        link: function(scope, element, attrs) {
	        }
	    };
	}])

;
