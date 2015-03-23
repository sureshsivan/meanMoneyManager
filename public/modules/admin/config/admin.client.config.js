'use strict';

// Admin module config
angular.module('admin').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('topbar', 'Administer', 'admin', 'dropdown', '/admin(/admin)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'admin', 'List Trackers', 'trackersall', null, false, ['admin']);
		Menus.addSubMenuItem('topbar', 'admin', 'List Users', 'usersall', null, false, ['admin']);
	}
]);