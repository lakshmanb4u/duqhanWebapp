'use strict';

describe('module: auth, controller: ContactusPublicCtrl', function () {

  // load the controller's module
  beforeEach(module('auth'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ContactusPublicCtrl;
  beforeEach(inject(function ($controller) {
    ContactusPublicCtrl = $controller('ContactusPublicCtrl');
  }));

  it('should do something', function () {
    expect(!!ContactusPublicCtrl).toBe(true);
  });

});
