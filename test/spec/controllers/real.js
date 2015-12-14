'use strict';

describe('Controller: RealCtrl', function () {

  // load the controller's module
  beforeEach(module('senseUiApp'));

  var RealCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RealCtrl = $controller('RealCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RealCtrl.awesomeThings.length).toBe(3);
  });
});
