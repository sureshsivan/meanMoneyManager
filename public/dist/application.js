'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'meanmoneymanager';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',
	                                           'ui.router', 'ui.bootstrap', 'ui.utils', 'angularMoment'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('admin');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('incexps');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('trackers');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('vaults');
'use strict';

// Admin module config
angular.module('admin').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('topbar', 'Administer', 'admin', 'dropdown', '/admin(/admin)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'admin', 'List Trackers', 'trackersall', null, false, ['admin']);
		Menus.addSubMenuItem('topbar', 'admin', 'List Users', 'usersall', null, false, ['admin']);
	}
]);
'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider',
	function($stateProvider) {
		// Admin state routing
		$stateProvider.
		state('admin', {
			url: '/admin',
			templateUrl: 'modules/admin/views/admin.client.view.html'
		});
	}
]);
'use strict';

angular.module('admin').controller('AdminControllerController', ['$scope',
	function($scope) {
		// Admin controller controller logic
		// ...
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.alerts = [{
			iconCls: 'glyphicon-user',
			btnStyle: 'btn-success',
			val: 'XXXXX',
			note: 'Some Note Here'
		},{
			iconCls: 'glyphicon-th',
			btnStyle: 'btn-danger',
			val: 'XXXXX',
			note: 'Some Note Here'
		},{
			iconCls: 'glyphicon-thumbs-up',
			btnStyle: 'btn-danger',
			val: 'XXXXX',
			note: 'Some Note Here'
		},{
			iconCls: 'glyphicon-envelope',
			btnStyle: 'btn-warning',
			val: 'XXXXX',
			note: 'Some Note Here'
		},{
			iconCls: 'glyphicon-retweet',
			btnStyle: 'btn-success',
			val: 'XXXXX',
			note: 'Some Note Here'
		},{
			iconCls: 'glyphicon-globe',
			btnStyle: 'btn-primary',
			val: 'XXXXX',
			note: 'Some Note Here'
		}, ];
	}
]);
'use strict';

angular.module('core').service('AppLocaleMessages', [ '$http',
	function($http) {
		var appLocaleMessages = {};
		
		appLocaleMessages.localeMessages = {
				'app.err.msg.XX' : 'App Error Message',
				'app.warn.msg.XX' : 'App Warn Message',
				'app.info.msg.XX' : 'App Info Message'
		};
		appLocaleMessages.getMsg = function(key){
			//	TODO - check for better logic
			if(Object.getOwnPropertyNames(appLocaleMessages.localeMessages).length === 0){
				return $http.get('/users/search', {
				      params: {
				    	  locale: 'en'
				      }
				    }).then(function(response){
				    	// build props
				    	return appLocaleMessages[key];
				    }, function(response) {
	                    // something went wrong
//				    	console.log(response);
//	                    return $q.reject(response.data);
	            	});
			} else {
				return appLocaleMessages[key];	
			}
			
		};
		return appLocaleMessages;
	}
]);

'use strict';

angular.module('core')

    .factory('Notify', ['$rootScope', function($rootScope) {
        var notify = {};

        notify.sendMsg = function(msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);
        };

        notify.getMsg = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);
            if (scope) {
                scope.$on('destroy', unbind);
            }
        };

        return notify;
    }]);

'use strict';

angular.module('core').service('AppStatics', [ '$http',
	function($http) {
		var appStatics = {};
		appStatics.getCurrencies = function(){
				if(! this.currencies){
					this.currencies = [{id: 'INR', label: 'Indian Rupee'},
					    		            {id: 'USD', label: 'US Dollor'},
					    		            {id: 'JPY', label: 'Japanese YEN'},
					    		            {id: 'EUR', label: 'Euro'}];
				}
				return this.currencies;
			};
		return appStatics;
	}
]);

'use strict';

