'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Incexp Schema
 */
var IncexpSchema = new Schema({
	displayName: {
		type: String,
		default: '',
		required: 'Please fill Incexp name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Incexp name',
		trim: true
	},
	tracker: {
		type: Schema.ObjectId,
		ref: 'Tracker'
	},
	tags: [{
		type: String
	}],
	amount: {
		type: Number,
		required: 'Amount is mandatory'
	},
	vault: {
		type: Schema.ObjectId,
		ref: 'Vault'		
	},
	isPending: {
		type: Boolean
	},
	pendingType: {
		type: String 
	},
    pendingMsg: {
        type: String
    },
	pendingWith: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	updatedBy: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Incexp', IncexpSchema);
