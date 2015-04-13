'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var vaults = require('../../app/controllers/vaults.server.controller');
    var trackers = require('../../app/controllers/trackers.server.controller');

	// Vaults Routes
//	app.route('/vaults')
//		.get(users.requiresLogin, vaults.list)
//		.post(users.requiresLogin, vaults.create);
//	app.route('/vaults/:vaultId')
//		.get(users.requiresLogin, vaults.read)
//		.put(users.requiresLogin, vaults.hasAuthorization, vaults.update)
//		.delete(users.requiresLogin, vaults.hasAuthorization, vaults.delete);
//
//	// Tracker Vaults Routes
//	app.route('/trackervaults')
//		.get(users.requiresLogin, vaults.listByTrackerId)
//		.post(users.requiresLogin, vaults.create)
//        .put(users.requiresLogin, vaults.hasAuthorization, vaults.update)
//        .delete(users.requiresLogin, vaults.hasAuthorizationWithTracker, vaults.delete);

  app.route('/trackervaults/:trackerId')
  	.get(users.requiresLogin, vaults.listVaultDetailsForTracker)
  	.post(users.requiresLogin, vaults.create);
	

//    // Tracker Vaults Routes
//    app.route('/trackervaults/:trackerId/:vaultId')
//        .get(users.requiresLogin, incexps.read)
//        .post(users.requiresLogin, incexps.create)
//        .put(users.requiresLogin, incexps.hasAuthorization, incexps.update)
//        .delete(users.requiresLogin, incexps.hasAuthorization, incexps.delete);
//
//    // Tracker Vaults Routes
//    app.route('/trackervaults/:trackerId')
//        .get(users.requiresLogin, incexps.listByTrackerId)
//        .post(users.requiresLogin, incexps.create)
//        .put(users.requiresLogin, incexps.hasAuthorization, incexps.update)
//        .delete(users.requiresLogin, incexps.hasAuthorization, incexps.delete);
	
	
    // TODO add trackers.isRealTracker
	app.route('/queryvaults/queryByTracker').get(users.requiresLogin, vaults.listByTrackerIdExcludeVaults);


	// Finish by binding the Vault middleware
	app.param('vaultId', vaults.vaultByID);
    app.param('trackerId', trackers.trackerByID);
};