angular.module('core').service('AppMessenger', [ '$rootScope',
  function($rootScope) {
    var appMessenger = {};
    appMessenger.sendInfoMsg = function(data) {
        data = data || {};
        console.log('info message sent!');
        console.dir(data);
        $rootScope.$emit('INFO', data);
    };
    appMessenger.sendWarnMsg = function(data) {
        data = data || {};
        console.log('warn message sent!');
        console.dir(data);
        $rootScope.$emit('WARN', data);
    };
    appMessenger.sendErrMsg = function(data) {
        data = data || {};
        console.log('error message sent!');
        console.dir(data);
        $rootScope.$emit('ERR', data);
    };

    // TODO - assigned vars might required in case of unbinding later
    var infoMsg = $rootScope.$on('INFO', function(e, data){
      console.log('Info Message Received');
      console.dir(data);
    });
    var warnMsg = $rootScope.$on('WARN', function(e, data){
      console.log('Warn Message Received');
      console.dir(data);
    });
    var errMsg = $rootScope.$on('ERR', function(e, data){
      console.log('Err Message Received');
      console.dir(data);
    });
    // notify.getMsg = function(msg, func, scope) {
    //     var unbind = $rootScope.$on(msg, func);

    //     if (scope) {
    //         scope.$on('destroy', unbind);
    //     }
    // };
    return appMessenger;
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar', false, ['user', 'admin']);
	}
]);
'use strict';

// Configuring the Articles module
angular.module('incexps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
//		Menus.addMenuItem('topbar', 'Incexps', 'incexps', 'dropdown', '/incexps(/create)?');
//		Menus.addSubMenuItem('topbar', 'incexps', 'List Incexps', 'incexps');
//		Menus.addSubMenuItem('topbar', 'incexps', 'New Incexp', 'incexps/create');
	}
]);
'use strict';

//Setting up route
angular.module('incexps').config(['$stateProvider',
	function($stateProvider) {
		// Incexps state routing
		$stateProvider.
		state('listTrackerIncexps', {
			url: '/trackerincexps/:trackerId',
			templateUrl: 'modules/incexps/views/list-incexps.client.view.html'
//		}).
//		state('createIncexp', {
//			url: '/incexps/create',
//			templateUrl: 'modules/incexps/views/create-incexp.client.view.html'
//		}).
//		state('viewIncexp', {
//			url: '/incexps/:incexpId',
//			templateUrl: 'modules/incexps/views/view-incexp.client.view.html'
//		}).
//		state('editIncexp', {
//			url: '/incexps/:incexpId/edit',
//			templateUrl: 'modules/incexps/views/edit-incexp.client.view.html'
		});
	}
]);
'use strict';

