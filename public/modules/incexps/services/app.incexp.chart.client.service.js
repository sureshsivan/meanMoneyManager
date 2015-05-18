'use strict';

angular.module('incexps').service('ChartService', [ '$http', '$q', '$stateParams', 'moment', '$filter',
	function($http, $q, $stateParams, moment, $filter) {
		var chartService = {};
        chartService.groupAndAggregate = function(items, projectBy, filterBy, groupBy, aggregateBy){
            var resultArr = [];
            var groupedObj = {};            
            for(var i = items.length-1; i >=0; --i){
            	var value = items[i];
            	if(filterBy && !filterBy(value)){
            		continue;
            	}
            	value = projectBy ? projectBy(value) : value;
            	if(groupBy){
                	var groupStr = JSON.stringify(groupBy(value));
                	var aggregated = value;
                    var prevItem = groupedObj[groupStr] && groupedObj[groupStr][0];
                	groupedObj[groupStr] = groupedObj[groupStr] || [];
                	if(!groupedObj[groupStr]){
                		aggregated['agg'] = aggregateBy ? aggregateBy(null, value) : value;
                    } else {
                    	groupedObj[groupStr] = aggregateBy ? [] : groupedObj[groupStr];
                        aggregated['agg'] = aggregateBy ? aggregateBy(prevItem, value) : value;
                    }
                    groupedObj[groupStr].push(aggregated);

                    resultArr = Object.keys(groupedObj).map(function(group){
        			    return groupedObj[group];
        			});
            	} else {
            		resultArr.push(value);
            	}
            }
            console.dir(resultArr);
            return resultArr;

        };
		chartService.transformToHeatMapData = function(incexps, filterBy){
			var data = {};
            var groupByDate = function(item){
                return [$filter('amDateFormat')(item.evDate,'YYYYMMDD')];
            };
            var aggregateBySumAmount = function(previousItem, currentItem){
                return (previousItem && currentItem ? (previousItem.amount + currentItem.amount) : 
                		(currentItem ? currentItem.amount : (previousItem ? previousItem.amount : 0)));
            };
            var filterByIncome = filterBy || function(item){
                return item.type === 'EXP';
            };
            var projectByFields = function(item){
                return {
                    evDate: item.evDate,
                    amount: item.amount
                };
            };
            var aggregatedArr = this.groupAndAggregate(incexps, projectByFields, filterByIncome, groupByDate, aggregateBySumAmount);
            var max = 1;
		    var start = null;
		    var end = null;
		    if($stateParams.month && $stateParams.year){
		        start = new Date($stateParams.year, $stateParams.month-1);
		        end = new Date($stateParams.year, $stateParams.month);
		    }
	    	var currentDate = new Date(start);//pull and store start date here
	    	var currentWeek = 0;
	    	var dataArr = [];
	    	
            if(currentDate.getDay() !== 0){
                for(var k = 0;k < currentDate.getDay();k++){
                    dataArr.push([k, 0, -1])
                }
            }
	    	
		    while(true){
		    	if(currentDate >= start && currentDate < end){
		    		//dayno = columnIdx
		    		var dayItem = [];
		    		var value = 0;
		    		var hasMatch = false;
		    		for(var i = aggregatedArr.length-1; i >=0; --i){
		    			var item = aggregatedArr[i] && aggregatedArr[i][0];
		    			var aggDate = $filter('amDateFormat')(item.evDate,'YYYYMMDD');
		    			var calDate = $filter('amDateFormat')(currentDate,'YYYYMMDD');
		    			if(aggDate === calDate){
		    				value = item.agg;
		    				break;
		    			}
		    		}
    				dayItem.push(currentDate.getDay());
    				dayItem.push(currentWeek);
    				dayItem.push(value);
    				max = value > max ? value : max;
		    		dataArr.push(dayItem);
		    	} else {
		    		break;
		    	}
	    		if(currentDate.getDay() === 6){
	    			currentWeek++;	//reached day Saturday - so moving pointer to next week		
	    		}
		    	currentDate.setDate(currentDate.getDate() + 1);	//	moving the pointer to next date
		    }
		    data.max = max;
			data.xAxis = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var yAxis = [];
			for(var j = 0; j<=currentWeek; j++){
				yAxis.push('Week-' + (j+1));
			}
			data.yAxis = yAxis;
			data.seriesData = dataArr;
			return data;
		};
        chartService.getIncomeHeatMapConfig = function(labels, trackerIncexps){
            var heatMapConfig = this.getBaseHeatmapConfig(labels);
            var isItIncome = function(item){
            	var isIncome = item.type === 'INC';
            	var isFakeIncome = false;
            	angular.forEach(item.tags, function(val, key){
            		if(!isFakeIncome) {
            			if(val.id === 'REF'){
            				isFakeIncome = true;	
            			}
            		}
            	})
                return isIncome && (!isFakeIncome);
            };
            var heatMapData = this.transformToHeatMapData(trackerIncexps, isItIncome);
            heatMapConfig.xAxis.categories = heatMapData.xAxis;
            //heatMapConfig.xAxis.min = -1;
            //heatMapConfig.yAxis.max = 0;
            heatMapConfig.yAxis.categories = heatMapData.yAxis;
            heatMapConfig.options.colorAxis.minColor = '#FFFFFF';
            heatMapConfig.options.colorAxis.maxColor = '#33ADFF';
            heatMapConfig.options.colorAxis.max = heatMapData.max;
            heatMapConfig.options.title.text = 'Income HEat Map - Cool Actually';
            heatMapConfig.series[0].data = heatMapData.seriesData;
            heatMapConfig.series[0].borderColor = '#007ACC';
            heatMapConfig.series[0].color = '#007ACC';
            heatMapConfig.series[0].dataLabels.color= '#005C99';
            return heatMapConfig;
        };
        chartService.getExpenseHeatMapConfig = function(labels, trackerIncexps){
            var heatMapConfig = this.getBaseHeatmapConfig(labels);
            var isItExpense = function(item){
            	var isExpense = item.type === 'EXP';
            	var isFakeExpense = false;
            	angular.forEach(item.tags, function(val, key){
            		if(!isFakeExpense) {
            			if((val.id === 'CCP') || (val.id === 'CAN')){
            				isFakeExpense = true;	
            			}
            		}
            	})
                return isExpense && (!isFakeExpense);
            };
            var heatMapData = this.transformToHeatMapData(trackerIncexps, isItExpense);
            heatMapConfig.xAxis.categories = heatMapData.xAxis;
            //heatMapConfig.xAxis.min = -1;
            //heatMapConfig.yAxis.max = 0;
            heatMapConfig.yAxis.categories = heatMapData.yAxis;
            heatMapConfig.options.colorAxis.minColor = '#FFFFFF';
            heatMapConfig.options.colorAxis.maxColor = '#FF8585';
            heatMapConfig.options.colorAxis.max = heatMapData.max;
            heatMapConfig.options.title.text = 'Expenses HEat Map';
            heatMapConfig.series[0].data = heatMapData.seriesData;
            heatMapConfig.series[0].borderColor = '#CC5252';
            heatMapConfig.series[0].color = '#CC5252';
            heatMapConfig.series[0].dataLabels.color= '#993D3D';
            return heatMapConfig;
        };
        chartService.getBaseHeatmapConfig = function(labels){
            var heatMapChartConfig = {
                options: {
                    chart: {
                        type: 'heatmap',
                        marginTop: 40,
                        marginBottom: 80
                    },
                    title: {
                    },
                    colorAxis: {
                        min: 0
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
                            return '<b> Day : ' + this.series.xAxis.categories[this.point.x] + '</b><br><b>' +
                                '<b> Week : ' + this.series.yAxis.categories[this.point.y] + '</b><br><b>' +
                                '<b> Amount : ' + this.point.value + '</b>';
                        }
                    }
                },
                xAxis: {
                    lineWidth: 0
                },
                yAxis: {
                    lineWidth: 0
                },
                series: [{
                    name: 'Sales per employee',
                    borderWidth: 0.1,
                    data: null,
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        formatter: function(){
                            if(this.point.value === 0){
                                return '-';
                            } else if (this.point.value === -1){
                                return 'NA';
                            }else {
                                return this.point.value
                            }
                        }
                    }
                }]

            };
            return heatMapChartConfig;
        };
		return chartService;
	}
]);
