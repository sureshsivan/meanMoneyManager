'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'), 
	nodemailer = require('nodemailer'), 
	mg = require('nodemailer-mailgun-transport'), 
	async = require('async'),
    util = require('util'),
    EventEmitter = require("events").EventEmitter,
    auth = {
        auth : {
            api_key : config.mailer.options.auth.api_key,
            domain : config.mailer.options.auth.domain
        }
    },
    nodemailerMailgun = nodemailer.createTransport(mg(auth));


//function AppMailer(){
//    EventEmitter.call(this);
//}
//util.inherits(AppMailer, EventEmitter);
//AppMailer.prototype.sendMail = function(res, onError, onComplete, mailSubjectTemplateFile, mailBodyTemplateFile, mailData, mailAddresses) {
//    async.waterfall([function(done) {
//        res.render('templates/' + mailSubjectTemplateFile, mailData, function(err, emailSubject) {
//            done(err, emailSubject);
//        });
//    },
//        function(emailSubject, done) {
//            res.render('templates/' + mailBodyTemplateFile, mailData, function(err, emailBodyHTML) {
//                done(err, emailSubject, emailBodyHTML);
//            });
//        },
//        function(emailSubject, emailBodyHTML, done) {
//            var auth = {
//                auth : {
//                    api_key : config.mailer.options.auth.api_key,
//                    domain : config.mailer.options.auth.domain
//                }
//            };
//            var nodemailerMailgun = nodemailer.createTransport(mg(auth));
//            nodemailerMailgun.sendMail({
//                from : mailAddresses.from,
//                to : mailAddresses.to,
//                subject : emailSubject,
//                'h:Reply-To' : mailAddresses.from,
//                html : emailBodyHTML
//            }, function(err, info) {
//                if (err) {
//                    done(err);
//                } else {
//                    onComplete();
//                }
//            });
//        } ], function(err) {
//        if (err) {
//            onError(err);
//        }
//    });
//};
//module.exports = AppMailer;



exports.sendMail = function(res, onError, onComplete, mailSubjectTemplateFile, mailBodyTemplateFile, mailData, mailAddresses) {
    var me = this;
	async.waterfall([function(done) {
		console.log('Do Cleanup');
		done();
	},
	function(done) {
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
//		var auth = {
//			auth : {
//				api_key : config.mailer.options.auth.api_key,
//				domain : config.mailer.options.auth.domain
//			}
//		};
//		var nodemailerMailgun = nodemailer.createTransport(mg(auth));
		console.log(auth);
		console.log(nodemailerMailgun);
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
