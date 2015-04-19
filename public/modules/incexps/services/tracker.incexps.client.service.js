'use strict';

//Vaults service used to communicate Vaults REST endpoints
angular.module('incexps').factory('TrackerIncexps', ['$resource',
	function($resource) {
		return $resource('trackerincexps/:trackerId/:incexpId', null, {
			update: {
				method: 'PUT'
			},
            listTrackerIncexps: {
                method: 'GET',
                params: {trackerId : 'trackerId'},
                isArray: true
            },
            requestEditAccess: {
                url: 'incexps/requestEditAccess/:incexpId',
                method: 'PUT'
            },
            approveEditAccessRequest: {
                url: 'incexps/approveEditAccessRequest/:incexpId',
                method: 'PUT'
            },
            rejectEditAccessRequest: {
                url: 'incexps/rejectEditAccessRequest/:incexpId',
                method: 'PUT'
            },
            approveIncexpChanges: {
                url: 'incexps/approveChanges/:incexpId',
                method: 'PUT'
            }
		});
	}
]);
