'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vault Schema
 */
var VaultSchema = new Schema({
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
	tracker: {
		type: Schema.ObjectId,
		ref: 'Tracker'
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Vault', VaultSchema);
