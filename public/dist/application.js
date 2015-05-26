'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'meanmoneymanager';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',
	                                           'ui.router', 'ui.bootstrap', 'ui.utils', 'angularMoment', 'ngTagsInput', 'highcharts-ng']
                                                //'mgcrea.ngStrap.alert', 'mgcrea.ngStrap.modal', 'mgcrea.ngStrap.helpers.dimensions'];

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
ApplicationConfiguration.registerModule('trackers', ['angular-loading-bar', 'ngAnimate']);

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
		$scope.hasLogin = function(){
			return (typeof Authentication.user.displayName !== 'undefined');
		};
		
		$scope.slides = [];
		
		$scope.slides.push({
			heading: 'AAAAAAAAAAAAAAAAAAAA'
		});
		$scope.slides.push({
			heading: 'BBBBBBBBBBBBBBBBBBBBB'
		});
		$scope.slides.push({
			heading: 'CCCCCCCCCCCCCCCCCCCCC'
		});
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


angular.module('core').controller('InfoController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

    }
]);

'use strict';

angular.module('core').controller('StatusBarController', ['$scope', 'Authentication', 'AppMessenger', '$timeout',
	function($scope, Authentication, AppMessenger, $timeout) {
        var autoClose = function(){
            $timeout(function(){
                $scope.alert = null;
            }, 2000);
        };
        $scope.closeAlert = function(){
            $scope.alert = null;
        };
        AppMessenger.getInfoMsg(function(e, data){
            $scope.alert = {
                type: 'info',
                msg : data
            };
            autoClose();
        });
        AppMessenger.getWarnMsg(function(e, data){
            $scope.alert = {
                type: 'warning',
                msg : data
            };
            autoClose();
        });
        AppMessenger.getErrMsg(function(e, data){
            $scope.alert = {
                type: 'danger',
                msg : data
            };
            autoClose();
        });
	}
]);

'use strict';

angular.module('core')
    .filter('pad', [function() {
        return function(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        };
    }])
    .filter('navmonths', ['$filter', function($filter) {
        return function(month, year, n) {
        	n = n || 1;
        	month = parseInt(month);
        	year = parseInt(year);
        	if((month + n) < 1){
        		year = (year - 1) + '';
        		month = $filter('pad')((12 + month + n), 2);
        	} else if ((month + n) > 12){
        		year = (year + 1) + '';
        		month = $filter('pad')((month + n - 12 + 1), 2);
        	} else {
    			year = year + '';
    			month = $filter('pad')((parseInt(month) + n), 2);
        	}
        	return {
    			year: year,
    			month: month
    		};
        };
    }]);

'use strict';

