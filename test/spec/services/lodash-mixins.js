'use strict';

describe('Service: lodashMixins', function () {

  // load the service's module
  beforeEach(module('senseUiApp'));

  // instantiate service
  var lodashMixins;
  beforeEach(inject(function (_lodashMixins_) {
    lodashMixins = _lodashMixins_;
  }));

  it('should do something', function () {
    expect(!!lodashMixins).toBe(true);
  });

});
