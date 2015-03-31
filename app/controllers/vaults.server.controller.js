'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Vault = mongoose.model('Vault'),
	_ = require('lodash');

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
	console.log('EEEEEEEEE');
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

/**
 * List of Vaults
 */
exports.listByTrackerId = function(req, res) {
	Vault.find({tracker: mongoose.Types.ObjectId(req.query.trackerId)})
	// Vault.find({'tracker' : mongoose.Types.ObjectId(req.tracker._id)})
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
	Vault.findById(id).populate('user', 'displayName').exec(function(err, vault) {
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

/**
 * Vault authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	console.log(req.vault.owner.id);
	console.log(req.user.id);
	if (req.vault.owner.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
