'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Vault = mongoose.model('Vault'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, vault;

/**
 * Vault routes tests
 */
describe('Vault CRUD tests', function() {
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

		// Save a user to the test db and create new Vault
		user.save(function() {
			vault = {
				name: 'Vault Name'
			};

			done();
		});
	});

	it('should be able to save Vault instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vault
				agent.post('/vaults')
					.send(vault)
					.expect(200)
					.end(function(vaultSaveErr, vaultSaveRes) {
						// Handle Vault save error
						if (vaultSaveErr) done(vaultSaveErr);

						// Get a list of Vaults
						agent.get('/vaults')
							.end(function(vaultsGetErr, vaultsGetRes) {
								// Handle Vault save error
								if (vaultsGetErr) done(vaultsGetErr);

								// Get Vaults list
								var vaults = vaultsGetRes.body;

								// Set assertions
								(vaults[0].user._id).should.equal(userId);
								(vaults[0].name).should.match('Vault Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Vault instance if not logged in', function(done) {
		agent.post('/vaults')
			.send(vault)
			.expect(401)
			.end(function(vaultSaveErr, vaultSaveRes) {
				// Call the assertion callback
				done(vaultSaveErr);
			});
	});

	it('should not be able to save Vault instance if no name is provided', function(done) {
		// Invalidate name field
		vault.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vault
				agent.post('/vaults')
					.send(vault)
					.expect(400)
					.end(function(vaultSaveErr, vaultSaveRes) {
						// Set message assertion
						(vaultSaveRes.body.message).should.match('Please fill Vault name');
						
						// Handle Vault save error
						done(vaultSaveErr);
					});
			});
	});

	it('should be able to update Vault instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vault
				agent.post('/vaults')
					.send(vault)
					.expect(200)
					.end(function(vaultSaveErr, vaultSaveRes) {
						// Handle Vault save error
						if (vaultSaveErr) done(vaultSaveErr);

						// Update Vault name
						vault.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Vault
						agent.put('/vaults/' + vaultSaveRes.body._id)
							.send(vault)
							.expect(200)
							.end(function(vaultUpdateErr, vaultUpdateRes) {
								// Handle Vault update error
								if (vaultUpdateErr) done(vaultUpdateErr);

								// Set assertions
								(vaultUpdateRes.body._id).should.equal(vaultSaveRes.body._id);
								(vaultUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Vaults if not signed in', function(done) {
		// Create new Vault model instance
		var vaultObj = new Vault(vault);

		// Save the Vault
		vaultObj.save(function() {
			// Request Vaults
			request(app).get('/vaults')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Vault if not signed in', function(done) {
		// Create new Vault model instance
		var vaultObj = new Vault(vault);

		// Save the Vault
		vaultObj.save(function() {
			request(app).get('/vaults/' + vaultObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', vault.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Vault instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vault
				agent.post('/vaults')
					.send(vault)
					.expect(200)
					.end(function(vaultSaveErr, vaultSaveRes) {
						// Handle Vault save error
						if (vaultSaveErr) done(vaultSaveErr);

						// Delete existing Vault
						agent.delete('/vaults/' + vaultSaveRes.body._id)
							.send(vault)
							.expect(200)
							.end(function(vaultDeleteErr, vaultDeleteRes) {
								// Handle Vault error error
								if (vaultDeleteErr) done(vaultDeleteErr);

								// Set assertions
								(vaultDeleteRes.body._id).should.equal(vaultSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Vault instance if not signed in', function(done) {
		// Set Vault user 
		vault.user = user;

		// Create new Vault model instance
		var vaultObj = new Vault(vault);

		// Save the Vault
		vaultObj.save(function() {
			// Try deleting Vault
			request(app).delete('/vaults/' + vaultObj._id)
			.expect(401)
			.end(function(vaultDeleteErr, vaultDeleteRes) {
				// Set message assertion
				(vaultDeleteRes.body.message).should.match('User is not logged in');

				// Handle Vault error error
				done(vaultDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Vault.remove().exec();
		done();
	});
});