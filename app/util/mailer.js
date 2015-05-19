'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'), 
	nodemailer = require('nodemailer'), 
	mg = require('nodemailer-mailgun-transport'), 
	async = require('async');

exports.sendMail = function(res, onError, onComplete, mailSubjectTemplateFile, mailBodyTemplateFile, mailData, mailAddresses) {
	async.waterfall([function(done) {
		res.render('templates/' + mailSubjectTemplateFile, mailData, function(err, emailSubject) {
			done(err, emailSubject);
		});
	},
	function(emailSubject, done) {
		res.render('templates/' + mailBodyTemplateFile, mailData, function(err, emailBodyHTML) {
			done(err, emailSubject, emailBodyHTML);
		});
	},
	function(emailSubject, emailBodyHTML, done) {
		var auth = {
			auth : {
				api_key : config.mailer.options.auth.api_key,
				domain : config.mailer.options.auth.domain
			}
		};
		var nodemailerMailgun = nodemailer.createTransport(mg(auth));
		nodemailerMailgun.sendMail({
			from : mailAddresses.from,
			to : mailAddresses.to,
			subject : emailSubject,
			'h:Reply-To' : mailAddresses.from,
			html : emailBodyHTML
		}, function(err, info) {
			if (err) {
				done(err);
			} else {
				onComplete();
			}
		});
	} ], function(err) {
		if (err) {
			onError(err);
		}
	});
};