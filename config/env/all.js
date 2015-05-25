'use strict';

module.exports = {
	app: {
		title: 'meanMoneyManager',
		description: 'Money Managet application - Fullstacj javascript web app powered by MEAN',
		keywords: 'moneyManager, AngularJS, MongoDB, Express, Node.js, Javascript'
	},
	port: process.env.PORT || 8080,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/fontawesome/css/font-awesome.css',
                'public/lib/angular-loading-bar/build/loading-bar.css',
                'public/lib/ng-tags-input/ng-tags-input.css',
                'public/lib/ng-tags-input/ng-tags-input.bootstrap.css'
			],
			js: [
			    'public/lib/jquery/dist/jquery.js'
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/moment/min/moment-with-locales.js',
				'public/lib/angular-moment/angular-moment.js',
                'public/lib/angular-loading-bar/build/loading-bar.js',
                'public/lib/ng-tags-input/ng-tags-input.js',
                'public/lib/highcharts/adapters/standalone-framework.src.js',
                'public/lib/highcharts/highcharts.src.js',
                'public/lib/highcharts/highcharts-more.src.js',
                'public/lib/highcharts/modules/heatmap.src.js',
                'public/lib/highcharts-ng/dist/highcharts-ng.js',
                'public/lib/slick-carousel/slick/slick.min.js',
                'public/lib/angular-slick/dist/slick.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
