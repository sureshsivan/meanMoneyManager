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
