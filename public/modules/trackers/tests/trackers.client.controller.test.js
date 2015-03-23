'use strict';

(function() {
	// Trackers Controller Spec
	describe('Trackers Controller Tests', function() {
		// Initialize global variables
		var TrackersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Trackers controller.
			TrackersController = $controller('TrackersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tracker object fetched from XHR', inject(function(Trackers) {
			// Create sample Tracker using the Trackers service
			var sampleTracker = new Trackers({
				name: 'New Tracker'
			});

			// Create a sample Trackers array that includes the new Tracker
			var sampleTrackers = [sampleTracker];

			// Set GET response
			$httpBackend.expectGET('trackers').respond(sampleTrackers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trackers).toEqualData(sampleTrackers);
		}));

		it('$scope.findOne() should create an array with one Tracker object fetched from XHR using a trackerId URL parameter', inject(function(Trackers) {
			// Define a sample Tracker object
			var sampleTracker = new Trackers({
				name: 'New Tracker'
			});

			// Set the URL parameter
			$stateParams.trackerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/trackers\/([0-9a-fA-F]{24})$/).respond(sampleTracker);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tracker).toEqualData(sampleTracker);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Trackers) {
			// Create a sample Tracker object
			var sampleTrackerPostData = new Trackers({
				name: 'New Tracker'
			});

			// Create a sample Tracker response
			var sampleTrackerResponse = new Trackers({
				_id: '525cf20451979dea2c000001',
				name: 'New Tracker'
			});

			// Fixture mock form input values
			scope.name = 'New Tracker';

			// Set POST response
			$httpBackend.expectPOST('trackers', sampleTrackerPostData).respond(sampleTrackerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tracker was created
			expect($location.path()).toBe('/trackers/' + sampleTrackerResponse._id);
		}));

		it('$scope.update() should update a valid Tracker', inject(function(Trackers) {
			// Define a sample Tracker put data
			var sampleTrackerPutData = new Trackers({
				_id: '525cf20451979dea2c000001',
				name: 'New Tracker'
			});

			// Mock Tracker in scope
			scope.tracker = sampleTrackerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/trackers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/trackers/' + sampleTrackerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid trackerId and remove the Tracker from the scope', inject(function(Trackers) {
			// Create new Tracker object
			var sampleTracker = new Trackers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Trackers array and include the Tracker
			scope.trackers = [sampleTracker];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/trackers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTracker);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.trackers.length).toBe(0);
		}));
	});
}());