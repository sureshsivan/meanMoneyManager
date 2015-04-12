'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tracker = mongoose.model('Tracker'),
	_ = require('lodash'),
	Schema = mongoose.Schema,
	StaticStatus = require('../const/core.server.const'),
	Q = require('q'),
    vaults = require('../../app/controllers/vaults.server.controller'),
	incexps = require('../../app/controllers/incexps.server.controller');

/**
 * Create a Tracker
 */
exports.create = function(req, res) {
	var tracker = new Tracker(req.body);
	tracker.owner = req.user;
	// tracker.users.push(req.user);
	tracker.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(StaticStatus.defaultSuccessRes());
		}
	});
};

/**
 * Show the current Tracker
 */
exports.read = function(req, res) {
	res.jsonp(req.tracker);
};

/**
 * Update a Tracker
 */
exports.update = function(req, res) {
	var tracker = req.tracker ;

	tracker = _.extend(tracker , req.body);

	tracker.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tracker);
		}
	});
};

/**
 * Delete an Tracker
 */
exports.delete = function(req, res) {
	var tracker = req.tracker ;
    console.log('DELETING TRACKERS');
	tracker.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tracker);
		}
	});
};

/**
 * List of Trackers
 */
exports.list = function(req, res) {
	Tracker.find().sort('-created').populate('owner', 'displayName').exec(function(err, trackers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trackers);
		}
	});
};


exports.findTrackerDetails = function(req, res){
	exports.listTrackersByUserId(req)
        .then(vaults.findTrackerVaultCounts, function(err){
            console.log(err);
        })
        .then(incexps.findTrackerIncexpCounts, function(err){
            console.log(err);
        })
        .then(incexps.findTrackerAlertCounts, function(err){
            console.log(err);
        })
        .then(incexps.findTrackerAlertCountsForUser, function(err){
            console.log(err);
        })
		.then(function(req){
			exports.mergeTrackerDetails(req);
			res.jsonp(req.trackers);
		}, function(err){
			console.log(err);
		});
};


/**
 * List of Trackers by UserId
 * TODO :: Find a better way - should learng mongo DB better - Thius is stupid way - blame me
 */
exports.listTrackersByUserId = function(req, res) {
	var deferred = Q.defer();

	var userId = req.user._id;
	Tracker.find({'users' : mongoose.Types.ObjectId(req.user._id)})
		.populate({
			'path' : 'owner',
			'select' : 'firstName lastName displayName email _id'
		})
		.populate({
			'path' : 'users',
			'select' : 'firstName lastName displayName email _id'
		})
		.sort('-created')
		.exec(function(err, trackers) {
			if (err) {
				deferred.reject(err);
			} else {
				//	save data to request obj for future merge
				req.trackers = trackers;
				deferred.resolve(req);
			}
		});

	return deferred.promise;
};

exports.mergeTrackerDetails = function(req){
	var trackers = req.trackers;
	var trackerIncExpAlerts = req.trackerIncExpAlerts;
    var trackerIncExpUserAlerts = req.trackerIncExpUserAlerts;
    var trackerIncexpCounts = req.trackerIncexpCounts;
    var trackerVaultCounts = req.trackerVaultCounts;
	var modTrackers = [];
	_.each(trackers, function(tracker){
		tracker = tracker.toObject();
        tracker.vaultsCount = 0;
        tracker.incexpCount = 0;
        tracker.alertsCount = 0;
        tracker.userAlertsCount = 0;
            //TODO - to check whether return false to break off the loop
		_.each(trackerVaultCounts, function(vault){
			if(tracker._id.toString() === vault._id.toString()){
				tracker.vaultsCount = vault.count;
			}
		});
        _.each(trackerIncexpCounts, function(incexp){
            if(tracker._id.toString() === incexp._id.toString()){
                tracker.incexpCount = incexp.count;
            }
        });
		_.each(trackerIncExpAlerts, function(incexpAlert){
			if(tracker._id.toString() === incexpAlert._id.toString()){
				tracker.alertsCount = incexpAlert.count;
			}
		});
        _.each(trackerIncExpUserAlerts, function(incexpUserAlert){
            if(tracker._id.toString() === incexpUserAlert._id.toString()){
                tracker.userAlertsCount = incexpUserAlert.count;
            }
        });
		modTrackers.push(tracker);
	});
	req.trackers = modTrackers;
};


/**
 * Update a Tracker by Id
 */
exports.updateById = function(req, res) {
	var tracker = req.body;
	// tracker = _.extend(tracker , req.body);
	var query = {_id: tracker._id};
	delete tracker._id;
	delete tracker.owner;
	// delete req.body.users;
	// delete tracker.users;
	// console.log('#########');
	Tracker.update(query, tracker, function(err){
//	Tracker.update(tracker,function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(StaticStatus.defaultSuccessRes());
		}
	});
};

/**
 * Tracker middleware
 */
exports.trackerByID = function(req, res, next, id) {
	Tracker.findById(id)
        .populate({
            'path' : 'owner',
            'select' : 'firstName lastName displayName email _id'
        })
        .populate({
            'path' : 'users',
            'select' : 'firstName lastName displayName email _id'
        })
        .exec(function(err, tracker) {
		if (err) return next(err);
		if (! tracker) return next(new Error('Failed to load Tracker ' + id));
		req.tracker = tracker ;
		next();
	});
};



/**
 * Tracker authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tracker.owner.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
