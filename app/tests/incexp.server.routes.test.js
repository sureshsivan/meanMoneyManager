'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Incexp = mongoose.model('Incexp'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, incexp;

/**
 * Incexp routes tests
 */
describe('Incexp CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Incexp
		user.save(function() {
			incexp = {
				name: 'Incexp Name'
			};

			done();
		});
	});

	it('should be able to save Incexp instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Incexp
				agent.post('/incexps')
					.send(incexp)
					.expect(200)
					.end(function(incexpSaveErr, incexpSaveRes) {
						// Handle Incexp save error
						if (incexpSaveErr) done(incexpSaveErr);

						// Get a list of Incexps
						agent.get('/incexps')
							.end(function(incexpsGetErr, incexpsGetRes) {
								// Handle Incexp save error
								if (incexpsGetErr) done(incexpsGetErr);

								// Get Incexps list
								var incexps = incexpsGetRes.body;

								// Set assertions
								(incexps[0].user._id).should.equal(userId);
								(incexps[0].name).should.match('Incexp Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Incexp instance if not logged in', function(done) {
		agent.post('/incexps')
			.send(incexp)
			.expect(401)
			.end(function(incexpSaveErr, incexpSaveRes) {
				// Call the assertion callback
				done(incexpSaveErr);
			});
	});

	it('should not be able to save Incexp instance if no name is provided', function(done) {
		// Invalidate name field
		incexp.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Incexp
				agent.post('/incexps')
					.send(incexp)
					.expect(400)
					.end(function(incexpSaveErr, incexpSaveRes) {
						// Set message assertion
						(incexpSaveRes.body.message).should.match('Please fill Incexp name');
						
						// Handle Incexp save error
						done(incexpSaveErr);
					});
			});
	});

	it('should be able to update Incexp instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Incexp
				agent.post('/incexps')
					.send(incexp)
					.expect(200)
					.end(function(incexpSaveErr, incexpSaveRes) {
						// Handle Incexp save error
						if (incexpSaveErr) done(incexpSaveErr);

						// Update Incexp name
						incexp.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Incexp
						agent.put('/incexps/' + incexpSaveRes.body._id)
							.send(incexp)
							.expect(200)
							.end(function(incexpUpdateErr, incexpUpdateRes) {
								// Handle Incexp update error
								if (incexpUpdateErr) done(incexpUpdateErr);

								// Set assertions
								(incexpUpdateRes.body._id).should.equal(incexpSaveRes.body._id);
								(incexpUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Incexps if not signed in', function(done) {
		// Create new Incexp model instance
		var incexpObj = new Incexp(incexp);

		// Save the Incexp
		incexpObj.save(function() {
			// Request Incexps
			request(app).get('/incexps')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Incexp if not signed in', function(done) {
		// Create new Incexp model instance
		var incexpObj = new Incexp(incexp);

		// Save the Incexp
		incexpObj.save(function() {
			request(app).get('/incexps/' + incexpObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', incexp.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Incexp instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Incexp
				agent.post('/incexps')
					.send(incexp)
					.expect(200)
					.end(function(incexpSaveErr, incexpSaveRes) {
						// Handle Incexp save error
						if (incexpSaveErr) done(incexpSaveErr);

						// Delete existing Incexp
						agent.delete('/incexps/' + incexpSaveRes.body._id)
							.send(incexp)
							.expect(200)
							.end(function(incexpDeleteErr, incexpDeleteRes) {
								// Handle Incexp error error
								if (incexpDeleteErr) done(incexpDeleteErr);

								// Set assertions
								(incexpDeleteRes.body._id).should.equal(incexpSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Incexp instance if not signed in', function(done) {
		// Set Incexp user 
		incexp.user = user;

		// Create new Incexp model instance
		var incexpObj = new Incexp(incexp);

		// Save the Incexp
		incexpObj.save(function() {
			// Try deleting Incexp
			request(app).delete('/incexps/' + incexpObj._id)
			.expect(401)
			.end(function(incexpDeleteErr, incexpDeleteRes) {
				// Set message assertion
				(incexpDeleteRes.body.message).should.match('User is not logged in');

				// Handle Incexp error error
				done(incexpDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Incexp.remove().exec();
		done();
	});
});