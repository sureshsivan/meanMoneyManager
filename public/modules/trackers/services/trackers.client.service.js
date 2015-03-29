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
 		}]);
