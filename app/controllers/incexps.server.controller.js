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
 * Incexp middleware
 */
exports.incexpByID = function(req, res, next, id) { 
	Incexp.findById(id).populate('user', 'displayName').exec(function(err, incexp) {
		if (err) return next(err);
		if (! incexp) return next(new Error('Failed to load Incexp ' + id));
		req.incexp = incexp ;
		next();
	});
};

/**
 * Incexp authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.incexp.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
