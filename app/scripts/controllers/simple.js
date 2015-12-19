'use strict';

/**
 * @ngdoc function
 * @name senseUiApp.controller:SimpleCtrl
 * @description
 * # SimpleCtrl
 * Controller of the senseUiApp
 */
angular.module('senseUiApp')
  .controller('SimpleCtrl', function ($scope,Sensors,Timeseries) {
		var palette = new Rickshaw.Color.Palette( { scheme: 'spectrum14' } );
		window.TS=Timeseries;
  	Sensors.all(function(values){
  		$scope.sensor_data=_.groupBy(values,'sensorID');

  		// $scope.sensor_data.orderNatural()
  		window.sensor_data=$scope.sensor_data;
  		console.log('Sensor Data',values);

  		// init(6);
  		$scope.timeseries={};
  		$scope.linear={};
  		var bestSettings; // returns { MSE: 0.05086675645862624, method: 'ARMaxEntropy', degree: 4, sample: 20 }


		  $scope['series'] = _.map($scope.sensor_data,function(v,k){
		  	// k=Sensors.sensor_labels[k];
		  	if(v.length>100){// Apply those settings to forecast the n+1 value
			  	$scope.timeseries[k]=new Timeseries(v);
			  	// bestSettings= $scope.timeseries[k].regression_forecast_optimize();

			  	$scope.linear[k]=$scope.timeseries[k].smoother({period:10}).save('smoothed').sliding_regression_forecast({method: 'ARMaxEntropy', degree: 10, sample: 20}).output();
			  	$scope.linear[k]=_($scope.linear[k]).map(function(d){return _.zipObject(['x','y'],d)}).value();
			  	$scope.linear[k]=_.sortBy(_.map($scope.linear[k],function(d){
				    		return {x:new Date(d.x).getTime()/1000,y:d.y};
					}),'x')

		  	}
		  	// console.log('TS',$scope.timeseries[k]);
				return _.takeRight(_.sortBy(_.map(v,function(d){
				    		return {x:new Date(d.timestamp).getTime()/1000,y:d.value};
					}),'x'),4000);
			})

			window.linear=$scope.linear;
			window.timeseries=$scope.timeseries;
  		_.map($scope.sensor_data,function(v,k){console.log(v.length);})
  		_.times(Sensors.count,init)
  	});

  	function init(sensor_index){
  		console.log("Base",$scope.sensor_data[Sensors.sensor_inv[sensor_index]]);
  		console.log("Reg",$scope.linear[Sensors.sensor_inv[sensor_index]]);
			var seriesData = _.takeRight(_.sortBy(_.map($scope.sensor_data[Sensors.sensor_inv[sensor_index] ],function(d){
				    		return {x:new Date(d.timestamp).getTime()/1000,y:d.value};
					}),'x'),4000);//[ [], [], [] ];
			// var random = new Rickshaw.Fixtures.RandomData(150);

			// for (var i = 0; i < 150; i++) {
			// 	random.addData(seriesData);
			// }

			// instantiate our graph!
			palette.color()
			var sx=[
					{
						color: palette.color(),
						data: seriesData,
						name: Sensors.sensor_labels[sensor_index]
					}
				];
			_.log(seriesData)
			// _.log($scope.linear[Sensors.sensor_inv[sensor_index]],Sensors.sensor_inv[sensor_index],seriesData[sensor_index-1],sensor_index,seriesData.length);
			if(seriesData.length>100){
				sx.push(
					{
						color: "#c62828",//palette.color(),
						data: _.takeRight($scope.linear[Sensors.sensor_inv[sensor_index]],seriesData.length),
						name: Sensors.sensor_labels[sensor_index]+' Forecast'
					}
					);
				console.log('Yay');
			}
			var graph = new Rickshaw.Graph( {
				element: document.getElementById("chart"+sensor_index),
				width: 700,
				height: 300,
				renderer: 'line',
				series: sx
			} );

			graph.render();

			var hoverDetail = new Rickshaw.Graph.HoverDetail( {
				graph: graph,
			  tickFormat: function(x){
              return new Date(x).toLocateTimeString();
            }
			} );

			var legend = new Rickshaw.Graph.Legend( {
				graph: graph,
				element: document.getElementById('legend'+sensor_index)

			} );

			var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
				graph: graph,
				legend: legend,
			  timeFixture: new Rickshaw.Fixtures.Time.Local()
			} );

			var ticksTreatment = 'glow';
			var xAxis = new Rickshaw.Graph.Axis.Time( {
				graph: graph,
				ticksTreatment: ticksTreatment,
				timeFixture: new Rickshaw.Fixtures.Time.Local()
			} );

			xAxis.render();

			var yAxis = new Rickshaw.Graph.Axis.Y( {
				graph: graph,
				tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
				ticksTreatment: ticksTreatment
			} );

			yAxis.render();
		}

		window.init=init;
  });