angular.module('incexps').service('CoreLocaleMessages', [ '$http',
	function($http) {
		var incexpLocaleMessageService = {};
		
		incexpLocaleMessageService.pullMessages = function(){
			return $http.get('modules/incexps/json/labels.json', {cached: true});
		};
		incexpLocaleMessageService.get = function(key){
			if(! this.msgs){
				this.pullMessages().then(function(response){
					this.msgs = response;
				});
			} else {
				return this.msgs[key];
			}
		};
		return incexpLocaleMessageService;
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

angular.module('core').service('AppStatics', [ '$http', '$q', 
	function($http, $q) {
		var appStatics = {};
		appStatics.getCurrencies = function(){
//            this.loadCurrencies();
            return this.currencies;
		};
		appStatics.loadCurrencies = function(){
			var deferred = $q.defer();
            $http.get('modules/core/json/currencies.json').then(function(response){
            	appStatics.currencies = response.data;
            	deferred.resolve(response.data);
            });
            return deferred.promise;
        };
		
//        appStatics.loadCurrencies = function(){
//            if(! this.currencies){
//                this.currencies = [{id: 'INR', label: 'Indian Rupee', faIconCls: 'fa-inr'},
//                    {id: 'USD', label: 'US Dollor', faIconCls: 'fa-usd'},
//                    {id: 'JPY', label: 'Japanese YEN', faIconCls: 'fa-jpy'},
//                    {id: 'EUR', label: 'Euro', faIconCls: 'fa-eur'}];
//            }
//        };
        appStatics.getCurrencyObj = function(currencyId){
            console.log(currencyId);
            for(var i in this.currencies){
                var currency = this.currencies[i];
                if(currency.id === currencyId)  return currency;
            }
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
        $rootScope.$emit('INFO', data);
    };
    appMessenger.sendWarnMsg = function(data) {
        data = data || {};
        $rootScope.$emit('WARN', data);
    };
    appMessenger.sendErrMsg = function(data) {
        data = data || {};
        $rootScope.$emit('ERR', data);
    };

      appMessenger.getInfoMsg = function(func, scope) {
          var unbind = $rootScope.$on('INFO', func);
          if (scope) {
              scope.$on('destroy', unbind);
          }
      };

      appMessenger.getWarnMsg = function(func, scope) {
          var unbind = $rootScope.$on('WARN', func);
          if (scope) {
              scope.$on('destroy', unbind);
          }
      };

      appMessenger.getErrMsg = function(func, scope) {
          var unbind = $rootScope.$on('ERR', func);
          if (scope) {
              scope.$on('destroy', unbind);
          }
      };

    //// TODO - assigned vars might required in case of unbinding later
    //var infoMsg = $rootScope.$on('INFO', function(e, data){
    //  console.log('Info Message Received');
    //  console.dir(data);alert(data);
    //});
    //var warnMsg = $rootScope.$on('WARN', function(e, data){
    //  console.log('Warn Message Received');
    //  console.dir(data);alert(data);
    //});
    //var errMsg = $rootScope.$on('ERR', function(e, data){
    //  console.log('Err Message Received');
    //  console.dir(data);alert(data);
    //});

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

angular.module('incexps').constant('INCEXP_CONST', {
	'INCEXP_LIST_TEMPLATE_URL': 'modules/incexps/templates/incexps-list-template.client.html',
	
	'LIST_INCEXPS_STATE_NAME': 'listTrackerIncexps',
	'LIST_INCEXPS_STATE_URL': '/trackerincexps/:trackerId',
	'LIST_INCEXPS_STATE_TEMPLATE_URL': 'modules/incexps/views/list-incexps.client.view.html',
	'LIST_INCEXPS_BY_MONTH_STATE_NAME': 'listTrackerIncexpsByMonth',
	'LIST_INCEXPS_BY_MONTH_STATE_URL': '/trackerincexps/:trackerId/showMonth/:month/:year',
	'LIST_INCEXPS_BY_MONTH_STATE_TEMPLATE_URL': 'modules/incexps/views/list-incexps.client.view.html',

	'CREATE_INCEXP_STATE_NAME': 'createIncexp',
	'CREATE_INCEXP_STATE_URL': '/trackerincexps/:trackerId/create',
	'CREATE_INCEXP_STATE_TEMPLATE_URL': 'modules/incexps/views/create-incexp.client.view.html',
	
	'EDIT_INCEXP_STATE_NAME': 'editIncexp',
	'EDIT_INCEXP_STATE_URL': '/trackerincexps/:trackerId/:incexpId/edit',
	'EDIT_INCEXP_STATE_TEMPLATE_URL': 'modules/incexps/views/edit-incexp.client.view.html',
	
	'DASH_INCEXPS_BY_MONTH_STATE_NAME': 'DashBoardTrackerIncexpsByMonth',
	'DASH_INCEXPS_BY_MONTH_STATE_URL': '/trackerincexpsDashboard/:trackerId/showMonth/:month/:year',
	'DASH_INCEXPS_BY_MONTH_STATE_TEMPLATE_URL': 'modules/incexps/views/charts-incexp.client.view.html',
		
});

'use strict';

// Configuring the Articles module
angular.module('incexps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
//		Menus.addMenuItem('topbar', 'Incexps', 'incexps', 'dropdown', '/incexps(/create)?');
//		Menus.addSubMenuItem('topbar', 'incexps', 'List Incexps', 'incexps');
//		Menus.addSubMenuItem('topbar', 'incexps', 'New Incexp', 'incexps/create');


        // do not let angular convert date to UTC
        //$httpProvider.defaults.headers.common
        //http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w'
        //$httpProvider.defaults.transformRequest
	}
]);

'use strict';

//Setting up route
angular.module('incexps').config(['$stateProvider', 'INCEXP_CONST',
	function($stateProvider, INCEXP_CONST) {
		// Incexps state routing
		$stateProvider.
		state(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, {
			url: INCEXP_CONST.LIST_INCEXPS_STATE_URL,
			templateUrl: INCEXP_CONST.LIST_INCEXPS_STATE_TEMPLATE_URL
		}).
		state(INCEXP_CONST.LIST_INCEXPS_BY_MONTH_STATE_NAME, {
			url: INCEXP_CONST.LIST_INCEXPS_BY_MONTH_STATE_URL,
			templateUrl: INCEXP_CONST.LIST_INCEXPS_BY_MONTH_STATE_TEMPLATE_URL
		}).
		state(INCEXP_CONST.DASH_INCEXPS_BY_MONTH_STATE_NAME, {
			url: INCEXP_CONST.DASH_INCEXPS_BY_MONTH_STATE_URL,
			templateUrl: INCEXP_CONST.DASH_INCEXPS_BY_MONTH_STATE_TEMPLATE_URL
		}).
		state(INCEXP_CONST.CREATE_INCEXP_STATE_NAME, {
			url: INCEXP_CONST.CREATE_INCEXP_STATE_URL,
			templateUrl: INCEXP_CONST.CREATE_INCEXP_STATE_TEMPLATE_URL
		}).
		state(INCEXP_CONST.EDIT_INCEXP_STATE_NAME, {
			url: INCEXP_CONST.EDIT_INCEXP_STATE_URL,
			templateUrl: INCEXP_CONST.EDIT_INCEXP_STATE_TEMPLATE_URL
		});
	}
]);

'use strict';

// Incexps controller
angular.module('incexps').controller('IncexpsController', ['$scope', '$stateParams', '$location', 'Authentication', '$filter', '$timeout', 
        'TrackerIncexps', '$modal', '$log', 'moment', 'AppStatics', 'Notify', 'VaultStatics', '$state', 'IncexpStatics', 'AppMessenger', 'IncexpLocaleMessages', '$q', 'INCEXP_CONST', 'ChartService', 
	function($scope, $stateParams, $location, Authentication, $filter, $timeout, 
             TrackerIncexps, $modal, $log, moment, AppStatics, Notify, VaultStatics, $state, IncexpStatics, AppMessenger, IncexpLocaleMessages, $q, INCEXP_CONST, ChartService) {
		var _this = this;
        $scope.parseInt = parseInt;
        _this.authentication = Authentication;
		_this.vaultStatics = VaultStatics;
        _this.appStatics = AppStatics;
        _this.incexpStatics = IncexpStatics;
        $scope.$stateParams = $stateParams;
        var minDate = new Date(); 
        minDate.setDate(minDate.getDate() - 60);
        $scope.minDate = minDate; 
        $scope.maxDate = new Date();
        //	TODO - bootstrapping the module only if the dependencies are loaded 
        //	Not sure whether this is correct way - but it works.

        var pullMsgs = function(){
        	//	dummy comment
			var deferred = $q.defer();
			IncexpLocaleMessages.pullMessages().then(function(labels){
    			_this.labelsObj = labels;
    			deferred.resolve(null);
            });
            return deferred.promise;
        };
        var pullVaults = function(){
        	var deferred = $q.defer();
            _this.vaultStatics.queryVaults($stateParams.trackerId).then(function(response){
                _this.vaultsResult = [];
                response.data.map(function(item){
                    _this.vaultsResult.push(item);
                });
                deferred.resolve(null);
            });
            return deferred.promise;
        };
        var pullIncexpTypes = function(){
        	var deferred = $q.defer();
        	var cachedVal = _this.incexpStatics.getIncexpTypes();
        	//	If value is already cached by service - then use it otherwise 
        	if(cachedVal){
        		_this.incexpTypes = cachedVal;
        		deferred.resolve(null);
        	} else {
        		_this.incexpStatics.loadIncexpTypes().then(function(response){
                    _this.incexpTypes = [];
                    response.map(function(item){
                        _this.incexpTypes.push(item);
                    });
                    deferred.resolve(null);
                });	
        	}
        	
            return deferred.promise;
        };
        var pullTags = function(){
            var deferred = $q.defer();
            var cachedVal = _this.incexpStatics.getIncexpTags();
            //	If value is already cached by service - then use it otherwise
            if(cachedVal){
                _this.incexpTags = cachedVal;
                deferred.resolve(null);
            } else {
                _this.incexpStatics.loadIncexpTags().then(function(response){
                    _this.incexpTags = [];
                    response.map(function(item){
                        _this.incexpTags.push(item);
                    });
                    deferred.resolve(null);
                });
            }

            return deferred.promise;
        };


        var pullApprovalTypes = function(){
            var displayMode = 'CREATE';
            var deferred = $q.defer();
            var cachedVal = _this.incexpStatics.getApprovalTypes();
            //	If value is already cached by service - then use it otherwise
            if(cachedVal){
                _this.approvalTypes = [];
                cachedVal.map(function(item){
                    if(displayMode){
                        if(item && item.displayMode &&
                            (item.displayMode.indexOf(displayMode) > -1 || item.displayMode.indexOf('ALL') > -1)){
                            _this.approvalTypes.push(item);
                        }
                    } else {
                        _this.approvalTypes.push(item);
                    }
                });
                deferred.resolve(null);
            } else {
                _this.incexpStatics.loadApprovalTypes().then(function(response){
                    _this.approvalTypes = [];
                    response.map(function(item){
                        if(displayMode){
                            if(item && item.displayMode &&
                                (item.displayMode.indexOf(displayMode) > -1 || item.displayMode.indexOf('ALL') > -1)){
                                _this.approvalTypes.push(item);
                            }
                        } else {
                            _this.approvalTypes.push(item);
                        }
                    });
                    deferred.resolve(null);
                });
            }

            return deferred.promise;
        };

        var loadCurrencies = function(){
        	return AppStatics.loadCurrencies();
        };
        
        var pullIncexps = function () {
        	_this.trackerIncexps = TrackerIncexps.listTrackerIncexps($stateParams);
        	return _this.trackerIncexps.$promise; 
        };
        var pullIncexpsByMonth = function () {
            _this.trackerIncexps = TrackerIncexps.listTrackerIncexpsByMonth($stateParams);
            return _this.trackerIncexps.$promise;
        };


        var pullIncexp = function () {
            var deferred = $q.defer();
            TrackerIncexps.get($stateParams).$promise.then(function(response){
                $scope.incexp = response;
                if($scope.incexp.isPending){
                    _this.approvalModel = {
                        'isPending': $scope.incexp.isPending,
                        'pendingType': $scope.incexp.pendingType,
                        'pendingWith' : $scope.incexp.pendingWith,
                        'pendingMsg': $scope.incexp.pendingMsg
                    };
                } else {
                    _this.approvalModel = {'isPending': false};
                }

                deferred.resolve(null);
            });
            return deferred.promise;
        };
        var loadIncexpAlerts = function(response){
        	var deferred = $q.defer();
            response.$promise.then(function(incexps){
                for(var i=0; i<incexps.length; i++){
                    var incexp = incexps[i];
                    incexp.infoAlerts = [];
                    if(!incexp.isPending){
                        incexp.infoAlerts.push({
                            'clazz': 'fa-check-circle info-icon lpad',
                            'tooltip': _this.labelsObj['app.incexps.tt.allOk']
                        });
                    } else {
                        if(incexp.pendingWith._id === Authentication.user._id){
                            incexp.infoAlerts.push({
                                'clazz': 'fa-exclamation-circle danger-icon lpad',
                                'tooltip': _this.labelsObj['app.incexps.tt.requireActionFrmMe']
                            });
                        }else {
                            incexp.infoAlerts.push({
                                'clazz': 'fa-exclamation-circle warn-icon lpad',
                                'tooltip': _this.labelsObj['app.incexps.tt.requireActionFrm'] + incexp.pendingWith.displayName
                            });
                        }
                    }
                    if(incexp.owner._id === Authentication.user._id){
                        incexp.infoAlerts.push({
                            'clazz': 'fa-user info-icon',
                            'tooltip': _this.labelsObj['app.incexps.tt.createdByMe']
                        });
                    } else {
                        incexp.infoAlerts.push({
                            'clazz': 'fa-user-secret info-icon',
                            'tooltip': _this.labelsObj['app.incexps.tt.createdByOther']
                        });
                    }
                    incexp.collapsed = true;
                    incexp.currencyObj = AppStatics.getCurrencyObj(incexp.tracker.currency);
                }
                deferred.resolve(null);
            });
            return deferred.promise; 
        };

        var bootmodule = function(){
              //populate 'approvalModel' for the directive
            if($scope.incexp){  //  Editing an item
            	console.log('Sample Log');
            } else {    //  For New Income Expense Creation
                _this.approvalModel = {'isPending': false, 'pendingType': null,'pendingMsg': null};
            }
            _this.getLabel = function(key){
            	return _this.labelsObj[key];
            }; 
            _this.getCurrencies = function(){
                return _this.appStatics.getCurrencies();
            };
            _this.getApprovalTypes = function(){
                //_this.pendingType = _this.incexpStatics.getApprovalTypesForCreation()[0];
                return _this.incexpStatics.getApprovalTypesForCreation();
            };
            _this.onChangeReqApproval = function(val){
                if(! val){
                    _this.pendingType = null;
                    _this.pendingWith = null;
                }
            };
            _this.openDatePicker = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.datePickerOpened = true;
            };
            _this.expandRow = function(incexpArg){
                if(!incexpArg.collapsed){
                    incexpArg.collapsed = true;
                    return;
                }
                for(var i=0; i<_this.trackerIncexps.length; i++){
                    var incexp = _this.trackerIncexps[i];
                    if(incexp._id === incexpArg._id){
                        incexp.collapsed = false;
                    } else {
                        incexp.collapsed = true;
                    }
                }
            };
            _this.canEdit = function(incexp){
            	return incexp && incexp.owner && ((incexp.owner._id === Authentication.user._id) || 
    						(incexp.pendingWith && incexp.pendingType === 'UPD_REQ' && incexp.pendingWith._id === Authentication.user._id)) &&
                    (! (incexp.isPending && incexp.pendingType === 'UPD_ACC_REQ'));
            };
            _this.canDelete = function(incexp){
            	return incexp && incexp.owner && incexp.owner._id === Authentication.user._id &&
                    (! (incexp.isPending && incexp.pendingType === 'UPD_ACC_REQ'));
            };
            _this.canRequestEditAccess = function(incexp){
            	return incexp && incexp.owner && (incexp.owner._id !== Authentication.user._id) && (! incexp.pendingWith) ;
            };
            _this.canApproveEditRequest = function(incexp){
                return incexp && incexp.isPending && (incexp.pendingWith._id === Authentication.user._id) &&
                    (incexp.owner._id === Authentication.user._id) && (incexp.pendingType === 'UPD_ACC_REQ');
            };
            _this.createIncexp = function(){
                _this.incexp = {};
                $state.go(INCEXP_CONST.CREATE_INCEXP_STATE_NAME, $stateParams);
            };
            _this.editIncexp = function(updatedIncexp){
                $state.go(INCEXP_CONST.EDIT_INCEXP_STATE_NAME, {
                    trackerId: $stateParams.trackerId,
                    incexpId: updatedIncexp._id
                });
            };
            _this.showNextMonth = function(){
            	if((parseInt($stateParams.month) === parseInt($scope.now.getMonth()+1)) && (parseInt($stateParams.year) === parseInt($scope.now.getFullYear()))){
            		AppMessenger.sendInfoMsg('Cannot move to Future');
            		return;
            	}
            	var nav = $filter('navmonths')($stateParams.month, $stateParams.year, 1);
            	nav.trackerId = $stateParams.trackerId;
                $state.go($state.current.name, nav, {reload: true});
            };
            _this.showPrevMonth = function(){
            	if((parseInt($stateParams.month) === parseInt($scope.now.getMonth()+1)) && (parseInt($stateParams.year) === parseInt($scope.now.getFullYear()-1))){
            		AppMessenger.sendInfoMsg('Cannot move beyond 1 Yr');
            		return;
            	}
                var nav = $filter('navmonths')($stateParams.month, $stateParams.year, -1);
                nav.trackerId = $stateParams.trackerId;
                $state.go($state.current.name, nav, {reload: true});
            };
            _this.saveIncexp = function() {
                //amDateFormat
                //evDate : $filter('amDateFormat')(_this.evDate,'dd-MMMM-yyyy'),
                //$filter('amDateFormat')(item.evDate,'YYYYMMDD')
                var incexp = new TrackerIncexps({
                    displayName: _this.displayName,
                    description: _this.description,
                    type: _this.type,
                    tracker: $stateParams.trackerId,
                    tags: _this.tags,
                    //evDate : $filter('date')(_this.evDate,'dd-MMMM-yyyy', '+0530'),
                    evDate : _this.evDate,
                    amount: _this.amount,
                    vault: _this.vault,
                    owner: _this.authentication.user._id,
                    created: _this.created
                });
                if(_this.approvalModel && _this.approvalModel.isPending){
                    incexp.isPending = _this.approvalModel.isPending;
                    incexp.pendingType = _this.approvalModel.pendingType;
                    incexp.pendingWith = _this.approvalModel.pendingWith._id;
                    incexp.pendingMsg = _this.approvalModel.pendingMsg;
                }
                // Redirect after save
                incexp.$save($stateParams, function(response) {
                    var current = moment(_this.evDate);
                    var month = current.format('MM');
                    var year = current.format('YYYY');
                    $state.go(INCEXP_CONST.LIST_INCEXPS_BY_MONTH_STATE_NAME, {
                        trackerId: $stateParams.trackerId,
                        month : month,
                        year: year
                    });
                    //$state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams);
                    AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.createdIncexp']);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            _this.cancel = function(){
                $state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams);
            };
            _this.updateIncexp = function(updatedIncexp){
                var incexp = updatedIncexp;
                if(_this.approvalModel && _this.approvalModel.isPending){
                    incexp.isPending = _this.approvalModel.isPending;
                    incexp.pendingType = _this.approvalModel.pendingType;
                    incexp.pendingWith = _this.approvalModel.pendingWith._id;
                    incexp.pendingMsg = _this.approvalModel.pendingMsg;
                } else {
                	incexp.isPending = false;
                    incexp.pendingType = null;
                    incexp.pendingWith = null;
                    incexp.pendingMsg = null;
                }
                delete incexp.tracker;
                incexp.$update($stateParams, function() {
                    var current = moment(incexp.evDate);
                    var month = current.format('MM');
                    var year = current.format('YYYY');
                    $state.go(INCEXP_CONST.LIST_INCEXPS_BY_MONTH_STATE_NAME, {
                        trackerId: $stateParams.trackerId,
                        month : month,
                        year: year
                    });
                  //$state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams);
                  AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.updatedIncexp']);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            _this.approveIncexpChanges = function(updatedIncexp){
                var incexp = updatedIncexp;
                delete incexp.isPending;
                delete incexp.pendingType;
                delete incexp.pendingWith;
                delete incexp.pendingMsg;
                delete incexp.tracker;
                incexp.$approveIncexpChanges($stateParams, function() {
                    $state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams);
                    AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.approveIncexpChanges']);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            _this.requestForEdit = function(incexp){
                incexp.$requestEditAccess({
                    incexpId : incexp._id
                }, function(response){
                    $state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams, {reload: true});
                    AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.reqEditAccess']);
                });
            };
            _this.approveEditAccessRequest = function(incexp){
                incexp.$approveEditAccessRequest({
                    incexpId : incexp._id
                }, function(response){
                    $state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams, {reload: true});
                    AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.approveIncexpEditAccReq']);
                });
            };
            _this.rejectEditAccessRequest = function(incexp){
                incexp.$rejectEditAccessRequest({
                    incexpId : incexp._id
                }, function(response){
                    $state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams, {reload: true});
                    AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.rejectIncexpEditAccReq']);
                });
            };
    		_this.remove = function(incexp) {
    			if ( incexp ) {
    				incexp.$remove({
    						incexpId : incexp._id,
    						trackerId: $stateParams.trackerId
    					}, function(res){
    					$state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, $stateParams, {reload: true});
    		            AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.deletedIncexp']);
                    });
    			}
    		};
        };
        var loadCharts = function(){
        	return $timeout(function(){
        		$scope.incomeHeatMapChartConfig = ChartService.getIncomeHeatMapConfig(_this.labelsObj, _this.trackerIncexps);
                $scope.expenseHeatMapChartConfig = ChartService.getExpenseHeatMapConfig(_this.labelsObj, _this.trackerIncexps);
        	}, 1);
        };
        if($state.current.name === INCEXP_CONST.LIST_INCEXPS_STATE_NAME){
            pullMsgs().then(loadCurrencies).then(pullIncexps).then(loadIncexpAlerts).then(bootmodule);
        } else if($state.current.name === INCEXP_CONST.LIST_INCEXPS_BY_MONTH_STATE_NAME){
            pullMsgs().then(loadCurrencies).then(pullIncexpsByMonth).then(loadIncexpAlerts).then(bootmodule);
            $scope.monthlyView = true;
            $scope.now = new Date();
        } else if($state.current.name === INCEXP_CONST.CREATE_INCEXP_STATE_NAME){
        	pullMsgs().then(pullVaults).then(pullIncexpTypes).then(pullTags).then(pullApprovalTypes).then(bootmodule);
            //TODO - load up this with boot module
            _this.approvalModel = {'isPending': false, 'pendingType': null,'pendingMsg': null};
        } else if($state.current.name === INCEXP_CONST.EDIT_INCEXP_STATE_NAME){
            pullMsgs().then(pullVaults).then(pullIncexpTypes).then(pullTags).then(pullApprovalTypes).then(pullIncexp).then(bootmodule);
        } else if($state.current.name === INCEXP_CONST.DASH_INCEXPS_BY_MONTH_STATE_NAME){
            pullMsgs().then(pullIncexpsByMonth).then(loadCharts).then(bootmodule);
            $scope.monthlyView = true;
            $scope.now = new Date();
        }
	}
])

;

'use strict';

angular.module('incexps')

	.directive('incexpsList', ['INCEXP_CONST', function(INCEXP_CONST) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: INCEXP_CONST.INCEXP_LIST_TEMPLATE_URL,
	        link: function(scope, element, attrs) {
	        }
	    };
	}])

    .directive('selectUsers', ['Authentication', 'UserStatics',
                               function(Authentication, UserStatics) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: UserStatics.getListUsersComboTmpl(),
            link: function(scope, element, attrs) {
            },
            scope: {
                currentUser: '=user',
                ngDisabled: '='
            },
            controller: ["$scope", function($scope){
                $scope.authentication = Authentication;
                var curUsersArr = [];
                curUsersArr.push(Authentication.user._id);
                $scope.queryUsers = function(query){
                    return UserStatics.queryUsers(query, curUsersArr.join());
                };
            }]
        };
    }])

    .directive('incexpApproval', ['Authentication', 'UserStatics',
        function(Authentication, UserStatics) {
            var ID = 0;
            function validateApproval(isPending, pendingType, pendingWith, pendingMsg, ngModel, form){
                ngModel.$setValidity('pendingTypeRequired', true);
                ngModel.$setValidity('pendingWithRequired', true);
                if(isPending){
                    if(!pendingType){
                        ngModel.$dirty = true;
                        ngModel.$pristine = false;
                        ngModel.$setValidity('pendingTypeRequired', false);
                        form.$dirty = true;
                        form.$pristine = false;
                    } else  if(!pendingWith || !pendingWith._id){
                        ngModel.$dirty = true;
                        ngModel.$pristine = false;
                        ngModel.$setValidity('pendingWithRequired', false);
                        form.$dirty = true;
                        form.$pristine = false;
                    }
                }
            }
            function buildModel(isPending, pendingType, pendingWith, pendingMsg, ngModel){
                ngModel.$viewValue = ngModel.$viewValue || {};
                ngModel.$viewValue.isPending = isPending;
                ngModel.$viewValue.pendingType = pendingType;
                ngModel.$viewValue.pendingWith = pendingWith;
                ngModel.$viewValue.pendingMsg = pendingMsg;
                //ngModel.$setViewValue(obj);
            }
            return {
                restrict: 'E',
                require: ['ngModel', '^form'],
                transclude: true,
                replace: true,
                scope: {
                    name: '@',
                    label: '=',
                    pendingTypeDefaultLabel: '=',
                    selectUserPlaceholder: '=',
                    pendingMsgPlaceholder: '=',
                    approvalTypes: '='
                },
                templateUrl: 'modules/incexps/templates/incexps-approval-field-template.client.html',
                link: function(scope, element, attrs, ctrl) {
                    var ngModel = ctrl[0];
                    var form = ctrl[1];
                    if( scope.name ) {
                        scope.subFormName = scope.name;
                    }
                    else {
                        scope.subFormName = '_range' + ID;
                        ID++;
                    }


                    ngModel.$render = function() {
                        if(ngModel && ngModel.$viewValue && ngModel.$viewValue.isPending){
                            scope.isPending = ngModel.$viewValue.isPending;
                            scope.pendingType = ngModel.$viewValue.pendingType;
                            scope.pendingWith = ngModel.$viewValue.pendingWith;
                            scope.pendingMsg = ngModel.$viewValue.pendingMsg;
                        } else {
                            scope.isPending = !1;
                            scope.pendingType = null;
                            scope.pendingWith = null;
                            scope.pendingMsg = null;
                        }

                    };

                    scope.$watch('isPending', function(newVal, oldVal) {
                        if(newVal === oldVal)   return;
                        validateApproval(newVal, scope.pendingType, scope.pendingWith, scope.pendingMsg, ngModel, form);
                        buildModel(newVal, scope.pendingType, scope.pendingWith, scope.pendingMsg, ngModel);
                    });
                    scope.$watch('pendingType', function(newVal, oldVal) {
                        if(newVal === oldVal)   return;
                        validateApproval(scope.isPending, newVal, scope.pendingWith, scope.pendingMsg, ngModel, form);
                        buildModel(scope.isPending, newVal, scope.pendingWith, scope.pendingMsg, ngModel);
                    });
                    scope.$watch('pendingWith', function(newVal, oldVal) {
                        if(newVal === oldVal)   return;
                        validateApproval(scope.isPending, scope.pendingType, newVal, scope.pendingMsg, ngModel, form);
                        buildModel(scope.isPending, scope.pendingType, newVal, scope.pendingMsg, ngModel);
                    });
                    scope.$watch('pendingMsg', function(newVal, oldVal) {
                        if(newVal === oldVal)   return;
                        validateApproval(scope.isPending, scope.pendingType, scope.pendingWith, newVal, ngModel, form);
                        buildModel(scope.isPending, scope.pendingType, scope.pendingWith, newVal, ngModel);
                    });
                    scope.applyDisableForPendingCheckbox = function(incexp){
                        if(incexp && incexp.owner){
                            return Authentication.user._id !== incexp.owner._id;
                        } else {
                            return false;
                        }
                    };
                    scope.applyDisablePendingFields = function(isSelected, incexp){
                        var toDisable = false;
                        if(typeof incexp === 'undefined'){
                            toDisable = !isSelected;
                        } else if(incexp && incexp.owner){
                            toDisable = (Authentication.user._id !== incexp.owner._id) || (!isSelected);
                        }
                        return toDisable;
                    };
                }
            };
        }])

