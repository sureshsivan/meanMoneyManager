'use strict';

// Configuring the Articles module
angular.module('trackers')
    .run(['Menus',
        function(Menus) {
            // Set top bar menu items
            Menus.addMenuItem('topbar', 'Trackers', 'trackers');
    //		Menus.addSubMenuItem('topbar', 'trackers', 'List Trackers', 'trackers');
    //		Menus.addSubMenuItem('topbar', 'trackers', 'New Tracker', 'trackers/create');
        }
    ])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.latencyThreshold = 10;
    }])
;
