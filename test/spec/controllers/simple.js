'use strict';

describe('Controller: SimpleCtrl', function () {

  // load the controller's module
  beforeEach(module('senseUiApp'));

  var SimpleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SimpleCtrl = $controller('SimpleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SimpleCtrl.awesomeThings.length).toBe(3);
  });
});
