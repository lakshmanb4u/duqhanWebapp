'use strict';
angular.module('main')
.factory('Firebase', function ($q) {


  return {
    includeFCMToken: function (user) {
      var q = $q.defer();
      if (window.cordova) {
        // eslint-disable-next-line no-undef
        FCMPlugin.getToken( function (token) {
          user.fcmToken = token;
          q.resolve(user);
        });
      } else {
        q.resolve(user);
      }
      return q.promise;
    }
  };

});
