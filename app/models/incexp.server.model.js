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
	name: {
		type: String,
		default: '',
		required: 'Please fill Incexp name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Incexp', IncexpSchema);