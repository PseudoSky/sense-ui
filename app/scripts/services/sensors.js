'use strict';

/**
 * @ngdoc service
 * @name senseUiApp.Sensors
 * @description
 * # Sensors
 * Factory in the senseUiApp.
 */
angular.module('senseUiApp')
  .factory('Sensors', function(Restangular,$resource) {
  	var self={
				sensors:  ['t','h','p','ch4','lpg','co','lux'],
				count:7,
				sensor_labels:{
					't':'Temperature (celcius)',
					'h':'Humidity',
					'p':'Pressure (atm)',
					'lpg':'Butane (lpg)',
					'ch4':'Methane (ch4)',
					'co':'Carbon Monoxide (co)',
					'lux':'Light Intensity'
				},
				sensor_inv:{
					0:'t',
					1:'h',
					2:'p',
					3:'lpg',
					4:'ch4',
					5:'co',
					6:'lux'
				},

  		raw: 		  $resource("http://localhost:50000/values/:sensor")
  	}
  	_.extend(self.sensor_labels,_.values(self.sensor_labels))
  	_.extend(self.sensor_labels,_.invert(self.sensor_labels));
  	// console.log('SL',self.sensor_labels,_.values(self.sensor_labels).length);

  	self.all=function(callback){
  		return self.raw.query(callback)
  	}

  	self.sensor=function(sensor,callback){
  		return self.raw.query({"sensor":sensor},callback)
  	}

  	self.sensors.forEach(function(s){
  		self[s]=_.partial(self.sensor,s);
  	});


  	return self;

  // return Restangular.withConfig(function(RestangularConfigurer) {
  //   // RestangularConfigurer.setBaseUrl('http://udbs-lukehottinger.rhcloud.com');
  //   RestangularConfigurer.setBaseUrl('http://localhost:50000/values');
		// RestangularConfigurer.setResponseExtractor(function(response) {
		//   var newResponse = response;
		//   if (angular.isArray(response)) {
		//   	console.log('Array',response);
		//     angular.forEach(newResponse, function(value, key) {
		//       newResponse[key] = angular.copy(value);
		//     });
		//   } else {
		//     newResponse = angular.copy(response);
		//   }

		//   return newResponse;
		// });
  // });
});