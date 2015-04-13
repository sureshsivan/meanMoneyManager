'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var vaults = require('../../app/controllers/vaults.server.controller');
    var trackers = require('../../app/controllers/trackers.server.controller');


  app.route('/trackervaults/:trackerId')
  	.get(users.requiresLogin, vaults.listVaultDetailsForTracker)
  	.post(users.requiresLogin, vaults.create);

  app.route('/trackervaults/:trackerId/:vaultId')
	.get(users.requiresLogin, vaults.read)
	.put(users.requiresLogin, vaults.hasAuthorization, vaults.update)
	.delete(users.requiresLogin, vaults.hasAuthorization, vaults.create);
	//	TODO - to check whether the tracker does not has any childs(vaults or income/expenses)
  
  
    // TODO add trackers.isRealTracker
	app.route('/queryvaults/queryByTracker').get(users.requiresLogin, vaults.listByTrackerIdExcludeVaults);

	// Finish by binding the Vault middleware
	app.param('vaultId', vaults.vaultByID);
    app.param('trackerId', trackers.trackerByID);
};





