'use strict';

describe('module: store, controller: AboutCtrl', function () {

  // load the controller's module
  beforeEach(module('store'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var AboutCtrl;
  beforeEach(inject(function ($controller) {
    AboutCtrl = $controller('AboutCtrl');
  }));

  it('should do something', function () {
    expect(!!AboutCtrl).toBe(true);
  });

});
