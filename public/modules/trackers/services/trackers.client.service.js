'use strict';

//Trackers service used to communicate Trackers REST endpoints
angular.module('trackers')

	.factory('Trackers', ['$resource',
		function($resource) {
			return $resource('trackers/:trackerId', { trackerId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}
	])
	
	.factory('Notify', ['$rootScope', function($rootScope) {
        var notify = {};

        notify.sendMsg = function(msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);
            console.log('message sent!');
        };

        notify.getMsg = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);

            if (scope) {
                scope.$on('destroy', unbind);
            }
        };
 
        return notify;
    }]);