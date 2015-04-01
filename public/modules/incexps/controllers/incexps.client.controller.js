'use strict';

// Incexps controller
angular.module('incexps').controller('IncexpsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Incexps',
	function($scope, $stateParams, $location, Authentication, Incexps) {
		$scope.authentication = Authentication;

		// Create new Incexp
		$scope.create = function() {
			// Create new Incexp object
			var incexp = new Incexps ({
				name: this.name
			});

			// Redirect after save
			incexp.$save(function(response) {
				$location.path('incexps/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Incexp
		$scope.remove = function(incexp) {
			if ( incexp ) { 
				incexp.$remove();

				for (var i in $scope.incexps) {
					if ($scope.incexps [i] === incexp) {
						$scope.incexps.splice(i, 1);
					}
				}
			} else {
				$scope.incexp.$remove(function() {
					$location.path('incexps');
				});
			}
		};

		// Update existing Incexp
		$scope.update = function() {
			var incexp = $scope.incexp;

			incexp.$update(function() {
				$location.path('incexps/' + incexp._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Incexps
		$scope.find = function() {
			$scope.incexps = Incexps.query();
		};

		// Find existing Incexp
		$scope.findOne = function() {
			$scope.incexp = Incexps.get({ 
				incexpId: $stateParams.incexpId
			});
		};
	}
]);