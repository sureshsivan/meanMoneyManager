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
    type: {
        type: String,
        required: 'Please fill Incexp name Income or Expense'
    },
	tracker: {
		type: Schema.ObjectId,
		ref: 'Tracker'
	},
    evDate: {
        type: Date,
        required: 'Please fill Date of Income or Expense'
        //default: Date.now
    },
	tags: [],
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
    //pendingSince: {
    //    type: Date
    //},
    requestedBy: {
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
