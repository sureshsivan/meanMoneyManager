'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Incexp = mongoose.model('Incexp'),
	_ = require('lodash'),
	Q = require('q'),
//    config = require('../../config/config'),
//    nodemailer = require('nodemailer'),
//    mg = require('nodemailer-mailgun-transport'),
	mailer = require('../util/mailer'),
    async = require('async');

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
        'select' : 'displayName currency _id'
    })
	.populate({
		'path' : 'pendingWith',
		'select' : 'displayName _id'
	})
    .populate({
        'path' : 'vault',
        'select' : 'displayName _id'
    })
	.sort('-evDate').exec(function(err, incexps) {
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
exports.listByTrackerIdAndMonth = function(req, res) {
    var trackerId = null;
    if(req.query.trackerId){
        trackerId = req.query.trackerId;
    } else if (req.params.trackerId){
        trackerId = req.params.trackerId;
    }

    var start = null;
    var end = null;
    if(req.params.month && req.params.year){
        start = new Date(req.params.year, req.params.month-1);
        end = new Date(req.params.year, req.params.month-1);
        end.setMonth(req.params.month);
    }
    Incexp.find({
        '$and': [{
            tracker: mongoose.Types.ObjectId(trackerId)
        }, {
            evDate: {
                '$lt': end,
                '$gte': start
            }
        }]
    })//{tracker: mongoose.Types.ObjectId(trackerId)})
        // Vault.find({'tracker' : mongoose.Types.ObjectId(req.tracker._id)})
        .populate({
            'path' : 'owner',
            'select' : 'firstName lastName displayName email _id'
        })
        .populate({
            'path' : 'tracker',
            'select' : 'displayName currency _id'
        })
        .populate({
            'path' : 'pendingWith',
            'select' : 'displayName _id'
        })
        .populate({
            'path' : 'vault',
            'select' : 'displayName _id'
        })
        .sort('-evDate').exec(function(err, incexps) {
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



exports.findTrackerAlertCounts = function(req){
	var trackerIds = [];
	_.each(req.trackers, function(tracker){
		trackerIds.push(mongoose.Types.ObjectId(tracker._id));
	});
	var deferred = Q.defer();
	if(!trackerIds || !trackerIds.length){
		deferred.resolve(req);
	} else {
		var agg = [];
		//TODO - add user and approval flag pending conditions
        agg.push({
            $match: {
                '$and': [{
                    'tracker': {$in: trackerIds}
                }, {
                    'isPending': true
                }]
            }
        });
		agg.push({$group:{_id:'$tracker', count:{$sum:1}}});
		//agg.push({$project:{_id: 0, count: 1}});
		Incexp.aggregate(agg, function(err, response){
			if(err){
				deferred.reject(err);
			}
			if(response){
				req.trackerIncExpAlerts = response;
				deferred.resolve(req);
			}
		});
	}
	return deferred.promise;
};

exports.findTrackerAlertCountsForUser = function(req){
    var userId = req.user._id;
    var trackerIds = [];
    _.each(req.trackers, function(tracker){
        trackerIds.push(mongoose.Types.ObjectId(tracker._id));
    });
    var deferred = Q.defer();
    if(!trackerIds || !trackerIds.length){
        deferred.resolve(req);
    } else {
        var agg = [];
        //TODO - add user and approval flag pending conditions
        agg.push({
            $match: {
                '$and': [{
                    'tracker': {$in: trackerIds}
                }, {
                    'isPending': true
                }, {
                    'pendingWith': mongoose.Types.ObjectId(userId)
                }]
            }
        });
        agg.push({$group:{_id:'$tracker', count:{$sum:1}}});
        //agg.push({$project:{_id: 0, count: 1}});
        Incexp.aggregate(agg, function(err, response){
            if(err){
                deferred.reject(err);
            }
            if(response){
                req.trackerIncExpUserAlerts = response;
                deferred.resolve(req);
            }
        });
    }
    return deferred.promise;
};

exports.findTrackerIncexpCounts = function(req){
    var trackerIds = [];
    _.each(req.trackers, function(tracker){
        trackerIds.push(mongoose.Types.ObjectId(tracker._id));
    });
    var deferred = Q.defer();
    if(!trackerIds || !trackerIds.length){
        deferred.resolve(req);
    } else {
        var agg = [];
        //TODO - add user and approval flag pending conditions
        agg.push({$match: {'tracker': {$in: trackerIds}}});
        agg.push({$group:{_id:'$tracker', count:{$sum:1}}});
        //agg.push({$project:{_id: 0, count: 1}});
        Incexp.aggregate(agg, function(err, response){
            if(err){
                deferred.reject(err);
            }
            if(response){
                req.trackerIncexpCounts = response;
                deferred.resolve(req);
            }
        });
    }
    return deferred.promise;
};

exports.findVaultIncexpCounts = function(req){
    var vaultIds = [];
    _.each(req.trackerVaults, function(vault){
        vaultIds.push(mongoose.Types.ObjectId(vault._id));
    });
    var deferred = Q.defer();
    if(!vaultIds || !vaultIds.length){
        deferred.resolve(req);
    } else {
        var agg = [];
        //TODO - add user and approval flag pending conditions
        agg.push({$match: {'vault': {$in: vaultIds}}});
        agg.push({$group:{_id:'$vault', count:{$sum:1}}});
        //agg.push({$project:{_id: 0, count: 1}});
        Incexp.aggregate(agg, function(err, response){
            if(err){
                deferred.reject(err);
            }
            if(response){
                req.vaultIncexpCounts = response;
                deferred.resolve(req);
            }
        });
    }
    return deferred.promise;
};

exports.requestEditIncexpAccess = function(req, res) {

    var incexp = req.incexp ;

    incexp.isPending = true;
    incexp.pendingType = 'UPD_ACC_REQ';
    incexp.pendingWith = mongoose.Types.ObjectId(incexp.owner._id);
    incexp.pendingMsg = 'Need Edit Income/Expense Access';
    incexp.requestedBy = mongoose.Types.ObjectId(req.user._id);

    var onError = function(e){
    	return res.status(400).send({
            message: errorHandler.getErrorMessage(e)
        });
    };
    var onComplete = function(){
    	res.jsonp(incexp);
    };
    
    incexp.save(function(err) {
        if(!err){
        	var mailAddresses = {
					from: req.user.email,
					to: [incexp.owner.email, req.user.email]
        	};
            var placeHolders = {
                requestTo: incexp.owner.displayName,
                requestedBy: req.user.displayName,
                item: incexp
            };
        	mailer.sendMail(res, onError, onComplete, 
        			'request-edit-incexp-access-emailsubject', 
        			'request-edit-incexp-access-emailbody',
                placeHolders, mailAddresses);
        } else {
        	onError(err);
        }
    });

};


exports.approveEditIncexpAccess = function(req, res) {
    var incexp = req.incexp ;

    //incexp = _.extend(incexp , req.body);
    incexp.isPending = true;
    incexp.pendingType = 'UPD_REQ';
    incexp.pendingWith = mongoose.Types.ObjectId(incexp.requestedBy);
    incexp.pendingMsg = 'Approved Edit Income/Expense Access';
    incexp.requestedBy = null;

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

exports.rejectEditIncexpAccess = function(req, res) {
    var incexp = req.incexp ;

    //incexp = _.extend(incexp , req.body);
    incexp.isPending = false;
    incexp.pendingType = null;
    incexp.pendingWith = null;
    incexp.pendingMsg = null;
    incexp.requestedBy = null;

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

exports.approveIncexpChanges = function(req, res) {
    var incexp = req.incexp ;

    incexp = _.extend(incexp , req.body);

    incexp.isPending = false;
    incexp.pendingType = null;
    incexp.pendingWith = null;
    incexp.pendingMsg = null;

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

exports.hasAuthToEditRequest = function(req, res, next) {
    var incexp = req.incexp;
    //var user = req.user;
    if(!incexp.isPending){
        next();
    } else {
        return res.status(403).send('Already in Pending Status');
    }
};

exports.hasAuthToApproveChanges = function(req, res, next) {
    var incexp = req.incexp;
    var user = req.user;
    if(incexp.isPending && incexp.pendingType === 'UPD_REQ' && incexp.pendingWith._id.toString() === user._id.toString()){
        next();
    } else {
        return res.status(403).send('No Authorization to Approve Changes');
    }
};

exports.hasAuthToApproveEditRequest = function(req, res, next) {
    var incexp = req.incexp;
    var user = req.user;
    console.log(incexp);
    console.log(user);
    if(incexp.isPending && incexp.owner._id.toString() === user._id.toString()  && incexp.pendingType === 'UPD_ACC_REQ'){
        next();
    } else {
        return res.status(403).send('Cannot Approve Edit Request - not authorised');
    }
};
