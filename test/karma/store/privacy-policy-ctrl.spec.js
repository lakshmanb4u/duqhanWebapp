'use strict';

describe('module: store, controller: PrivacyPolicyCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var PrivacyPolicyCtrl;
  beforeEach(inject(function ($controller) {
    PrivacyPolicyCtrl = $controller('PrivacyPolicyCtrl');
  }));

  it('should do something', function () {
    expect(!!PrivacyPolicyCtrl).toBe(true);
  });

});