// Incexps controller
angular.module('incexps').controller('IncexpsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Incexps', 'TrackerIncexps', '$modal', '$log', 'moment', 'AppStatics', 'Notify', 'VaultStatics',
	function($scope, $stateParams, $location, Authentication, Incexps, TrackerIncexps, $modal, $log, moment, AppStatics, Notify, VaultStatics) {
        this.authentication = Authentication;
		this.trackerIncexps = TrackerIncexps.listTrackerIncexps($stateParams);
		this.vaultStatics = VaultStatics;
        this.trackerId = $stateParams.trackerId;
        this.incexpId = $stateParams.incexpId;

		this.modalCreate = function(size) {
		    var modalInstance = $modal.open({
		        templateUrl: 'modules/incexps/views/create-incexp.client.view.html',
		        controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
		            $scope.ok = function() {
		                // if (createCustomerForm.$valid){
		                $modalInstance.close();
		                // }
		            };
		            $scope.cancel = function() {
		                $modalInstance.dismiss('cancel');
		            };
		        }],
		        size: size
		    });
		    modalInstance.result.then(function(selectedItem) {

		    	}, function() {
		          $log.info('Modal dismissed at: ' + new Date());
		    });
		};
		this.modalUpdate = function(size, selectedIncexp) {
		    var modalInstance = $modal.open({
		        templateUrl: 'modules/incexps/views/edit-incexp.client.view.html',
		        controller: ["$scope", "$modalInstance", "incexp", function($scope, $modalInstance, incexp) {
		            $scope.incexp = incexp;
		            $scope.ok = function() {
		                // if (updateCustomerForm.$valid){
		                $modalInstance.close($scope.incexp);
		                // }
		            };
		            $scope.cancel = function() {
		                $modalInstance.dismiss('cancel');
		            };
		        }],
		        size: size,
		        resolve: {
		            incexp: function() {
		                return selectedIncexp;
		            }
		        }
		    });

		    modalInstance.result.then(function(selectedItem) {
		        $scope.selected = selectedItem;
		    }, function() {
		        $log.info('Modal dismissed at: ' + new Date());
		    });
		};
		// Remove existing Incexp
		this.remove = function(incexp) {
			console.log(incexp);
			if ( incexp ) {
				incexp.$remove({incexpId : incexp._id}, function(res){
                    console.log(res);
                    Notify.sendMsg('RefreshIncexps', $stateParams);
                });
			}
		};

	}
])


	.controller('IncexpsCreateController', ['$scope', '$stateParams', 'Incexps', 'TrackerIncexps', 'Notify', 'AppStatics', 'Authentication', 'AppMessenger', 'VaultStatics',
	    function($scope, $stateParams, Incexps, TrackerIncexps, Notify, AppStatics, Authentication, AppMessenger, VaultStatics) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
			this.vaultStatics = VaultStatics;
            this.getCurrencies = function(){
                return this.appStatics.getCurrencies();
            };
            this.queryVaults = function(){
            	return this.vaultStatics.queryVaults('1', '2');
            };
            this.create = function() {
                var incexp = new TrackerIncexps({
                    displayName: this.displayName,
                    description: this.description,
                    tracker: $stateParams.trackerId,
                    tags: this.tags,
                    amount: this.amount,
                    vault: this.vault,
                    isPending: this.isPending,
                    pendingType: this.pendingType,
                    pendingWith: this.pendingWith,
                    owner: this.authentication.user._id,
                    created: this.created
                });
                // Redirect after save
                incexp.$save(function(response) {
                    Notify.sendMsg('RefreshIncexps', {
                        'trackerId': response.tracker
                    });
                    AppMessenger.sendInfoMsg(response);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
	    }
	])
	.controller('IncexpsUpdateController', ['$scope', '$stateParams', 'Incexps', 'TrackerIncexps', 'AppStatics', 'Authentication', 'Notify',
	    function($scope, $stateParams, Incexps, TrackerIncexps, AppStatics, Authentication, Notify) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
			 this.update = function(updatedIncexp) {
			     var incexp = updatedIncexp;

			     delete incexp.tracker;

			     incexp.$update({
			    	 trackerId: $stateParams.trackerId,
                     incexpId: incexp._id
			     }, function() {
			       Notify.sendMsg('RefreshIncexps', {});
			     }, function(errorResponse) {
			         $scope.error = errorResponse.data.message;
			     });
			 };

	    }
	])

	.directive('incexpsList', ['Incexps', 'TrackerIncexps', 'Notify', function(Incexps, TrackerIncexps, Notify) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'modules/incexps/views/incexps-list-template.html',
	        link: function(scope, element, attrs) {
	            //when a new customer is added, update the customer list
	            Notify.getMsg('RefreshIncexps', function(event, data) {
                    scope.incexpCtrl.trackerIncexps = TrackerIncexps.listTrackerIncexps(data);
	            });
	        }
	    };
	}])

    .directive('selectUsers', ['Incexps', 'TrackerIncexps', 'AppStatics', 'Authentication', 'UserStatics', 
                               function(Incexps, TrackerIncexps, AppStatics, Authentication, UserStatics) {
        return {
            restrict: 'E',
            transclude: true,
//            templateUrl: 'modules/core/views/list-users-combo-template.html',
            templateUrl: UserStatics.getListUsersComboTmpl(),
            link: function(scope, element, attrs) {
            },
            scope: {
                currentUser: '=user'
            },
            controller: ["$scope", function($scope){
                $scope.authentication = Authentication;
                var curUsersArr = [];
                curUsersArr.push(Authentication.user.id);
                $scope.queryUsers = function(query){
                    return UserStatics.queryUsers(query, curUsersArr.join());
                };
            }]
        };
    }])

;

'use strict';

