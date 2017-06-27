'use strict';

describe('module: store, controller: AfterPaymentCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var AfterPaymentCtrl;
  beforeEach(inject(function ($controller) {
    AfterPaymentCtrl = $controller('AfterPaymentCtrl');
  }));

  it('should do something', function () {
    expect(!!AfterPaymentCtrl).toBe(true);
  });

});
