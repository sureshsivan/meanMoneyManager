'use strict';

// Configuring the Articles module
angular.module('incexps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
//		Menus.addMenuItem('topbar', 'Incexps', 'incexps', 'dropdown', '/incexps(/create)?');
//		Menus.addSubMenuItem('topbar', 'incexps', 'List Incexps', 'incexps');
//		Menus.addSubMenuItem('topbar', 'incexps', 'New Incexp', 'incexps/create');


        // do not let angular convert date to UTC
        //$httpProvider.defaults.headers.common
        //http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w'
        //$httpProvider.defaults.transformRequest
	}
]);
