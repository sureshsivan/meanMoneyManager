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
