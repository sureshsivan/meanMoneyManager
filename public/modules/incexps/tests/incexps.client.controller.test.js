'use strict';

(function() {
	// Incexps Controller Spec
	describe('Incexps Controller Tests', function() {
		// Initialize global variables
		var IncexpsController,
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

			// Initialize the Incexps controller.
			IncexpsController = $controller('IncexpsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Incexp object fetched from XHR', inject(function(Incexps) {
			// Create sample Incexp using the Incexps service
			var sampleIncexp = new Incexps({
				name: 'New Incexp'
			});

			// Create a sample Incexps array that includes the new Incexp
			var sampleIncexps = [sampleIncexp];

			// Set GET response
			$httpBackend.expectGET('incexps').respond(sampleIncexps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.incexps).toEqualData(sampleIncexps);
		}));

		it('$scope.findOne() should create an array with one Incexp object fetched from XHR using a incexpId URL parameter', inject(function(Incexps) {
			// Define a sample Incexp object
			var sampleIncexp = new Incexps({
				name: 'New Incexp'
			});

			// Set the URL parameter
			$stateParams.incexpId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/incexps\/([0-9a-fA-F]{24})$/).respond(sampleIncexp);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.incexp).toEqualData(sampleIncexp);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Incexps) {
			// Create a sample Incexp object
			var sampleIncexpPostData = new Incexps({
				name: 'New Incexp'
			});

			// Create a sample Incexp response
			var sampleIncexpResponse = new Incexps({
				_id: '525cf20451979dea2c000001',
				name: 'New Incexp'
			});

			// Fixture mock form input values
			scope.name = 'New Incexp';

			// Set POST response
			$httpBackend.expectPOST('incexps', sampleIncexpPostData).respond(sampleIncexpResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Incexp was created
			expect($location.path()).toBe('/incexps/' + sampleIncexpResponse._id);
		}));

		it('$scope.update() should update a valid Incexp', inject(function(Incexps) {
			// Define a sample Incexp put data
			var sampleIncexpPutData = new Incexps({
				_id: '525cf20451979dea2c000001',
				name: 'New Incexp'
			});

			// Mock Incexp in scope
			scope.incexp = sampleIncexpPutData;

			// Set PUT response
			$httpBackend.expectPUT(/incexps\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/incexps/' + sampleIncexpPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid incexpId and remove the Incexp from the scope', inject(function(Incexps) {
			// Create new Incexp object
			var sampleIncexp = new Incexps({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Incexps array and include the Incexp
			scope.incexps = [sampleIncexp];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/incexps\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleIncexp);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.incexps.length).toBe(0);
		}));
	});
}());