'use strict';

/**
 * @ngdoc function
 * @name senseUiApp.controller:RealCtrl
 * @description
 * # RealCtrl
 * Controller of the senseUiApp
 */
angular.module('senseUiApp')
  .controller('RealCtrl', function ($scope,Sensors) {

		// set up our data series with 150 random data points
  	Sensors.all(function(values){
  		$scope.sensor_data=_.groupBy(values,'sensorID');
  		// $scope.sensor_data.orderNatural()
  		window.sensor_data=$scope.sensor_data;
  		console.log('Sensor Data',values);
  		init();
  	});
  	function init(){
			var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );
			var seriesData = [ [], [], [], [], [], [], [], [], [] ];
		  $scope['series'] = _.map($scope.sensor_data,function(v,k){

				return _.takeRight(_.sortBy(_.map(v,function(d){
				    		return {x:new Date(d.timestamp).getUTCSeconds(),y:d.value};
					}),'x'),1500);
			})
			seriesData = angular.copy($scope['series']);
			console.log($scope['series']);
			var random = new Rickshaw.Fixtures.RandomData(150);
			console.log(random);
			// for (var i = 0; i < 150; i++) {
			// 	random.addData(seriesData);
			// }
			console.log('S',seriesData);

			// instantiate our graph!

			var graph = new Rickshaw.Graph( {
				element: document.getElementById("chart"),
				width: 700,
				height: 300,
				renderer: 'area',
				stroke: true,
				preserve: true,
				series: [
					{
						color: palette.color(),
						data: seriesData[0],
						name: 'Temperature'
					}
					, {
						color: palette.color(),
						data: seriesData[1],
						name: _.keys(sensor_data)[1]
					}//, {
					// 	color: palette.color(),
					// 	data: seriesData[2],
					// 	name: _.keys(sensor_data)[2]
					// }, {
					// 	color: palette.color(),
					// 	data: seriesData[3],
					// 	name: _.keys(sensor_data)[3]
					// }, {
					// 	color: palette.color(),
					// 	data: seriesData[4],
					// 	name: _.keys(sensor_data)[4]
					// }, {
					// 	color: palette.color(),
					// 	data: seriesData[5],
					// 	name: _.keys(sensor_data)[5]
					// }, {
					// 	color: palette.color(),
					// 	data: seriesData[6],
					// 	name: _.keys(sensor_data)[6]
					// }
				]
			} );

			graph.render();

			var preview = new Rickshaw.Graph.RangeSlider( {
				graph: graph,
				element: document.getElementById('preview'),
			} );

			var hoverDetail = new Rickshaw.Graph.HoverDetail( {
				graph: graph,
				xFormatter: function(x) {
					return new Date(x * 1000).toString();
				}
			} );

			var annotator = new Rickshaw.Graph.Annotate( {
				graph: graph,
				element: document.getElementById('timeline')
			} );

			var legend = new Rickshaw.Graph.Legend( {
				graph: graph,
				element: document.getElementById('legend')

			} );

			var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
				graph: graph,
				legend: legend
			} );

			var order = new Rickshaw.Graph.Behavior.Series.Order( {
				graph: graph,
				legend: legend
			} );

			var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
				graph: graph,
				legend: legend
			} );

			var smoother = new Rickshaw.Graph.Smoother( {
				graph: graph,
				element: document.querySelector('#smoother')
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


			var controls = new RenderControls( {
				element: document.querySelector('form'),
				graph: graph
			} );

			// add some data every so often

			var messages = [
				"Changed home page welcome message",
				"Minified JS and CSS",
				"Changed button color from blue to green",
				"Refactored SQL query to use indexed columns",
				"Added additional logging for debugging",
				"Fixed typo",
				"Rewrite conditional logic for clarity",
				"Added documentation for new methods"
			];
			$scope.idx=0;
			setInterval( function() {
				// random.removeData(seriesData);
				seriesData[0]=_.takeRight(seriesData[0],280);
				seriesData[0]=_(seriesData[0]).concat(_.slice($scope.series[0],$scope.idx,$scope.idx+20));
				$scope.idx=($scope.idx+20)%300
				// random.addData(seriesData);
				graph.update();

			}, 3000 );

			function addAnnotation(force) {
				if (messages.length > 0 && (force || Math.random() >= 0.95)) {
					annotator.add(seriesData[2][seriesData[2].length-1].x, messages.shift());
					annotator.update();
				}
			}

			addAnnotation(true);
			setTimeout( function() { setInterval( addAnnotation, 6000 ) }, 6000 );

			var previewXAxis = new Rickshaw.Graph.Axis.Time({
				graph: preview,
				timeFixture: new Rickshaw.Fixtures.Time.Local(),
				ticksTreatment: ticksTreatment
			});

			previewXAxis.render();
		}
  });
