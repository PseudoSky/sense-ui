'use strict';

describe('Service: Sensors', function () {

  // load the service's module
  beforeEach(module('senseUiApp'));

  // instantiate service
  var Sensors;
  beforeEach(inject(function (_Sensors_) {
    Sensors = _Sensors_;
  }));

  it('should do something', function () {
    expect(!!Sensors).toBe(true);
  });

});
