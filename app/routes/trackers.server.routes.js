'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var trackers = require('../../app/controllers/trackers.server.controller');
    var vaults = require('../../app/controllers/vaults.server.controller');
	var incexps = require('../../app/controllers/incexps.server.controller');

	// Trackers Routes
	app.route('/trackers')
		.get(users.requiresLogin, incexps.findTrackerAlertCounts, trackers.listByUserId)
		.post(users.requiresLogin, trackers.create);

	app.route('/trackers/:trackerId')
		.get(trackers.read)
		.put(users.requiresLogin, trackers.hasAuthorization, trackers.updateById)
		.delete(users.requiresLogin, trackers.hasAuthorization, vaults.deleteByTrackerId, trackers.delete);

	// Finish by binding the Tracker middleware
	app.param('trackerId', trackers.trackerByID);
};
