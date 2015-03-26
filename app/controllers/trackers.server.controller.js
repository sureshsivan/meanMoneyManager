'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tracker = mongoose.model('Tracker'),
	_ = require('lodash');

/**
 * Create a Tracker
 */
exports.create = function(req, res) {
	var tracker = new Tracker(req.body);
	tracker.owner = req.user;
	tracker.users.push(req.user);
	tracker.save(function(err) {
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

/**
 * List of Trackers by UserId
 * TODO :: Find a better way - should learng mongo DB better - Thius is stupid way - blame me
 */
exports.listByUserId = function(req, res) {
	var userId = req.user._id;
	Tracker.find().sort('-created')
//		 .populate('users', '_id')
		.populate({
			'path' : 'users'
//			'select' : '_id'
		})
		.populate({
			'path' : 'owner'
//			'select' : 'firstName lastName displayName _id'
		})
		.exec(function(err, trackers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
//			res.jsonp(trackers);
			 var filteredTrackers = [];
			 _.each(trackers, function(tracker){
			 	var isMatch = false;
			 	if(tracker && tracker.users){
			 		_.each(tracker.users, function(user){
			 			if(user && user._id && (user._id.toString() === userId.toString())){
			 				isMatch = true;
			 				return true;
			 			}
			 		});
			 		if(isMatch){
			 			filteredTrackers.push(tracker);
			 			return true;
			 		}
			 	}
			 });
			 res.jsonp(filteredTrackers);
		}
	});
};

/**
 * Update a Tracker by Id
 */
exports.updateById = function(req, res) {
	var tracker = req.tracker ;
	console.dir(tracker);
	console.dir(req.body);
	tracker = _.extend(tracker , req.body);
	Tracker.update(tracker,function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(tracker);
			res.jsonp(tracker);
		}
	});
};

/**
 * Tracker middleware
 */
exports.trackerByID = function(req, res, next, id) {
	Tracker.findById(id).populate('owner', 'displayName').exec(function(err, tracker) {
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
