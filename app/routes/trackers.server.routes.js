'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var trackers = require('../../app/controllers/trackers.server.controller');
    var vaults = require('../../app/controllers/vaults.server.controller');
	var incexps = require('../../app/controllers/incexps.server.controller');

	// Trackers Routes
	app.route('/trackers')
		.get(users.requiresLogin, trackers.findTrackerDetails);

	app.route('/trackers/:trackerId')
		.get(users.requiresLogin, trackers.read)
		.put(users.requiresLogin, trackers.hasAuthorization, trackers.updateById)
		.delete(users.requiresLogin, trackers.hasAuthorization, vaults.deleteByTrackerId, trackers.delete);
	//	TODO - to check whether the tracker does not has any childs(vaults or income/expenses)
	
	
	// Finish by binding the Tracker middleware
	app.param('trackerId', trackers.trackerByID);
};
