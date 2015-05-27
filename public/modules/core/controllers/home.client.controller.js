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
			title: 'AAAAAAAAAAAAAAAAAAAA',
			img: 'http://v8-suresh.github.io/img/ipad.png',
			text: '' 
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
