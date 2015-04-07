'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Incexp = mongoose.model('Incexp'),
	_ = require('lodash');

/**
 * Create a Incexp
 */
exports.create = function(req, res) {
	var incexp = new Incexp(req.body);
	incexp.user = req.user;

	incexp.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(incexp);
		}
	});
};

/**
 * Show the current Incexp
 */
exports.read = function(req, res) {
	res.jsonp(req.incexp);
};

/**
 * Update a Incexp
 */
exports.update = function(req, res) {
	var incexp = req.incexp ;

	incexp = _.extend(incexp , req.body);

	incexp.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(incexp);
		}
	});
};

/**
 * Delete an Incexp
 */
exports.delete = function(req, res) {
	var incexp = req.incexp ;

	incexp.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(incexp);
		}
	});
};

/**
 * Delete an Vault
 */
exports.deleteByTrackerId = function(req, res, next) {
    var tracker = req.tracker;
    var trackerId = tracker._id;
    //var vault = req.vault ;

    Incexp.remove({tracker: mongoose.Types.ObjectId(trackerId)}, function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            next();
        }
    });
};

/**
 * List of Incexps
 */
exports.list = function(req, res) { 
	Incexp.find().sort('-created').populate('user', 'displayName').exec(function(err, incexps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(incexps);
		}
	});
};

/**
 * List of Vaults
 */
exports.listByTrackerId = function(req, res) {
	var trackerId = null;
	if(req.query.trackerId){
		trackerId = req.query.trackerId;	
	} else if (req.params.trackerId){
		trackerId = req.params.trackerId;
	}
	
	Incexp.find({tracker: mongoose.Types.ObjectId(trackerId)})
	// Vault.find({'tracker' : mongoose.Types.ObjectId(req.tracker._id)})
	.populate({
		'path' : 'owner',
		'select' : 'firstName lastName displayName email _id'
	})
    .populate({
        'path' : 'tracker',
        'select' : 'displayName _id'
    })
	.sort('-created').exec(function(err, incexps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(incexps);
		}
	});
};

/**
 * Incexp middleware
 */
exports.incexpByID = function(req, res, next, id) { 
	Incexp.findById(id)
	.populate({
		'path' : 'owner',
		'select' : 'firstName lastName displayName email _id'
	})
	.populate({
		'path' : 'pendingWith',
		'select' : 'displayName _id'
	})
    .populate({
        'path' : 'tracker',
        'select' : 'displayName _id'
    })
	.exec(function(err, incexp) {
		if (err) return next(err);
		if (! incexp) return next(new Error('Failed to load Incexp ' + id));
		req.incexp = incexp ;
		next();
	});
};


/**
 * Vault middleware (Inclusive of tracker)
 */
exports.incexpByTrackerIncexpID = function(req, res, next, id) {
	if(req.body && req.body._id){
		Incexp.findById(req.body._id)
		.populate('owner', 'displayName')
		.exec(function(err, incexp) {
			if (err) return next(err);
			if (! incexp) return next(new Error('Failed to load Vault ' + id));
			req.incexp = incexp ;
			next();
		});	
	} else {
		next();	
	}
};


/**
 * Incexp authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
//    if(! (req.query.incexpId)){
//        return res.status(403).send('User is not authorized - no request body found');
//    }
    var incexpId = req.incexp._id;
    Incexp.findById(incexpId)
        .populate('owner', 'displayName')
        .exec(function(err, incexp) {
            if (err) return next(err);
            if (! incexp) return next(new Error('Failed to load Vault ' + incexpId));
            //TODO - why !== is not working here
            if (incexp.owner._id.toString() !== req.user.id.toString()) {
                return res.status(403).send('User is not authorized');
            }
            req.incexp = incexp;
            next();
        });
};
