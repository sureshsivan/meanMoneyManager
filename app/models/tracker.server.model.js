'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tracker Schema
 */
var TrackerSchema = new Schema({
//	_id: {
//		type: ObjectId
//	},
	displayName: {
		type: String,
		default: '',
		required: 'Please fill Tracker name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Tracker Descrition',
		trim: true
	},
	currency: {
		type: String
	},
//	currency: {
//	},
	owner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	created: {
		type: Date,
		default: Date.now
	}

});

mongoose.model('Tracker', TrackerSchema);
