'use strict';

describe('module: store, controller: TermsConditionsCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var TermsConditionsCtrl;
  beforeEach(inject(function ($controller) {
    TermsConditionsCtrl = $controller('TermsConditionsCtrl');
  }));

  it('should do something', function () {
    expect(!!TermsConditionsCtrl).toBe(true);
  });

});
