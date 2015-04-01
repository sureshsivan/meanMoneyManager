'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var incexps = require('../../app/controllers/incexps.server.controller');
    var trackers = require('../../app/controllers/trackers.server.controller');
    
	// Incexps Routes
	app.route('/incexps')
		.get(incexps.list)
		.post(users.requiresLogin, incexps.create);

	app.route('/incexps/:incexpId')
		.get(incexps.read)
		.put(users.requiresLogin, incexps.hasAuthorization, incexps.update)
		.delete(users.requiresLogin, incexps.hasAuthorization, incexps.delete);

	// Tracker Vaults Routes
	app.route('/trackerincexps')
		.get(users.requiresLogin, incexps.listByTrackerId)
		.post(users.requiresLogin, incexps.create)
        .put(users.requiresLogin, incexps.hasAuthorization, incexps.update)
        .delete(users.requiresLogin, incexps.hasAuthorization, incexps.delete);
	
	// Finish by binding the Incexp middleware
//	app.param('incexpId', incexps.incexpByID);
};
