'use strict';

angular.module('incexps').service('ChartService', [ '$http', '$q',
	function($http, $q) {
		var chartService = {};
		chartService.transformToHeatMapData = function(incexps){
			var data = {};
			data.xAxis = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			data.yAxis = ['Week-1', 'Week-2', 'Week-3', 'Week-4'];
			data.seriesData = [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], 
			                   [1, 0, 'NA'], [1, 1, 58], [1, 2, 78], [1, 3, 117], 
			                   [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64],
			                   [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19],
			                   [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117],
			                   [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6],
			                   [6, 0, 47], [6, 1, 114], [6, 2, 31], [6, 3, 48]];
			return data;
		};
		chartService.getHeatmapConfig = function(trackerIncexps){
			console.log('getHeatmapConfig');
			var heatMapData = this.transformToHeatMapData(trackerIncexps);
			console.dir(heatMapData);
        	var heatMapChartConfig = {
        			options: {
        				chart: {
        		            type: 'heatmap',
        		            marginTop: 40,
        		            marginBottom: 80
        		        },
        		        title: {
        		            text: 'Sales per employee per weekday'
        		        },
        		        colorAxis: {
        		            min: 0,
        		            minColor: '#FFFFFF',
        		            maxColor: '#000000'
        		        },

        		        legend: {
        		            align: 'right',
        		            layout: 'vertical',
        		            margin: 0,
        		            verticalAlign: 'top',
        		            y: 25,
        		            symbolHeight: 280
        		        },
        		        tooltip: {
        		            formatter: function () {
        		                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
        		                    this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
        		            }
        		        }
        			},
        	        xAxis: {
        	            categories: heatMapData.xAxis
        	        },

        	        yAxis: {
        	            categories: heatMapData.yAxis,
        	            title: 'SSSSSSSSSSSS'
        	        },
        	        series: [{
        	            name: 'Sales per employee',
        	            borderWidth: 1,
        	            data: heatMapData.seriesData,
        	            dataLabels: {
        	                enabled: true,
        	                color: '#000000'
        	            }
        	        }]       	        
        	
        	};
        	console.dir('EEEEEEEEEEEEEEEEE');
        	console.dir(heatMapChartConfig);
        	return heatMapChartConfig;
		};
		return chartService;
	}
]);