//Incexps service used to communicate Incexps REST endpoints
angular.module('incexps').factory('Incexps', ['$resource',
	function($resource) {
		return $resource('incexps/:incexpId', { incexpId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Vaults service used to communicate Vaults REST endpoints
angular.module('incexps').factory('TrackerIncexps', ['$resource',
	function($resource) {
		return $resource('trackerincexps', null, {
			update: {
				method: 'PUT',
                params: {incexpId : 'incexpId'}
			},
              listTrackerIncexps: {
                method: 'GET',
                  params: {trackerId : 'trackerId'},
                isArray: true
          }
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('trackers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Trackers', 'trackers');
//		Menus.addSubMenuItem('topbar', 'trackers', 'List Trackers', 'trackers');
//		Menus.addSubMenuItem('topbar', 'trackers', 'New Tracker', 'trackers/create');
	}
]);
'use strict';

//Setting up route
angular.module('trackers').config(['$stateProvider',
	function($stateProvider) {
		// Trackers state routing
		$stateProvider.
		state('listTrackers', {
			url: '/trackers',
			templateUrl: 'modules/trackers/views/list-trackers.client.view.html'
//		}).
//		state('createTracker', {
//			url: '/trackers/create',
//			templateUrl: 'modules/trackers/views/create-tracker.client.view.html'
//		}).
//		state('viewTracker', {
//			url: '/trackers/:trackerId',
//			templateUrl: 'modules/trackers/views/view-tracker.client.view.html'
//		}).
//		state('editTracker', {
//			url: '/trackers/:trackerId/edit',
//			templateUrl: 'modules/trackers/views/edit-tracker.client.view.html'
		});
	}
]);
'use strict';

// Trackers controller

angular.module('trackers')
	.controller('TrackersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trackers', '$modal', '$log', 'moment', 'AppStatics', '$state',  'UserStatics', //'angularMoment',
		function($scope, $stateParams, $location, Authentication, Trackers, $modal, $log, moment, AppStatics, $state, UserStatics) {
			this.authentication = Authentication;
			this.trackers = Trackers.query();
			// this.appStatics = AppStatics;
			// this.getCurrencies = function(){
			// 	return this.appStatics.getCurrencies()
			// };
			//open a modal window to create a single customer record
	        this.modalCreate = function(size) {
	            var modalInstance = $modal.open({
	                templateUrl: 'modules/trackers/views/create-tracker.client.view.html',
	                controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
	                    $scope.ok = function() {
	                        // if (createCustomerForm.$valid){
	                        $modalInstance.close();
	                        // }
	                    };
	                    $scope.cancel = function() {
	                        $modalInstance.dismiss('cancel');
	                    };
	                }],
	                size: size
	            });
	            modalInstance.result.then(function(selectedItem) {

	            	}, function() {
		                $log.info('Modal dismissed at: ' + new Date());
	            });
	        };
	        this.getLocalTime = function(time){
	        	return moment(time).toString();
	        };
					this.getOwnerTxt = function(tracker){
						return (tracker.owner && tracker.owner._id && (tracker.owner._id.toString() === Authentication.user._id.toString()))	? 'Me - This is my Awesome tracker' :
													((tracker.owner && tracker.owner.displayName) ? tracker.owner.displayName : 'No Name');
					};
					this.getUsersTxt = function(tracker){
						var users = '';
						//TODO - splice owner name from this
						if(tracker.users && tracker.users.length > 1){
							for(var i = 0; i < tracker.users.length; i++){
								if(i !== 0){
									users = users + ((i===tracker.users.length-2) ? ' , ' : ' and ') + tracker.users[i].displayName;
								} else {
									users = tracker.users[i].displayName;
								}
							}
						} else if(tracker.users){
							users = tracker.users[0].displayName;
						} else {
							// TODO - remove it later
							users = 'Something wrong';
						}
						return users;
					};
					this.loadVaults = function(trackerId){
						$state.go('listTrackerVaults', {trackerId: trackerId});
					};
					this.loadIncexps = function(trackerId){
						$state.go('listTrackerIncexps', {trackerId: trackerId});
					};
					
	        //pasted in from angular-ui bootstrap modal example
	        //open a modal window to update a single customer record
	        this.modalUpdate = function(size, selectedTracker) {

	            var modalInstance = $modal.open({
	                templateUrl: 'modules/trackers/views/edit-tracker.client.view.html',
	                controller: ["$scope", "$modalInstance", "tracker", function($scope, $modalInstance, tracker) {
	                    $scope.tracker = tracker;
	                    $scope.ok = function() {
	                        // if (updateCustomerForm.$valid){
	                        $modalInstance.close($scope.tracker);
	                        // }
	                    };
	                    $scope.cancel = function() {
	                        $modalInstance.dismiss('cancel');
	                    };
	                }],
	                size: size,
	                resolve: {
	                    tracker: function() {
	                        return selectedTracker;
	                    }
	                }
	            });

	            modalInstance.result.then(function(selectedItem) {
	                $scope.selected = selectedItem;
	            }, function() {
	                $log.info('Modal dismissed at: ' + new Date());
	            });
	        };


	        // Remove existing Customer
	        this.remove = function(tracker) {
	            if (tracker) {
	            	tracker.$remove();

	                for (var i in this.trackers) {
	                    if (this.trackers[i] === tracker) {
	                        this.trackers.splice(i, 1);
	                    }
	                }
	            } else {
	                this.tracker.$remove(function() {});
	            }
	        };

		}
	])


	.controller('TrackersCreateController', ['$scope', 'Trackers', 'Notify', 'AppStatics', 'Authentication', 'AppMessenger', 'UserStatics',
	    function($scope, Trackers, Notify, AppStatics, Authentication, AppMessenger, UserStatics) {
	    	this.appStatics = AppStatics;
	    	this.userStatics = UserStatics;
	    	this.authentication = Authentication;
	    	this.assignedUsers = [];
	    	this.assignedUsers.push(Authentication.user);
	    	this.getCurrencies = function(){
					return this.appStatics.getCurrencies();
				};
        this.create = function() {
            var tracker = new Trackers({
                displayName: this.displayName,
                description: this.description,
                currency: this.currency,
                owner: this.owner,
                // users: this.users,
                created: this.created
            });
            tracker.users = [];
            angular.forEach(this.assignedUsers, function(value, key) {
						  tracker.users.push(value._id);
						});
            // Redirect after save
            tracker.$save(function(response) {
                Notify.sendMsg('RefreshTrackers', {
                    'id': response._id
                });
                AppMessenger.sendInfoMsg(response);
                // Notify.sendMsg('TrackerSaved', {
                // });
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
	    }
	])
	.controller('TrackersUpdateController', ['$scope', 'Trackers', 'AppStatics', 'Authentication', 'Notify', 'UserStatics',
	    function($scope, Trackers, AppStatics, Authentication, Notify, UserStatics) {
	    	this.appStatics = AppStatics;
	    	this.userStatics = UserStatics;
	    	this.authentication = Authentication;
	    	this.getCurrencies = function(){
					return this.appStatics.getCurrencies();
				};
        this.update = function(updatedTracker) {
            var tracker = updatedTracker;
            var users = [];
            var owner = tracker.owner._id;
            angular.forEach(tracker.users, function(value, key) {
						  users.push(value._id);
						});
						tracker.owner = owner;
						tracker.users = users;
            tracker.$update(function() {
              Notify.sendMsg('RefreshTrackers', {});
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

	    }
	])

	.directive('trackersList', ['Trackers', 'Notify', function(Trackers, Notify) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'modules/trackers/views/trackers-list-template.html',
	        link: function(scope, element, attrs) {
	            //when a new customer is added, update the customer list
	            Notify.getMsg('RefreshTrackers', function(event, data) {
	                scope.trackersCtrl.trackers = Trackers.query();
	            });
	        }
	    };
	}])

	.directive('addUsers', ['Trackers', 'AppStatics', 'Authentication', 'UserStatics', function(Trackers, AppStatics, Authentication, UserStatics) {
	    return {
	        restrict: 'E',
	        transclude: true,
//	        templateUrl: 'modules/core/views/add-users-template.html',
	        templateUrl: UserStatics.getAddUsersTmpl(),
	        link: function(scope, element, attrs) {
	        },
	        scope: {
	        	assignedUsers: '=users'
	        },
	        controller: ["$scope", function($scope){
	        	$scope.authentication = Authentication;
						$scope.queryUsers = function(query){
							var curUsersArr = [];
							  angular.forEach($scope.assignedUsers, function(value, key) {
								  curUsersArr.push(value._id);
								});
							return UserStatics.queryUsers(query, curUsersArr.join());
						};
						$scope.assignNewUser = function(user){
							$scope.currentUser = null;
							$scope.assignedUsers.push(user);
			    	};
			    	$scope.removeUser = function(index){
			    		$scope.assignedUsers.splice(index, 1);
			    	};
	        }]
	    };
	}])

	;

'use strict';

//Trackers service used to communicate Trackers REST endpoints
angular.module('trackers')

	.factory('Trackers', ['$resource',
		function($resource) {
			return $resource('trackers/:trackerId', { trackerId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
 		}]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('core').service('UserStatics', [ '$http',
	function($http) {
		var userStatics = {};
		userStatics.getAddUsersTmpl = function(){
			return 'modules/users/views/add-users-template.html';
		};
		userStatics.getListUsersComboTmpl = function(){
			return 'modules/users/views/list-users-combo-template.html';
		};
		userStatics.queryUsers = function(query, users){
			return $http.get('/users/search', {
			      params: {
			        q: query,
			        nu: users
			      }
			    }).then(function(response){
			    	console.log(response);
			      return response.data.map(function(item){
			        return item;
			      });
			    });
		};
		return userStatics;
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('vaults').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Vaults', 'vaults', 'dropdown', '/vaults(/create)?');
		// Menus.addSubMenuItem('topbar', 'vaults', 'List Vaults', 'vaults');
		// Menus.addSubMenuItem('topbar', 'vaults', 'New Vault', 'vaults/create');
	}
]);

'use strict';

//Setting up route
angular.module('vaults').config(['$stateProvider',
	function($stateProvider) {
		// '$stateProvider', '$urlRouterProvider'
		// Vaults state routing
		$stateProvider.
		state('listTrackerVaults', {
			url: '/trackervaults/:trackerId',
			templateUrl: 'modules/vaults/views/list-vaults.client.view.html'
		// }).
		// state('listVaults', {
		// 	url: '/vaults',
		// 	templateUrl: 'modules/vaults/views/list-vaults.client.view.html'
		// }).
		// state('createVault', {
		// 	url: '/vaults/create',
		// 	templateUrl: 'modules/vaults/views/create-vault.client.view.html'
		// }).
		// state('viewVault', {
		// 	url: '/vaults/:vaultId',
		// 	templateUrl: 'modules/vaults/views/view-vault.client.view.html'
		// }).
		// state('editVault', {
		// 	url: '/vaults/:vaultId/edit',
		// 	templateUrl: 'modules/vaults/views/edit-vault.client.view.html'
		});
	}
]);

'use strict';

// Vaults controller
angular.module('vaults').controller('VaultsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vaults', 'TrackerVaults', '$modal', '$log', 'moment', 'AppStatics', 'Notify',
	function($scope, $stateParams, $location, Authentication, Vaults, TrackerVaults, $modal, $log, moment, AppStatics, Notify) {
        this.authentication = Authentication;
		this.trackerVaults = TrackerVaults.listTrackerVaults($stateParams);
        this.trackerId = $stateParams.trackerId;
        this.vaultId = $stateParams.vaultId;
		this.modalCreate = function(size) {
		    var modalInstance = $modal.open({
		        templateUrl: 'modules/vaults/views/create-vault.client.view.html',
		        controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
		            $scope.ok = function() {
		                // if (createCustomerForm.$valid){
		                $modalInstance.close();
		                // }
		            };
		            $scope.cancel = function() {
		                $modalInstance.dismiss('cancel');
		            };
		        }],
		        size: size
		    });
		    modalInstance.result.then(function(selectedItem) {

		    	}, function() {
		          $log.info('Modal dismissed at: ' + new Date());
		    });
		};
		this.modalUpdate = function(size, selectedVault) {
		    var modalInstance = $modal.open({
		        templateUrl: 'modules/vaults/views/edit-vault.client.view.html',
		        controller: ["$scope", "$modalInstance", "vault", function($scope, $modalInstance, vault) {
		            $scope.vault = vault;
		            $scope.ok = function() {
		                // if (updateCustomerForm.$valid){
		                $modalInstance.close($scope.vault);
		                // }
		            };
		            $scope.cancel = function() {
		                $modalInstance.dismiss('cancel');
		            };
		        }],
		        size: size,
		        resolve: {
		            vault: function() {
		                return selectedVault;
		            }
		        }
		    });

		    modalInstance.result.then(function(selectedItem) {
		        $scope.selected = selectedItem;
		    }, function() {
		        $log.info('Modal dismissed at: ' + new Date());
		    });
		};
		// Remove existing Vault
		this.remove = function(vault) {
			console.log(vault);
			if ( vault ) {
				vault.$remove({vaultId : vault._id}, function(res){
                    console.log(res);
                    Notify.sendMsg('RefreshVaults', $stateParams);
                });
			}
		};

	}
])


	.controller('VaultsCreateController', ['$scope', '$stateParams', 'Vaults', 'TrackerVaults', 'Notify', 'AppStatics', 'Authentication', 'AppMessenger',
	    function($scope, $stateParams, Vaults, TrackerVaults, Notify, AppStatics, Authentication, AppMessenger) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
            this.create = function() {
                var vault = new TrackerVaults({
                    displayName: this.displayName,
                    description: this.description,
                    tracker: $stateParams.trackerId,
                    owner: this.authentication.user._id,
                    created: this.created
                });
                // Redirect after save
                vault.$save(function(response) {
                    Notify.sendMsg('RefreshVaults', {
                        'trackerId': response.tracker
                    });
                    AppMessenger.sendInfoMsg(response);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
	    }
	])
	.controller('VaultsUpdateController', ['$scope', '$stateParams', 'Vaults', 'TrackerVaults', 'AppStatics', 'Authentication', 'Notify',
	    function($scope, $stateParams, Vaults, TrackerVaults, AppStatics, Authentication, Notify) {
	    	this.appStatics = AppStatics;
	    	this.authentication = Authentication;
			 this.update = function(updatedVault) {
			     var vault = updatedVault;

			     delete vault.tracker;

			     vault.$update({
			    	 trackerId: $stateParams.trackerId,
                     vaultId: vault._id
			     }, function() {
			       Notify.sendMsg('RefreshVaults', {});
			     }, function(errorResponse) {
			         $scope.error = errorResponse.data.message;
			     });
			 };

	    }
	])

	.directive('vaultsList', ['Vaults', 'TrackerVaults', 'Notify', function(Vaults, TrackerVaults, Notify) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: 'modules/vaults/views/vaults-list-template.html',
	        link: function(scope, element, attrs) {
	            //when a new customer is added, update the customer list
	            Notify.getMsg('RefreshVaults', function(event, data) {
                    scope.vaultCtrl.trackerVaults = TrackerVaults.listTrackerVaults(data);
	            });
	        }
	    };
	}])

;

'use strict';

angular.module('vaults').service('VaultStatics', [ '$http',
	function($http) {
		var vaultStatics = {};
		vaultStatics.queryVaults = function(trackerId, excludeVaults){
			return $http.get('/vaults/queryByTracker', {
			      params: {
			    	tId: trackerId,
			        exv: excludeVaults
			      }
			    }).then(function(response){
			      return response.data.map(function(item){
			        return item;
			      });
			    });
		};
		return vaultStatics;
	}
]);

'use strict';

//Vaults service used to communicate Vaults REST endpoints
angular.module('vaults').factory('TrackerVaults', ['$resource',
	function($resource) {
		return $resource('trackervaults', null, {
			update: {
				method: 'PUT',
                params: {vaultId : 'vaultId'}
			},
              listTrackerVaults: {
                method: 'GET',
                  params: {trackerId : 'trackerId'},
                isArray: true
          }
		});
	}
]);

'use strict';

//Vaults service used to communicate Vaults REST endpoints
angular.module('vaults').factory('Vaults', ['$resource',
	function($resource) {
		return $resource('vaults/:vaultId', { vaultId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);