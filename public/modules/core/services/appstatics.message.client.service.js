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

    // TODO - assigned vars might required in case of unbinding later
    var infoMsg = $rootScope.$on('INFO', function(e, data){
      console.log('Info Message Received');
      console.dir(data);alert(data);
    });
    var warnMsg = $rootScope.$on('WARN', function(e, data){
      console.log('Warn Message Received');
      console.dir(data);alert(data);
    });
    var errMsg = $rootScope.$on('ERR', function(e, data){
      console.log('Err Message Received');
      console.dir(data);alert(data);
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
