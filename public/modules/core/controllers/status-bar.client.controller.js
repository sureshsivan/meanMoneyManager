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
