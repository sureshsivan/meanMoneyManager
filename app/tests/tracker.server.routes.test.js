'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tracker = mongoose.model('Tracker'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tracker;

/**
 * Tracker routes tests
 */
describe('Tracker CRUD tests', function() {
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

		// Save a user to the test db and create new Tracker
		user.save(function() {
			tracker = {
				name: 'Tracker Name'
			};

			done();
		});
	});

	it('should be able to save Tracker instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tracker
				agent.post('/trackers')
					.send(tracker)
					.expect(200)
					.end(function(trackerSaveErr, trackerSaveRes) {
						// Handle Tracker save error
						if (trackerSaveErr) done(trackerSaveErr);

						// Get a list of Trackers
						agent.get('/trackers')
							.end(function(trackersGetErr, trackersGetRes) {
								// Handle Tracker save error
								if (trackersGetErr) done(trackersGetErr);

								// Get Trackers list
								var trackers = trackersGetRes.body;

								// Set assertions
								(trackers[0].user._id).should.equal(userId);
								(trackers[0].name).should.match('Tracker Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tracker instance if not logged in', function(done) {
		agent.post('/trackers')
			.send(tracker)
			.expect(401)
			.end(function(trackerSaveErr, trackerSaveRes) {
				// Call the assertion callback
				done(trackerSaveErr);
			});
	});

	it('should not be able to save Tracker instance if no name is provided', function(done) {
		// Invalidate name field
		tracker.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tracker
				agent.post('/trackers')
					.send(tracker)
					.expect(400)
					.end(function(trackerSaveErr, trackerSaveRes) {
						// Set message assertion
						(trackerSaveRes.body.message).should.match('Please fill Tracker name');
						
						// Handle Tracker save error
						done(trackerSaveErr);
					});
			});
	});

	it('should be able to update Tracker instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tracker
				agent.post('/trackers')
					.send(tracker)
					.expect(200)
					.end(function(trackerSaveErr, trackerSaveRes) {
						// Handle Tracker save error
						if (trackerSaveErr) done(trackerSaveErr);

						// Update Tracker name
						tracker.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tracker
						agent.put('/trackers/' + trackerSaveRes.body._id)
							.send(tracker)
							.expect(200)
							.end(function(trackerUpdateErr, trackerUpdateRes) {
								// Handle Tracker update error
								if (trackerUpdateErr) done(trackerUpdateErr);

								// Set assertions
								(trackerUpdateRes.body._id).should.equal(trackerSaveRes.body._id);
								(trackerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Trackers if not signed in', function(done) {
		// Create new Tracker model instance
		var trackerObj = new Tracker(tracker);

		// Save the Tracker
		trackerObj.save(function() {
			// Request Trackers
			request(app).get('/trackers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tracker if not signed in', function(done) {
		// Create new Tracker model instance
		var trackerObj = new Tracker(tracker);

		// Save the Tracker
		trackerObj.save(function() {
			request(app).get('/trackers/' + trackerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tracker.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tracker instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tracker
				agent.post('/trackers')
					.send(tracker)
					.expect(200)
					.end(function(trackerSaveErr, trackerSaveRes) {
						// Handle Tracker save error
						if (trackerSaveErr) done(trackerSaveErr);

						// Delete existing Tracker
						agent.delete('/trackers/' + trackerSaveRes.body._id)
							.send(tracker)
							.expect(200)
							.end(function(trackerDeleteErr, trackerDeleteRes) {
								// Handle Tracker error error
								if (trackerDeleteErr) done(trackerDeleteErr);

								// Set assertions
								(trackerDeleteRes.body._id).should.equal(trackerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tracker instance if not signed in', function(done) {
		// Set Tracker user 
		tracker.user = user;

		// Create new Tracker model instance
		var trackerObj = new Tracker(tracker);

		// Save the Tracker
		trackerObj.save(function() {
			// Try deleting Tracker
			request(app).delete('/trackers/' + trackerObj._id)
			.expect(401)
			.end(function(trackerDeleteErr, trackerDeleteRes) {
				// Set message assertion
				(trackerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tracker error error
				done(trackerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tracker.remove().exec();
		done();
	});
});