;

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

angular.module('incexps').service('ChartService', [ '$http', '$q', '$stateParams', 'moment', '$filter',
	function($http, $q, $stateParams, moment, $filter) {
		var chartService = {};
        chartService.groupAndAggregate = function(items, projectBy, filterBy, groupBy, aggregateBy){
            var resultArr = [];
            var groupedObj = {};            
            for(var i = items.length-1; i >=0; --i){
            	var value = items[i];
            	if(filterBy && !filterBy(value)){
            		continue;
            	}
            	value = projectBy ? projectBy(value) : value;
            	if(groupBy){
                	var groupStr = JSON.stringify(groupBy(value));
                	var aggregated = value;
                    var prevItem = groupedObj[groupStr] && groupedObj[groupStr][0];
                	groupedObj[groupStr] = groupedObj[groupStr] || [];
                	if(!groupedObj[groupStr]){
                		aggregated.agg = aggregateBy ? aggregateBy(null, value) : value;
                    } else {
                    	groupedObj[groupStr] = aggregateBy ? [] : groupedObj[groupStr];
                        aggregated.agg = aggregateBy ? aggregateBy(prevItem, value) : value;
                    }
                    groupedObj[groupStr].push(aggregated);

                    resultArr = Object.keys(groupedObj).map(function(group){
        			    return groupedObj[group];
        			});
            	} else {
            		resultArr.push(value);
            	}
            }
            console.dir(resultArr);
            return resultArr;

        };
		chartService.transformToHeatMapData = function(incexps, filterBy){
			var data = {};
            var groupByDate = function(item){
                return [$filter('amDateFormat')(item.evDate,'YYYYMMDD')];
            };
            var aggregateBySumAmount = function(previousItem, currentItem){
                return (previousItem && currentItem ? (previousItem.amount + currentItem.amount) : 
                		(currentItem ? currentItem.amount : (previousItem ? previousItem.amount : 0)));
            };
            var filterByIncome = filterBy || function(item){
                return item.type === 'EXP';
            };
            var projectByFields = function(item){
                return {
                    evDate: item.evDate,
                    amount: item.amount
                };
            };
            var aggregatedArr = this.groupAndAggregate(incexps, projectByFields, filterByIncome, groupByDate, aggregateBySumAmount);
            var max = 1;
		    var start = null;
		    var end = null;
		    if($stateParams.month && $stateParams.year){
		        start = new Date($stateParams.year, $stateParams.month-1);
		        end = new Date($stateParams.year, $stateParams.month);
		    }
	    	var currentDate = new Date(start);//pull and store start date here
	    	var currentWeek = 0;
	    	var dataArr = [];
	    	
            if(currentDate.getDay() !== 0){
                for(var k = 0;k < currentDate.getDay();k++){
                    dataArr.push([k, 0, -1]);
                }
            }
	    	
		    while(true){
		    	if(currentDate >= start && currentDate < end){
		    		//dayno = columnIdx
		    		var dayItem = [];
		    		var value = 0;
		    		var hasMatch = false;
		    		for(var i = aggregatedArr.length-1; i >=0; --i){
		    			var item = aggregatedArr[i] && aggregatedArr[i][0];
		    			var aggDate = $filter('amDateFormat')(item.evDate,'YYYYMMDD');
		    			var calDate = $filter('amDateFormat')(currentDate,'YYYYMMDD');
		    			if(aggDate === calDate){
		    				value = item.agg;
		    				break;
		    			}
		    		}
    				dayItem.push(currentDate.getDay());
    				dayItem.push(currentWeek);
    				dayItem.push(value);
    				max = value > max ? value : max;
		    		dataArr.push(dayItem);
		    	} else {
		    		break;
		    	}
	    		if(currentDate.getDay() === 6){
	    			currentWeek++;	//reached day Saturday - so moving pointer to next week		
	    		}
		    	currentDate.setDate(currentDate.getDate() + 1);	//	moving the pointer to next date
		    }
		    data.max = max;
			data.xAxis = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var yAxis = [];
			for(var j = 0; j<=currentWeek; j++){
				yAxis.push('Week-' + (j+1));
			}
			data.yAxis = yAxis;
			data.seriesData = dataArr;
			return data;
		};
        chartService.getIncomeHeatMapConfig = function(labels, trackerIncexps){
            var heatMapConfig = this.getBaseHeatmapConfig(labels);
            var isItIncome = function(item){
            	var isIncome = item.type === 'INC';
            	var isFakeIncome = false;
            	angular.forEach(item.tags, function(val, key){
            		if(!isFakeIncome) {
            			if((val.id === 'REF') || (val.id === 'SWAP')){
            				isFakeIncome = true;	
            			}
            		}
            	});
                return isIncome && (!isFakeIncome);
            };
            var heatMapData = this.transformToHeatMapData(trackerIncexps, isItIncome);
            heatMapConfig.xAxis.categories = heatMapData.xAxis;
            //heatMapConfig.xAxis.min = -1;
            //heatMapConfig.yAxis.max = 0;
            heatMapConfig.yAxis.categories = heatMapData.yAxis;
            heatMapConfig.options.colorAxis.minColor = '#FFFFFF';
            heatMapConfig.options.colorAxis.maxColor = '#33ADFF';
            heatMapConfig.options.colorAxis.max = heatMapData.max;
            heatMapConfig.options.title.text = 'Income HEat Map - Cool Actually';
            heatMapConfig.series[0].data = heatMapData.seriesData;
            heatMapConfig.series[0].borderColor = '#007ACC';
            heatMapConfig.series[0].color = '#007ACC';
            heatMapConfig.series[0].dataLabels.color= '#005C99';
            return heatMapConfig;
        };
        chartService.getExpenseHeatMapConfig = function(labels, trackerIncexps){
            var heatMapConfig = this.getBaseHeatmapConfig(labels);
            var isItExpense = function(item){
            	var isExpense = item.type === 'EXP';
            	var isFakeExpense = false;
            	angular.forEach(item.tags, function(val, key){
            		if(!isFakeExpense) {
            			if((val.id === 'CCP') || (val.id === 'CAN') || (val.id === 'SWAP')){
            				isFakeExpense = true;	
            			}
            		}
            	});
                return isExpense && (!isFakeExpense);
            };
            var heatMapData = this.transformToHeatMapData(trackerIncexps, isItExpense);
            heatMapConfig.xAxis.categories = heatMapData.xAxis;
            //heatMapConfig.xAxis.min = -1;
            //heatMapConfig.yAxis.max = 0;
            heatMapConfig.yAxis.categories = heatMapData.yAxis;
            heatMapConfig.options.colorAxis.minColor = '#FFFFFF';
            heatMapConfig.options.colorAxis.maxColor = '#FF8585';
            heatMapConfig.options.colorAxis.max = heatMapData.max;
            heatMapConfig.options.title.text = 'Expenses HEat Map';
            heatMapConfig.series[0].data = heatMapData.seriesData;
            heatMapConfig.series[0].borderColor = '#CC5252';
            heatMapConfig.series[0].color = '#CC5252';
            heatMapConfig.series[0].dataLabels.color= '#993D3D';
            return heatMapConfig;
        };
        chartService.getBaseHeatmapConfig = function(labels){
            var heatMapChartConfig = {
                options: {
                    chart: {
                        type: 'heatmap',
                        marginTop: 40,
                        marginBottom: 80
                    },
                    title: {
                    },
                    colorAxis: {
                        min: 0
                    },

                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        margin: 0,
                        verticalAlign: 'top',
                        y: 25,
                        symbolHeight: 280
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b> Day : ' + this.series.xAxis.categories[this.point.x] + '</b><br><b>' +
                                '<b> Week : ' + this.series.yAxis.categories[this.point.y] + '</b><br><b>' +
                                '<b> Amount : ' + this.point.value + '</b>';
                        }
                    }
                },
                xAxis: {
                    lineWidth: 0
                },
                yAxis: {
                    lineWidth: 0
                },
                series: [{
                    name: 'Sales per employee',
                    borderWidth: 0.1,
                    data: null,
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        formatter: function(){
                            if(this.point.value === 0){
                                return '-';
                            } else if (this.point.value === -1){
                                return 'NA';
                            }else {
                                return this.point.value;
                            }
                        }
                    }
                }]

            };
            return heatMapChartConfig;
        };
		return chartService;
	}
]);

