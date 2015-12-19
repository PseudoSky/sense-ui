'use strict';

/**
 * @ngdoc overview
 * @name senseUiApp
 * @description
 * # senseUiApp
 *
 * Main module of the application.
 */



angular
  .module('senseUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'restangular',
    'nvd3ChartDirectives',
    'angular-rickshaw',
    'lodashMixins',
    'ngTouch'//,
    // 'd3'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/simple.html',
        controller: 'SimpleCtrl',
        controllerAs: 'simple'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/real', {
        templateUrl: 'views/real.html',
        controller: 'RealCtrl',
        controllerAs: 'real'
      })
      .when('/simple', {
        templateUrl: 'views/simple.html',
        controller: 'SimpleCtrl',
        controllerAs: 'simple'
      })
      .otherwise({
        redirectTo: '/'
      });
  });



