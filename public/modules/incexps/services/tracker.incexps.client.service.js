'use strict';

//Vaults service used to communicate Vaults REST endpoints
angular.module('incexps').factory('TrackerIncexps', ['$resource',
	function($resource) {
		return $resource('trackerincexps', null, {
			update: {
				method: 'PUT',
                params: {incexpId : 'incexpId'}
			},
              listTrackerIncexps: {
                method: 'GET',
                  params: {trackerId : 'trackerId'},
                isArray: true
          }
		});
	}
]);
