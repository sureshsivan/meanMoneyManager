'use strict';

(function() {
	// Vaults Controller Spec
	describe('Vaults Controller Tests', function() {
		// Initialize global variables
		var VaultsController,
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

			// Initialize the Vaults controller.
			VaultsController = $controller('VaultsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Vault object fetched from XHR', inject(function(Vaults) {
			// Create sample Vault using the Vaults service
			var sampleVault = new Vaults({
				name: 'New Vault'
			});

			// Create a sample Vaults array that includes the new Vault
			var sampleVaults = [sampleVault];

			// Set GET response
			$httpBackend.expectGET('vaults').respond(sampleVaults);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vaults).toEqualData(sampleVaults);
		}));

		it('$scope.findOne() should create an array with one Vault object fetched from XHR using a vaultId URL parameter', inject(function(Vaults) {
			// Define a sample Vault object
			var sampleVault = new Vaults({
				name: 'New Vault'
			});

			// Set the URL parameter
			$stateParams.vaultId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/vaults\/([0-9a-fA-F]{24})$/).respond(sampleVault);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vault).toEqualData(sampleVault);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Vaults) {
			// Create a sample Vault object
			var sampleVaultPostData = new Vaults({
				name: 'New Vault'
			});

			// Create a sample Vault response
			var sampleVaultResponse = new Vaults({
				_id: '525cf20451979dea2c000001',
				name: 'New Vault'
			});

			// Fixture mock form input values
			scope.name = 'New Vault';

			// Set POST response
			$httpBackend.expectPOST('vaults', sampleVaultPostData).respond(sampleVaultResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Vault was created
			expect($location.path()).toBe('/vaults/' + sampleVaultResponse._id);
		}));

		it('$scope.update() should update a valid Vault', inject(function(Vaults) {
			// Define a sample Vault put data
			var sampleVaultPutData = new Vaults({
				_id: '525cf20451979dea2c000001',
				name: 'New Vault'
			});

			// Mock Vault in scope
			scope.vault = sampleVaultPutData;

			// Set PUT response
			$httpBackend.expectPUT(/vaults\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/vaults/' + sampleVaultPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid vaultId and remove the Vault from the scope', inject(function(Vaults) {
			// Create new Vault object
			var sampleVault = new Vaults({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Vaults array and include the Vault
			scope.vaults = [sampleVault];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/vaults\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVault);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.vaults.length).toBe(0);
		}));
	});
}());