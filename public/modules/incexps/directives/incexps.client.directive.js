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
            controller: function($scope){
                $scope.authentication = Authentication;
                var curUsersArr = [];
                curUsersArr.push(Authentication.user._id);
                $scope.queryUsers = function(query){
                    return UserStatics.queryUsers(query, curUsersArr.join());
                };
            }
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
