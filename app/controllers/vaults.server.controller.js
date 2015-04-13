'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Vault = mongoose.model('Vault'),
	_ = require('lodash'),
	incexps = require('../../app/controllers/incexps.server.controller'),
    Q = require('q');

/**
 * Create a Vault
 */
exports.create = function(req, res) {

	var vault = new Vault(req.body);
	vault.user = req.user;

	vault.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vault);
		}
	});
};

/**
 * Show the current Vault
 */
exports.read = function(req, res) {
	res.jsonp(req.vault);
};

/**
 * Update a Vault
 */
exports.update = function(req, res) {
	var vault = req.vault ;
	vault = _.extend(vault , req.body);

	vault.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vault);
		}
	});
};

/**
 * Delete an Vault
 */
exports.delete = function(req, res) {
	var vault = req.vault ;

	vault.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vault);
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

    Vault.remove({tracker: mongoose.Types.ObjectId(trackerId)}, function(err) {
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
 * List of Vaults
 */
exports.list = function(req, res) {
	Vault.find().sort('-created').populate('user', 'displayName').exec(function(err, vaults) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vaults);
		}
	});
};


exports.listVaultDetailsForTracker = function(req, res){
	exports.listVaultsForTracker(req)
    .then(incexps.findVaultIncexpCounts, function(err){
        console.log(err);
    })
	.then(function(req){
		exports.mergeVaultDetails(req);
		res.jsonp(req.trackerVaults);
	}, function(err){
		console.log(err);
	});
};

/**
 * List of Vaults
 */
exports.listVaultsForTracker = function(req, res) {
	var deferred = Q.defer();
	Vault.find({tracker: mongoose.Types.ObjectId(req.tracker._id)})
	.populate({
		'path' : 'owner',
		'select' : 'firstName lastName displayName email _id'
	})
    .populate({
        'path' : 'tracker',
        'select' : 'displayName _id'
    })
	.sort('-created').exec(function(err, vaults) {
		if (err) {
			deferred.reject(err);
		} else {
			//	save data to request obj for future merge
			req.trackerVaults = vaults;
			deferred.resolve(req);
		}
	});
	return deferred.promise;
};

/**
 * List of Vaults - excluding vaults
 */
exports.listByTrackerIdExcludeVaults = function(req, res) {
	var vaults = req.query.exv;
	var excludeVaults = [];
	if(vaults && vaults.length > 0){
		excludeVaults = vaults.split(',');
	}
	Vault.find({tracker: mongoose.Types.ObjectId(req.query.tId)})
	// Vault.find({'tracker' : mongoose.Types.ObjectId(req.tracker._id)})
	.where('_id').nin(excludeVaults)
	.select('_id displayName')
	.sort('-created').exec(function(err, vaults) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vaults);
		}
	});
};

/**
 * Vault middleware
 */
exports.vaultByID = function(req, res, next, id) {
	Vault.findById(id)
        .populate({
            'path' : 'owner',
            'select' : 'firstName lastName displayName email _id'
        })
        .populate({
            'path' : 'tracker',
            'select' : 'displayName _id'
        })
        .exec(function(err, vault) {
		if (err) return next(err);
		if (! vault) return next(new Error('Failed to load Vault ' + id));
		req.vault = vault ;
		next();
	});
};

/**
 * Vault middleware (Inclusive of tracker)
 */
exports.vaultByTrackerVaultID = function(req, res, next, id) {
	if(req.body && req.body._id){
		Vault.findById(req.body._id)
		.populate('owner', 'displayName')
		.exec(function(err, vault) {
			if (err) return next(err);
			if (! vault) return next(new Error('Failed to load Vault ' + id));
			req.vault = vault ;
			next();
		});	
	} else {
		next();	
	}
};


exports.findTrackerVaultCounts = function(req){
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
        Vault.aggregate(agg, function(err, response){
            if(err){
                deferred.reject(err);
            }
            if(response){
                req.trackerVaultCounts = response;
                deferred.resolve(req);
            }
        });
    }
    return deferred.promise;
};

/**
 * Vault authorization middleware
 */
exports.hasAuthorizationWithTracker = function(req, res, next) {
    if(! (req.query.vaultId)){
        return res.status(403).send('User is not authorized - no request body found');
    }
    var vaultId = req.query.vaultId;
    Vault.findById(vaultId)
        .populate('owner', 'displayName')
        .exec(function(err, vault) {
            if (err) return next(err);
            if (! vault) return next(new Error('Failed to load Vault ' + vaultId));
            //TODO - why !== is not working here
            if (vault.owner._id.toString() !== req.user.id.toString()) {
                return res.status(403).send('User is not authorized');
            }
            req.vault = vault;
            next();
        });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.vault.owner.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};


exports.mergeVaultDetails = function(req){
	var trackerVaults = req.trackerVaults;
	var vaultIncexpCounts = req.vaultIncexpCounts;
	var modifiedVaults = [];
	_.each(trackerVaults, function(vault){
		vault = vault.toObject();
		vault.incexpCount = 0;
            //TODO - to check whether return false to break off the loop
		_.each(vaultIncexpCounts, function(vaultIncexpCounts){
			if(vaultIncexpCounts._id.toString() === vault._id.toString()){
				vault.incexpCount = vaultIncexpCounts.count;
			}
		});
		modifiedVaults.push(vault);
	});
	req.trackerVaults = modifiedVaults;
};
