'use strict';

/**
 * @ngdoc function
 * @name senseUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the senseUiApp
 */
angular.module('senseUiApp')
  .controller('MainCtrl', function ($scope, Timeseries, Sensors) {
  	window.Timeseries=Timeseries;
  	console.log('Got to main');
  	Sensors.all(function(values){
  		$scope.sensor_data=_.groupBy(values,'sensorID');
  		// $scope.sensor_data.orderNatural()
  		window.sensor_data=$scope.sensor_data;
  		console.log('Sensor Data',values);
  		init();
  	});
  	Sensors.t(function(td){
  		// $scope.temp=crossfilter(td);
  		$scope.temp=td;
  		window.temp=$scope.temp;
  		// $scope.sensor_data.orderNatural()
  		console.log('Temp Data',td);
  	});
    $scope.renderers = [{
            id: 'area',
            name: 'Area'
        }, {
            id: 'line',
            name: 'Line'
        }, {
            id: 'bar',
            name: 'Bar'
        }, {
            id: 'scatterplot',
            name: 'Scatterplot'
        }];
    $scope.palettes = [
        'spectrum14',
        'spectrum2000',
        'spectrum2001',
        'colorwheel',
        'cool',
        'classic9',
        'munin'
    ];
    $scope.xAxes = [
        'none',
        'numeric',
        'decade',
        'year',
        'month',
        'week',
        'day',
        '6 hour',
        'hour',
        '15 minute',
        'minute',
        '15 second',
        'second',
        'decisecond',
        'centisecond'
    ];
    $scope.yAxes = [
        'none',
        'formatKMBT',
        'formatBase1024KMGTP'
    ];
    $scope.features0 = {
        hover: {
            xFormatter: function(x) {
                return 't=' + x;
            },
            yFormatter: function(y) {
                return '$' + y;
            }
        }
    };
    $scope.rendererChanged = function(id) {
        if (!$scope['options']) {
            $scope['options'] = {};
        }
        $scope['options'].renderer = $scope['renderer'].id;
    };

    $scope.paletteChanged = function(id) {
        if (!$scope['features']) {
            $scope['features'] = {};
        }
        $scope['features'].palette = $scope['palette'];
    };

    $scope.legendChanged = function(id) {
        if (!$scope['features']) {
            $scope['features'] = {};
        }
        if ($scope['legend']) {
            $scope['features'].legend = {
                toggle: true,
                highlight: true
            };
        }
        else {
            delete $scope['features'].legend;
        }
    };

    $scope.xAxisChanged = function(id) {
        if (!$scope['features']) {
            $scope['features'] = {};
        }
        var xAxis = $scope['xAxis'];
        if (xAxis) {
            if (xAxis === 'none') {
                delete $scope['features'].xAxis;
            }
            else if (xAxis === 'numeric') {
                $scope['features'].xAxis = {
                };
            }
            else {
                $scope['features'].xAxis = {
                    timeUnit: xAxis
                };
            }
        }
        else {
            delete $scope['features'].xAxis;
        }
        $scope['xAxisDisabled'] = true;
    };

    $scope.yAxisChanged = function(id) {
        if (!$scope['features']) {
            $scope['features'] = {};
        }
        var yAxis = $scope['yAxis'];
        if (yAxis) {
            if (yAxis === 'none') {
                delete $scope['features'].yAxis;
            }
            else {
                $scope['features'].yAxis = {
                    tickFormat: yAxis
                };
            }
        }
        else {
            delete $scope['features'].xAxis;
        }
        $scope['yAxisDisabled'] = true;
    };

    $scope.changeSeriesData = function(id) {
        var seriesList = [];
        for (var i = 0; i < 3; i++) {
            var series = {
                name: 'Series ' + (i + 1),
                data: []
            };
            for (var j = 0; j < 10; j++) {
                series.data.push({x: j * 900, y: Math.random() * 10000});
            }
            seriesList.push(series);
        }
        $scope['series'] = _.map($scope.sensor_data,function(v,k){

        	return {
        	    name: k,
        		data: _.map(v,function(d){
			        		return {x:new Date(d.timestamp).getTime(),y:d.value};
	        	})}
        })
        console.log('S',$scope['series']);
        seriesList=angular.copy($scope['series']);
        // $scope['series'] = [_.map($scope.sensor_data,function(d){return {x:new Date(d.timestamp),y:d.value}})];
        // $scope['series'] = seriesList;
    };
    $scope.options = {
        renderer: 'area'
    };
		$scope.series = [];
    $scope.renderer = $scope.renderers[0];
    $scope.palette = $scope.palettes[0];
    $scope.xAxis = 'none';
    $scope.yAxis = 'none';
    $scope.xAxisDisabled = false;
    $scope.yAxisDisabled = false;
  	function init(){

        $scope.rendererChanged();
        $scope.paletteChanged();
        $scope.changeSeriesData();
    }
  });
