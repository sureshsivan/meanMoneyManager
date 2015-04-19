'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var incexps = require('../../app/controllers/incexps.server.controller');
    var trackers = require('../../app/controllers/trackers.server.controller');


    app.route('/trackerincexps/:trackerId')
        .get(users.requiresLogin, incexps.listByTrackerId)
        .post(users.requiresLogin, incexps.create);

    app.route('/trackerincexps/:trackerId/:incexpId')
        .get(users.requiresLogin, incexps.read)
        .put(users.requiresLogin, incexps.hasAuthorization, incexps.update)
        .delete(users.requiresLogin, incexps.hasAuthorization, incexps.delete);

    app.route('/incexps/requestEditAccess/:incexpId')
        .put(users.requiresLogin, incexps.hasAuthToEditRequest, incexps.requestEditIncexpAccess);

    app.route('/incexps/approveEditAccessRequest/:incexpId')
        .put(users.requiresLogin, incexps.hasAuthToApproveEditRequest, incexps.approveEditIncexpAccess);

    app.route('/incexps/rejectEditAccessRequest/:incexpId')
        .put(users.requiresLogin, incexps.hasAuthToApproveEditRequest, incexps.rejectEditIncexpAccess);

    app.route('/incexps/approveChanges/:incexpId')
        .put(users.requiresLogin, incexps.hasAuthToApproveChanges, incexps.approveIncexpChanges);

	// Finish by binding the Incexp middleware
	app.param('incexpId', incexps.incexpByID);
    app.param('trackerId', trackers.trackerByID);


};
