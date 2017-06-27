'use strict';
angular.module('auth')
.factory('Auth', function ($log, $http, $cordovaFacebook, $q, Config) {

  $log.log('Hello from your Service: AuthAPI in module auth');

  return {
    facebookLogin: function () {
      var q = $q.defer();
      var signedInUser = {};
      $cordovaFacebook.login(['email, public_profile'])
      .then(function (response) {
        $log.log(response);
        if (response.status === 'connected') {
          signedInUser.providerAccessToken = response.authResponse.accessToken;
          signedInUser.providerId = response.authResponse.userID;
          signedInUser.provider = 'facebook.com';
          $cordovaFacebook.api('me?fields=picture.type(large),name,email')
          .then(function (response) {
            signedInUser.displayName = response.name;
            signedInUser.email = response.email;
            signedInUser.photoURL = response.picture.data.url;
            q.resolve(signedInUser);
          }, function (error) {
            $log.log(error);
            return q.reject(response);
          });
        } else {
          return q.reject(response);
        }
      }, function (error) {
        $log.log(error);
        return q.reject(error);
      });
      return q.promise;
    },
    isLoggedIn: function () {
      var q = $q.defer();
      var signedInUser = {};
      $cordovaFacebook.getLoginStatus()
      .then(function (response) {
        $log.log(response);
        if (response.status === 'connected') {
          signedInUser.providerAccessToken = response.authResponse.accessToken;
          signedInUser.providerId = response.authResponse.userID;
          signedInUser.provider = 'facebook.com';
          $cordovaFacebook.api('me?fields=picture.type(large),name,email')
          .then(function (response) {
            signedInUser.displayName = response.name;
            signedInUser.email = response.email;
            signedInUser.photoURL = response.picture.data.url;
            q.resolve(signedInUser);
          }, function (error) {
            $log.log(error);
            return q.reject(response);
          });
        } else {
          return q.reject(response);
        }
      }, function (error) {
        $log.log(error);
        return q.reject(error);
      });
      return q.promise;
    },
    login: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'login', user);
    },

    signup: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'signup', user);
    },

    requestPasswordReset: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'request-password-reset', user);
    },

    confirmPasswordReset: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'confirm-password_reset', user);
    },

    fbLogin: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'fb-login', user);
    },

    logout: function (user) {
      return $http.post(Config.ENV.SERVER_URL + 'user/logout', user);
    }
  };
});
