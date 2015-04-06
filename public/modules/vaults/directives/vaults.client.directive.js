'use strict';

// Vaults controller
angular.module('vaults')
	.directive('vaultsList', ['Vaults', 'TrackerVaults', 'Notify', function(Vaults, TrackerVaults, Notify) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'modules/vaults/views/vaults-list-template.html',
	        link: function(scope, element, attrs) {
	            //when a new customer is added, update the customer list
	            Notify.getMsg('RefreshVaults', function(event, data) {
                    scope.vaultCtrl.trackerVaults = TrackerVaults.listTrackerVaults(data);
	            });
	        }
	    };
	}])

;
