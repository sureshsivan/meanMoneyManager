'use strict';

angular.module('incexps').service('ChartService', [ '$http', '$q', '$stateParams', 'moment', '$filter',
	function($http, $q, $stateParams, moment, $filter) {
		var chartService = {};
<<<<<<< HEAD
        chartService.groupAndAggregate = function(items, projectBy, filterBy, groupBy, aggregateBy){
            var result = [];
            var groupedObj = {};            
            for(var i = items.length-1; i >=0; --i){
            	var value = items[i];
            	if(filterBy && filterBy(value)){
            		continue;
            	}
            	value = projectBy ? projectBy(value) : value;
            	if(groupBy){
                	var groupStr = JSON.stringify(groupBy(value));
                	var aggregated = value;
                	groupedObj[groupStr] = groupedObj[groupStr] || [];
                	if(!groupedObj[groupStr]){
                		aggregated['agg'] = aggregateBy ? aggregateBy(null, value) : value;
                    } else {
                    	groupedObj[groupStr] = aggregateBy ? [] : groupedObj[groupStr];
                        var prevItem = groupedObj[groupStr];
                        aggregated['agg'] = aggregateBy ? aggregateBy(prevItem, value) : value;
                    }
                    groupedObj[groupStr].push(aggregated);
            	} else {
            		result.push(value);
            	}
            }
            console.dir(result);
            return result;

//=======
//        chartService.groupAndAggregate = function(items, groupBy, aggregateBy){
//            var groupedObj = {};
//            var aggregatedArr = angular.forEach(items, function(value, key){
//                var groupStr = JSON.stringify(groupBy(value));
//                var aggregated = null;
//                if(!groupedObj[groupStr]){
//                    aggregated = {evDate: value.evDate, amount: value.amount};
//                } else {
//                    var prevItem = groupedObj[groupStr];
//                    aggregated = {evDate: value.evDate, val: aggregateBy(prevItem, value)};
//                }
//                groupedObj[groupStr] = [];
//                groupedObj[groupStr].push(aggregated);
//                //groupedObj[groupStr] = groupedObj[groupStr] || [];
//                //groupedObj[groupStr].push(value);
//            });
//            return aggregatedArr;
//>>>>>>> branch 'master' of https://github.com/v8-suresh/meanMoneyManager.git
        };
		chartService.transformToHeatMapData = function(incexps){
			
			var data = {};
            var groupBy = function(item){
                return [$filter('amDateFormat')(item.evDate,'YYYYMMDD')];
            };
            var aggregateBySumAmount = function(previousItem, currentItem){
                return (previousItem && currentItem ? (previousItem.amount + currentItem.amount) : 
                		(currentItem ? currentItem.amount : (previousItem ? previousItem.amount : 0)));
            };
            var filterBy = function(item){
                return item.type === 'EXP';
            };
            var projectByFields = function(item){
                return {
                    evDate: item.evDate,
                    amount: item.amount
                };
            };
            var aggregatedArr = this.groupAndAggregate(incexps, projectByFields, filterByIncome, groupByDate, aggregateBySumAmount);

		    var start = null;
		    var end = null;
		    if($stateParams.month && $stateParams.year){
		        start = new Date($stateParams.year, $stateParams.month-1);
		        end = new Date($stateParams.year, $stateParams.month);
		    }
	    	var currentDate = new Date(start);//pull and store start date here
	    	var currentWeek = 1;

		    while(true){
		    	if(currentDate >= start && currentDate < end){
		    		var dataArr = [];
		    		dataArr.push(currentDate.getDay());
		    		dataArr.push(currentWeek);
		    		
		    		if(currentDate.getDay() === 6){
		    			currentWeek++;	//reached day Saturday - so moving pointer to next week		
		    		}
		    	} else {
		    		break;
		    	}
		    	currentDate.setDate(currentDate.getDate() + 1);	//	moving the pointer to next date
		    }
		
			data.xAxis = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			data.yAxis = ['Week-1', 'Week-2', 'Week-3', 'Week-4'];
			data.seriesData = [[0, 1, 19], [0, 2, 8], [0, 3, 24], 
			                   [1, 0, 'NA'], [1, 1, 58], [1, 2, 78], [1, 3, 117], 
			                   [2, 0, 35], [2, 2, 123], [2, 3, 64],
			                   [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19],
			                   [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117],
			                   [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6],
			                   [6, 0, 47], [6, 1, 114], [6, 2, 31], [6, 3, 48]];
			return data;
		};
		chartService.getHeatmapConfig = function(labels, trackerIncexps){
			var heatMapData = this.transformToHeatMapData(trackerIncexps);
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
        	return heatMapChartConfig;
		};
		return chartService;
	}
]);
