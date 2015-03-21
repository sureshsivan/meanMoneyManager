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