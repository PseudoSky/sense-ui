'use strict';

describe('Service: Timeseries', function () {

  // load the service's module
  beforeEach(module('senseUiApp'));

  // instantiate service
  var Timeseries;
  beforeEach(inject(function (_Timeseries_) {
    Timeseries = _Timeseries_;
  }));

  it('should do something', function () {
    expect(!!Timeseries).toBe(true);
  });

});
