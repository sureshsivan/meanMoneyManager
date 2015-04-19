'use strict';

//Incexps service used to communicate Incexps REST endpoints
angular.module('incexps').factory('Incexps', ['$resource',
	function($resource) {
		return $resource('incexps/:incexpId', { incexpId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);