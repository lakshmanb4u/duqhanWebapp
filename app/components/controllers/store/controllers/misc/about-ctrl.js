'use strict';
angular.module('store')
.controller('AboutCtrl', function ($log, $window) {

  $log.log('Hello from your Controller: AboutCtrl in module store:. This is your controller:', this);
  $window.scrollTo(0, 0);
});
