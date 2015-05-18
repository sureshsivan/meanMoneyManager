'use strict';

angular.module('core')
    .filter('pad', function() {
        return function(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        };
    })
    .filter('navmonths', ['$filter', function($filter) {
        return function(month, year, n) {
        	n = n || 1;
        	var month = parseInt(month);
        	var year = parseInt(year);
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
    		}
        };
    }]);
