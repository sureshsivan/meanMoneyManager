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
                curUsersArr.push(Authentication.user.id);
                $scope.queryUsers = function(query){
                    return UserStatics.queryUsers(query, curUsersArr.join());
                };
            }
        };
    }])

    .directive('incexpApproval', ['Authentication', 'UserStatics',
        function(Authentication, UserStatics) {
            return {
                restrict: 'E',
                require: ['ngModel'],
                transclude: true,
                templateUrl: 'modules/incexps/templates/incexps-approval-field-template.client.html',
                link: function(scope, element, attrs, ctrl) {
                    //console.dir(ctrl);
                    //scope.$watch(scope.ngModel, function(){
                    //    console.log('Listener 1');
                    //});
                    //scope.$watch(attrs.ngModel, function(){
                    //    console.log('Listener 2');
                    //});
                    //scope.$watch(ctrl.$viewValue, function(){
                    //    console.log('Listener 3');
                    //});
                    //var xx = function(){
                    //    console.log('Ayyooooo');
                    //}
                    //ctrl[0].$parsers.unshift(xx);
                    //ctrl[0].$formatters.push(xx);
                    //ctrl[0].$viewChangeListeners.unshift(xx);
                    //console.dir(ctrl);
                    ////scope.$watch(attrs.ngModel, function(){
                    ////    console.log('Listener 4');
                    ////});
                    scope.validateApproval = function(model){
                        console.log('Validating Fiels');
                        //if(model.isPending){
                        //    ctrl[0].$dirty = true;
                        //    ctrl[0].$pristine = false;
                        //    if(!model.pendingType){
                        //        ctrl[0].$setValidity('pendingTypeNotFound', false);
                        //        console.dir(ctrl[0]);
                        //    }else if(!model.pendingWith){
                        //        ctrl[0].$setValidity('pendingWithNotFound', false);
                        //        console.dir(ctrl[0]);
                        //    }
                        //} else {
                        //    console.log('Clear the entire model');
                        //}
                    };
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
                },
                scope: {
                    label: '=',
                    pendingTypeDefaultLabel: '=',
                    selectUserPlaceholder: '=',
                    pendingMsgPlaceholder: '=',
                    approvalTypes: '='
                }
                //controller: function($scope){
                //    $scope.applyDisableForPendingCheckbox = function(incexp){
                //        if(incexp && incexp.owner){
                //            return Authentication.user._id !== incexp.owner._id;
                //        } else {
                //            return false;
                //        }
                //    };
                //    $scope.applyDisablePendingFields = function(isSelected, incexp){
                //        var toDisable = false;
                //        if(typeof incexp === 'undefined'){
                //            toDisable = !isSelected;
                //        } else if(incexp && incexp.owner){
                //            toDisable = (Authentication.user._id !== incexp.owner._id) || (!isSelected);
                //        }
                //        return toDisable;
                //    };
                //}
            };
        }])

;
