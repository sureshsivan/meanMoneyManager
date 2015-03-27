'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');


exports.getAllUsers = function(req, res) {
	User.find()
		.where('_id').ne(req.user._id)
		.select('_id email firstName lastName displayName')
//		.limit(10)
		.exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};
exports.searchAllUsers = function(req, res) {

	var query = req.query.q;
	var users = req.query.nu;
	var excludeUsers = [];
	if(users && users.length > 0){
		excludeUsers = users.split(',');
	}
	// console.log(query.length);
	var filter = {};
	if(query && query.length > 0){
		var queryRegX = new RegExp(query, "i");
		filter.$or = [];
		filter.$or.push({'firstName' : {$regex : queryRegX}});
		filter.$or.push({'lastName' : {$regex : queryRegX}});
		filter.$or.push({'displayName' : {$regex : queryRegX}});
		filter.$or.push({'email' : {$regex : queryRegX}});
	}
	console.log(filter);
	console.log(excludeUsers);
	User.find(filter)
		.where('_id').nin(excludeUsers)
		.select('_id email firstName lastName displayName')
//		.limit(10)
		.exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};