'use strict';

angular.module('incexps').service('IncexpLocaleMessages', [ '$http', '$q',
	function($http, $q) {
		return {
			pullMessages: function(){
				var _this = this;
				var deferred = $q.defer();
				if(_this.msgs){
					deferred.resolve(_this.msgs);
				} else {
					$http.get('modules/incexps/json/labels.json').success(function(response){
						_this.msgs = response;
						deferred.resolve(_this.msgs);
					});
				}
				return deferred.promise;
			}
		};
	}
]);

'use strict';

angular.module('incexps').service('IncexpStatics', [ '$http', '$q',
	function($http, $q) {
		var incexpStatics = {};


        incexpStatics.getIncexpTypes = function(){
            return this.incexpTypes;
        };
        incexpStatics.loadIncexpTypes = function(){
            var deferred = $q.defer();
            $http.get('modules/incexps/json/incexpTypes.json').then(function(response){
                incexpStatics.incexpTypes = response.data;
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };

        incexpStatics.getIncexpTags = function(){
            return this.incexpTags;
        };
        incexpStatics.loadIncexpTags = function(){
            var deferred = $q.defer();
            $http.get('modules/incexps/json/incexpTags.json').then(function(response){
                incexpStatics.incexpTags = response.data;
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };


        incexpStatics.getApprovalTypes = function(){
            return this.approvalTypes;
        };
        incexpStatics.loadApprovalTypes = function(){
            var deferred = $q.defer();
            $http.get('modules/incexps/json/incexpApprovalTypes.json').then(function(response){
                incexpStatics.approvalTypes = response.data;
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };

        //incexpStatics.getApprovalTypesForCreation = function(){
			//	if(! this.approvalTypesForCreation){
			//		this.approvalTypesForCreation = [{id: 'UPD_REQ', label: 'Request for Update'}];
			//	}
			//	return this.approvalTypesForCreation;
			//};
        //incexpStatics.getApprovalTypesForUpdate = function(){
        //    if(! this.getApprovalTypesForUpdate){
        //        this.getApprovalTypesForUpdate = [{id: 'DEL_REQ', label: 'Request for Deletion'},
        //            {id: 'UPD_REQ', label: 'Request for Update'},
        //            {id: 'UPD_ACC_REQ', label: 'Request for Update Access'},
        //            {id: 'UPD_ACC_APP', label: 'Approve Update Access Request'}];
        //    }
        //    return this.getApprovalTypesForUpdate;
        //};
        //
        //incexpStatics.getListIncexpsTemplatePath = function(){
        //    return 'modules/incexps/templates/incexps-list-template.client.html';
        //};
        //
        //incexpStatics.getIncexpType = function(){
        //    if(! this.incexpType){
        //        this.incexpType = [{id: 'INC', label: 'Income'},
        //            //{id: 'UPD_ACC_REQ', label: 'Request for Update Access'},
        //            {id: 'EXP', label: 'Expense'}];
        //    }
        //    return this.incexpType;
        //};
        //incexpStatics.getTagsList = function(){
        //    return $http.get('modules/incexps/json/incexpTags.json');
        //};
        //incexpStatics.getApprovalModel = function(incexp){
        //    if(!incexp){
        //        return {
        //            isPending: false,
        //            pendingType: null,
        //            pendingMsg: ''
        //        };
        //    } else {
        //        return {
        //            isPending: incexp.isPending,
        //            pendingType: incexp.pendingType,
        //            pendingMsg: incexp.pendingMsg
        //        };
        //    }
        //    return $http.get('modules/incexps/json/incexpTags.json');
        //};
		return incexpStatics;
	}
]);

'use strict';

//Vaults service used to communicate Vaults REST endpoints
angular.module('incexps').factory('TrackerIncexps', ['$resource',
	function($resource) {
		return $resource('trackerincexps/:trackerId/:incexpId', null, {
			update: {
				method: 'PUT'
			},
            listTrackerIncexps: {
                method: 'GET',
                params: {trackerId : 'trackerId'},
                isArray: true
            },
            listTrackerIncexpsByMonth: {
                url: 'trackerincexps/:trackerId/showMonth/:month/:year',
                method: 'GET',
                params: {trackerId : 'trackerId', month: 'month', year: 'year'},
                isArray: true
            },
            requestEditAccess: {
                url: 'incexps/requestEditAccess/:incexpId',
                method: 'PUT'
            },
            approveEditAccessRequest: {
                url: 'incexps/approveEditAccessRequest/:incexpId',
                method: 'PUT'
            },
            rejectEditAccessRequest: {
                url: 'incexps/rejectEditAccessRequest/:incexpId',
                method: 'PUT'
            },
            approveIncexpChanges: {
                url: 'incexps/approveChanges/:incexpId',
                method: 'PUT'
            }
		});
	}
]);

'use strict';

angular.module('trackers').constant('TRACKER_CONST', {
	'TRACKER_LIST_TEMPLATE_URL': 'modules/trackers/templates/trackers-list-template.client.html',
	
	'LIST_TRACKERS_STATE_NAME': 'listTrackers',
	'LIST_TRACKERS_STATE_URL': '/trackers',
	'LIST_TRACKERS_STATE_TEMPLATE_URL': 'modules/trackers/views/list-trackers.client.view.html',

	'CREATE_TRACKER_STATE_NAME': 'createTracker',
	'CREATE_TRACKER_STATE_URL': '/trackers/create',
	'CREATE_TRACKER_STATE_TEMPLATE_URL': 'modules/trackers/views/create-tracker.client.view.html',
	
	'EDIT_TRACKER_STATE_NAME': 'editTracker',
	'EDIT_TRACKER_STATE_URL': '/trackers/:trackerId/edit',
	'EDIT_TRACKER_STATE_TEMPLATE_URL': 'modules/trackers/views/edit-tracker.client.view.html'
	
});

'use strict';

// Configuring the Articles module
angular.module('trackers')
    .run(['Menus',
        function(Menus) {
            // Set top bar menu items
            Menus.addMenuItem('topbar', 'Trackers', 'trackers');
    //		Menus.addSubMenuItem('topbar', 'trackers', 'List Trackers', 'trackers');
    //		Menus.addSubMenuItem('topbar', 'trackers', 'New Tracker', 'trackers/create');
        }
    ])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.latencyThreshold = 10;
    }])
;

'use strict';

//Setting up route
angular.module('trackers').config(['$stateProvider', 'TRACKER_CONST',
	function($stateProvider, TRACKER_CONST) {
		// Trackers state routing
		$stateProvider.
		state(TRACKER_CONST.LIST_TRACKERS_STATE_NAME, {
			url: TRACKER_CONST.LIST_TRACKERS_STATE_URL,
			templateUrl: TRACKER_CONST.LIST_TRACKERS_STATE_TEMPLATE_URL
		}).
		state(TRACKER_CONST.CREATE_TRACKER_STATE_NAME, {
			url: TRACKER_CONST.CREATE_TRACKER_STATE_URL,
			templateUrl: TRACKER_CONST.CREATE_TRACKER_STATE_TEMPLATE_URL
		}).
		state(TRACKER_CONST.EDIT_TRACKER_STATE_NAME, {
			url: TRACKER_CONST.EDIT_TRACKER_STATE_URL,
			templateUrl: TRACKER_CONST.EDIT_TRACKER_STATE_TEMPLATE_URL
		});
	}
]);

'use strict';

// Trackers controller


angular.module('trackers')
    .controller('TrackersController', ['$scope', '$state', '$stateParams', 'Authentication', 'Trackers', 'TrackerLocaleMessages', 'TRACKER_CONST', 'VAULT_CONST', 'INCEXP_CONST', 'AppStatics', 'UserStatics', 'AppMessenger', 'moment', '$q',
        function($scope, $state, $stateParams, Authentication, Trackers, TrackerLocaleMessages, TRACKER_CONST, VAULT_CONST, INCEXP_CONST, AppStatics, UserStatics, AppMessenger, moment, $q) {
            var _this = this;
            _this.appStatics = AppStatics;
            _this.userStatics = UserStatics;
            _this.authentication = Authentication;
            _this.assignedUsers = [];
            _this.assignedUsers.push(Authentication.user);
            var pullMsgs = function(){
            	var deferred = $q.defer();
            	TrackerLocaleMessages.pullMessages().then(function(labels){
        			_this.labelsObj = labels;
        			deferred.resolve(null);
                });
                return deferred.promise;
            };

            var pullTrackers = function () {
                _this.trackers = Trackers.query();
                return _this.trackers.$promise;
            };
            
            var pullTracker = function () {
                $scope.tracker = Trackers.get({
                    trackerId: $stateParams.trackerId
                });
                return $scope.tracker.$promise;
            };
            
            var pullCurrencies = function(){
            	var deferred = $q.defer();
            	var cachedVal = _this.appStatics.getCurrencies();
            	//	If value is already cached by service - then use it otherwise 
            	if(cachedVal){
            		_this.currencies = cachedVal;
            		deferred.resolve(null);
            	} else {
            		_this.appStatics.loadCurrencies().then(function(response){
                        _this.currencies = [];
                        response.map(function(item){
                            _this.currencies.push(item);
                        });
                        deferred.resolve(null);
                    });	
            	}
            	return deferred.promise;
            };
            
            var bootmodule = function () {
//                _this.getLabel = function(key){
//                	return _this.labelsObj[key];
//                };
                _this.getLocalTime = function (time) {
                    return moment(time).toString();
                };
                _this.getOwnerTxt = function (tracker) {
                    return (tracker.owner && tracker.owner._id && (tracker.owner._id === Authentication.user._id)) ? 'Me' :
                        ((tracker.owner && tracker.owner.displayName) ? tracker.owner.displayName : 'No Name');
                };
                _this.getUsersTxt = function (tracker) {
                    var users = '';
                    //TODO - splice owner name from this
                    if (tracker.users && tracker.users.length > 1) {
                        for (var i = 0; i < tracker.users.length; i++) {
                            if(tracker.owner._id === tracker.users[i]._id)	continue;
                            if (users !== '') {
                                users = users + ((i === tracker.users.length - 2) ? ' , ' : ' and ') + 
                                	((tracker.users[i]._id === Authentication.user._id) ? 'Me' : tracker.users[i].displayName);
                            } else {
                                users = tracker.users[i].displayName;
                            }
                        }
                    } else if (tracker.users && tracker.users.length === 1) {
                        users = 'No one else - this is my private tracker';
                    }
                    return users;
                };
                _this.loadVaults = function (trackerId) {
                    $state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, {trackerId: trackerId});
                };
                _this.loadIncexps = function (trackerId) {
//                    $state.go(INCEXP_CONST.LIST_INCEXPS_STATE_NAME, {trackerId: trackerId});
                    //TODO - find current month and year
                    var now = moment();
                    var month = now.format('MM');
                    var year = now.format('YYYY');
                    $state.go(INCEXP_CONST.LIST_INCEXPS_BY_MONTH_STATE_NAME, {
                    	trackerId: trackerId,
                    	month : month,
                    	year: year
                    });
                };
                _this.loadIncexpsDashboard = function (trackerId) {
//                  $state.go(INCEXP_CONST.DASH_INCEXPS_STATE_NAME, {trackerId: trackerId});
                  //TODO - find current month and year
                  var now = moment();
                  var month = now.format('MM');
                  var year = now.format('YYYY');
                  $state.go(INCEXP_CONST.DASH_INCEXPS_BY_MONTH_STATE_NAME, {
                  	trackerId: trackerId,
                  	month : month,
                  	year: year
                  });
              };
                _this.createTracker = function (size) {
                    _this.tracker = {};
                    $state.go(TRACKER_CONST.CREATE_TRACKER_STATE_NAME);
                };
                _this.editTracker = function (tracker) {
                    $state.go(TRACKER_CONST.EDIT_TRACKER_STATE_NAME, {trackerId: tracker._id});
                };
                _this.cancel = function (tracker) {
                    $state.go(TRACKER_CONST.LIST_TRACKERS_STATE_NAME);
                };
                _this.saveTracker = function (size) {
                    var tracker = new Trackers({
                        displayName: _this.displayName,
                        description: _this.description,
                        currency: _this.currency,
                        owner: _this.owner,
                        // users: _this.users,
                        created: _this.created
                    });
                    tracker.users = [];
                    angular.forEach(_this.assignedUsers, function (value, key) {
                        tracker.users.push(value._id);
                    });
                    tracker.$save(function (response) {
                        $state.go(TRACKER_CONST.LIST_TRACKERS_STATE_NAME);
                        AppMessenger.sendInfoMsg(_this.labelsObj['app.trackers.info.msg.createdTracker']);
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };
                _this.updateTracker = function (updatedTracker) {
                    var tracker = updatedTracker;
                    var users = [];
                    var owner = tracker.owner._id;
                    angular.forEach(tracker.users, function (value, key) {
                        users.push(value._id);
                    });
                    tracker.owner = owner;
                    tracker.users = users;
                    tracker.$update(function () {
                        $state.go(TRACKER_CONST.LIST_TRACKERS_STATE_NAME);
                        AppMessenger.sendInfoMsg(_this.labelsObj['app.trackers.info.msg.updatedTracker']);
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };


                _this.remove = function (tracker) {
                    if (tracker) {
                        tracker.$remove(function () {
                            $state.go(TRACKER_CONST.LIST_TRACKERS_STATE_NAME, $stateParams, {reload: true});
                            AppMessenger.sendInfoMsg(_this.labelsObj['app.trackers.info.msg.deletedTracker']);
                        }, function (errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }
                };

            };
            
            	//Bootstrapping based on application state
            if($state.current.name === TRACKER_CONST.LIST_TRACKERS_STATE_NAME){
            	pullMsgs().then(pullTrackers).then(bootmodule);
            } else if($state.current.name === TRACKER_CONST.CREATE_TRACKER_STATE_NAME){
            	pullMsgs().then(pullCurrencies).then(bootmodule);
            } else if($state.current.name === TRACKER_CONST.EDIT_TRACKER_STATE_NAME){
            	pullMsgs().then(pullCurrencies).then(pullTracker).then(bootmodule);
            }
        }
    ])
;

'use strict';

// Trackers controller

angular.module('trackers')
	.directive('trackersList', ['TRACKER_CONST', function(TRACKER_CONST) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: TRACKER_CONST.TRACKER_LIST_TEMPLATE_URL,
	        link: function(scope, element, attrs) {
	        }
	    };
	}])

	.directive('addUsers', ['Authentication', 'UserStatics', function(Authentication, UserStatics) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: UserStatics.getAddUsersTmpl(),
	        link: function(scope, element, attrs) {
	        },
	        scope: {
	        	assignedUsers: '=users',
				placeholder: '=',
				btntext: '=',
				ttOwner: '=',
				ttUser: '=',
				ownerTxt: '='
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

angular.module('incexps').service('TrackerLocaleMessages', [ '$http', '$q',
	function($http, $q) {
		return {
			pullMessages: function(){
				var _this = this;
				var deferred = $q.defer();
				if(_this.msgs){
					deferred.resolve(_this.msgs);
				} else {
					$http.get('modules/trackers/json/labels.json').success(function(response){
						_this.msgs = response;
						deferred.resolve(_this.msgs);
					});
				}
				return deferred.promise;
			}
		};
	}
]);

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

angular.module('vaults').constant('VAULT_CONST', {
	'VAULT_LIST_TEMPLATE_URL': 'modules/vaults/templates/vaults-list-template.client.html',
	
	'LIST_VAULTS_STATE_NAME': 'listTrackerVaults',
	'LIST_VAULTS_STATE_URL': '/trackervaults/:trackerId',
	'LIST_VAULTS_STATE_TEMPLATE_URL': 'modules/vaults/views/list-vaults.client.view.html',

	'CREATE_VAULT_STATE_NAME': 'createVault',
	'CREATE_VAULT_STATE_URL': '/trackervaults/:trackerId/create',
	'CREATE_VAULT_STATE_TEMPLATE_URL': 'modules/vaults/views/create-vault.client.view.html',
	
	'EDIT_VAULT_STATE_NAME': 'editVault',
	'EDIT_VAULT_STATE_URL': '/trackervaults/:trackerId/:vaultId/edit',
	'EDIT_VAULT_STATE_TEMPLATE_URL': 'modules/vaults/views/edit-vault.client.view.html'
	
});

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
angular.module('vaults').config(['$stateProvider', 'VAULT_CONST',
	function($stateProvider, VAULT_CONST) {
		$stateProvider.
		state(VAULT_CONST.LIST_VAULTS_STATE_NAME, {
			url: VAULT_CONST.LIST_VAULTS_STATE_URL,
			templateUrl: VAULT_CONST.LIST_VAULTS_STATE_TEMPLATE_URL
		}).
		state(VAULT_CONST.CREATE_VAULT_STATE_NAME, {
			url: VAULT_CONST.CREATE_VAULT_STATE_URL,
			templateUrl: VAULT_CONST.CREATE_VAULT_STATE_TEMPLATE_URL
		}).
		state(VAULT_CONST.EDIT_VAULT_STATE_NAME, {
			url: VAULT_CONST.EDIT_VAULT_STATE_URL,
			templateUrl: VAULT_CONST.EDIT_VAULT_STATE_TEMPLATE_URL
		});
	}
]);

'use strict';

// Vaults controller
angular.module('vaults')



    .controller('VaultsController', ['$scope', '$stateParams', 'Authentication', '$state', 'VAULT_CONST',
                'TrackerVaults', 'moment', 'AppStatics', 'AppMessenger', 'VaultLocaleMessages', '$q',
        function($scope, $stateParams, Authentication, $state, VAULT_CONST, 
                    TrackerVaults, moment, AppStatics, AppMessenger, VaultLocaleMessages, $q) {
            var _this = this;
            _this.authentication = Authentication;
            _this.appStatics = AppStatics;
            $scope.$stateParams = $stateParams;
            var pullMsgs = function(){
            	var deferred = $q.defer();
            	VaultLocaleMessages.pullMessages().then(function(labels){
                    _this.labelsObj = labels;
                    deferred.resolve(null);
                });
                return deferred.promise;
            };
            
            var pullVaults = function () {
            	_this.trackerVaults = TrackerVaults.listTrackerVaults($stateParams);
            	return _this.trackerVaults.$promise;
            };
            
            var pullVault = function () {
                $scope.vault = TrackerVaults.get($stateParams);
                return $scope.vault.$promise;
            };

            var bootmodule = function(){
                _this.getOwnerTxt = function (vault) {
                    return (vault.owner && vault.owner._id && (vault.owner._id === Authentication.user._id)) ? 'Me' :
                        ((vault.owner && vault.owner.displayName) ? vault.owner.displayName : 'No Name');
                };
                _this.createVault = function() {
                    _this.vault = {};
                    $state.go(VAULT_CONST.CREATE_VAULT_STATE_NAME, $stateParams);
                };
                _this.editVault = function(vault) {
                    $state.go(VAULT_CONST.EDIT_VAULT_STATE_NAME, {
                    	trackerId : $stateParams.trackerId,
                    	vaultId: vault._id
                    });
                };
                _this.cancel = function(){
                	$state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams);
                };
                _this.saveVault = function() {
                    var vault = new TrackerVaults({
                        displayName: _this.displayName,
                        description: _this.description,
                        tracker: $stateParams.trackerId,
                        owner: _this.authentication.user._id,
                        created: _this.created
                    });
                    // Redirect after save
                    vault.$save($stateParams,function(response) {
                        $state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams);
                        AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.createdVault']);
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };
                _this.updateVault = function(updatedVault){
                    var vault = updatedVault;
                    var trackerId = vault.tracker._id;
                    delete vault.tracker;
                    vault.$update($stateParams, function() {
                    	$state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams);
                        AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.updatedVault']);
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                _this.deleteVault = function(vault) {
                    if (vault) {
                        vault.$remove({
                        	trackerId : $stateParams.trackerId,
                        	vaultId: vault._id
                        }, function(res){
                        	$state.go(VAULT_CONST.LIST_VAULTS_STATE_NAME, $stateParams, {reload: true});
                            AppMessenger.sendInfoMsg(_this.labelsObj['app.vaults.info.msg.deletedVault']);
                        });
                    }
                };	
            };

            
        	//Bootstrapping based on application state
            if($state.current.name === VAULT_CONST.LIST_VAULTS_STATE_NAME){
            	pullMsgs().then(pullVaults).then(bootmodule);
            } else if($state.current.name === VAULT_CONST.CREATE_VAULT_STATE_NAME){
            	pullMsgs().then(bootmodule);
            } else if($state.current.name === VAULT_CONST.EDIT_VAULT_STATE_NAME){
            	pullMsgs().then(pullVault).then(bootmodule);
            }


        }
    ])

;

'use strict';

// Vaults controller
angular.module('vaults')
	.directive('vaultsList', ['VAULT_CONST', function(VAULT_CONST) {
	    return {
	        restrict: 'E',
	        transclude: true,
	        templateUrl: VAULT_CONST.VAULT_LIST_TEMPLATE_URL,
	        link: function(scope, element, attrs) {
	        }
	    };
	}])

;

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
'use strict';

angular.module('vaults').service('VaultLocaleMessages', [ '$http', '$q',
	function($http, $q) {
		return {
			pullMessages: function(){
				var _this = this;
				var deferred = $q.defer();
				if(_this.msgs){
					deferred.resolve(_this.msgs);
				} else {
					$http.get('modules/vaults/json/labels.json').success(function(response){
						_this.msgs = response;
						deferred.resolve(_this.msgs);
					});
				}
				return deferred.promise;
			}
		};
	}
]);

'use strict';

angular.module('vaults').service('VaultStatics', [ '$http', '$q',
	function($http, $q) {
		var vaultStatics = {};
         //TODO - refactor it with promises
        vaultStatics.queryVaults = function(trackerId, excludeVaults){
            //http://stackoverflow.com/questions/19405548/default-angularjs-ng-option-when-data-is-returned-from-a-service
            return $http.get('/queryvaults/queryByTracker', {
                params: {
                    tId: trackerId,
                    exv: excludeVaults
                }
            });
        };
		return vaultStatics;
	}
]);

'use strict';

//Vaults service used to communicate Vaults REST endpoints
angular.module('vaults').factory('TrackerVaults', ['$resource',
	function($resource) {
		return $resource('trackervaults/:trackerId/:vaultId', null, {
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
