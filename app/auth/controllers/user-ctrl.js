'use strict';
angular.module('main').controller('UserCtrl', function (
  $log,
  $location,
  $state,
  $localStorage,
  $rootScope,
  $ionicAuth,
  $ionicFacebookAuth,
  $ionicUser,
  // $cordovaGeolocation,
  $timeout,
  $analytics,
  Config,
  Auth,
  Firebase
) {
  var ctrl = this;

  $log.log(
    'Hello from your Controller: UserCtrl in module auth:. ctrl is your controller:',
    ctrl
  );

  ctrl.user = {
    email: '',
    password: ''
  };
  ctrl.savedUser = {
    email: '',
    password: '',
    name: '',
    authtoken: '',
    socialLogin: false,
    userId: ''
  };

  ctrl.loggingUser = {};

  // var posOptions = {timeout: 1000, enableHighAccuracy: false};
  // $cordovaGeolocation
  // .getCurrentPosition(posOptions)
  // .then(function (position) {
  //   $log.log('Geolocation = ');
  //   $log.log(position);
  //   Config.ENV.USER.LATITUDE = position.coords.latitude;
  //   Config.ENV.USER.LONGITUDE = position.coords.longitude;
  // },
  // function (err) {
  //   $log.log('Geolocation error = ');
  //   $log.log(err);
  // });

  ctrl.internalLogin = function (user) {
    // var posOptions = {timeout: 1000, enableHighAccuracy: false};
    // $cordovaGeolocation.getCurrentPosition(posOptions)
    // .then(function (position) {
    //   $log.log('Geolocation = ');
    //   $log.log(position);
    //   Config.ENV.USER.LATITUDE = position.coords.latitude;
    //   Config.ENV.USER.LONGITUDE = position.coords.longitude;
    //   user.latitude = Config.ENV.USER.LATITUDE;
    //   user.longitude = Config.ENV.USER.LONGITUDE;
    //   user.userAgent = ionic.Platform.ua;
    //   return Firebase.includeFCMToken(user);
    // },
    // function (err) {
    //   $log.log('Geolocation error = ');
    //   $log.log(err);
    //   user.latitude = Config.ENV.USER.LATITUDE;
    //   user.longitude = Config.ENV.USER.LONGITUDE;
    //   user.userAgent = ionic.Platform.ua;
    //   return Firebase.includeFCMToken(user);
    // });
    user.latitude = Config.ENV.USER.LATITUDE;
    user.longitude = Config.ENV.USER.LONGITUDE;
    user.userAgent = ionic.Platform.ua;
    Firebase.includeFCMToken(user)
      .then(function (user) {
        return Auth.login(user);
      })
      .then(function (response) {
        $log.log(response);
        ctrl.savedUser.email = user.email;
        ctrl.savedUser.password = user.password;
        ctrl.savedUser.name = response.data.name;
        ctrl.savedUser.authtoken = response.data.authtoken;
        ctrl.savedUser.profileImage = response.data.profileImg;
        ctrl.savedUser.freeProductEligibility = response.data.freeProductEligibility;
        Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
        Config.ENV.USER.NAME = response.data.name;
        Config.ENV.USER.PROFILE_IMG = response.data.profileImg;
        $rootScope.$emit('setUserDetailForMenu');
        $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
        if (ctrl.savedUser.freeProductEligibility) {
          // $state.go('store.freeProducts');
          $state.go('store.products.latest');
        } else {
          $state.go('store.products.latest');
        }

        //$location.path('/store/products/latest');
      })
      .catch(function (response) {
        $log.log(response);
        $localStorage.$reset();
        if (response.data && response.data.statusCode === '403') {
          ctrl.responseCB = 'Invalid credential.';
        } else {
          ctrl.responseCB = 'Something went wrong. Please try again.';
        }
        $state.go('landing');
      });
  };

  ctrl.internalFacebookLogin = function () {
    $log.log('facebookLogin');
    var img = null;
    var fbUser = {};
    // var posOptions = {timeout: 1000, enableHighAccuracy: false};
    // $cordovaGeolocation.getCurrentPosition(posOptions)
    // .then(function (position) {
    //   $log.log('Geolocation = ');
    //   $log.log(position);
    //   Config.ENV.USER.LATITUDE = position.coords.latitude;
    //   Config.ENV.USER.LONGITUDE = position.coords.longitude;
    //   // return $ionicFacebookAuth.login();
    //   // return Auth.facebookLogin();
    // },
    // function (err) {
    //   $log.log('Geolocation error = ');
    //   $log.log(err);
    //   // return $ionicFacebookAuth.login();
    //   // return Auth.facebookLogin();
    // });

    Auth.facebookLogin()
      .then(function (facebook) {
        $log.log('FB data ================');
        $log.log(facebook);
        fbUser.email = facebook.email;
        fbUser.name = facebook.displayName;
        fbUser.fbid = facebook.providerId;
        fbUser.latitude = Config.ENV.USER.LATITUDE;
        fbUser.longitude = Config.ENV.USER.LONGITUDE;
        fbUser.userAgent = ionic.Platform.ua;
        img = facebook.photoURL;
        $log.log('FB picture ================');
        $log.log(img);
        return Firebase.includeFCMToken(fbUser);
      })
      .then(function (fbUser) {
        return Auth.fbLogin(fbUser);
      })
      .then(function (response) {
        $log.log('FB response =====================');
        $log.log(response);
        ctrl.savedUser.email = fbUser.email;
        ctrl.savedUser.name = fbUser.name;
        ctrl.savedUser.userId = fbUser.fbid;
        ctrl.savedUser.authtoken = response.data.authtoken;
        ctrl.savedUser.profileImage = response.data.profileImg ? response.data.profileImg : img;
        ctrl.savedUser.freeProductEligibility = response.data.freeProductEligibility;
        ctrl.savedUser.socialLogin = true;
        Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
        Config.ENV.USER.NAME = response.data.name;
        Config.ENV.USER.PROFILE_IMG = ctrl.savedUser.profileImage;
        $rootScope.$emit('setUserDetailForMenu');
        $log.log('FB picture ================');
        $log.log(img);
        $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
        if (response.data.isFirstLogin) {
          $analytics.eventTrack('CompleteRegistration');
        }
        if (ctrl.savedUser.freeProductEligibility) {
          // $state.go('store.freeProducts');
          $state.go('store.products.latest');
        } else {
          $state.go('store.products.latest');
        }
        /* eslint-disable camelcase */
        window.Intercom('boot', {
          app_id: 'zcqrnybo',
          email: ctrl.savedUser.email,
          user_id: ctrl.savedUser.userId
        });
        /* eslint-enable camelcase */
        window.Intercom('update');
      })
      .catch(function (error) {
        $log.log(error);
        $localStorage.$reset();
        $state.go('landing');
      });
  };

  ctrl.autoLogin = function () {
    var savedUser = $localStorage.savedUser;
    if (!savedUser) {
      return;
    }

    var parsedUser = JSON.parse(savedUser);
    $log.log(parsedUser);

    if (parsedUser.socialLogin) {
      // var fbUser = {};
      // var img = null;
      Auth.isLoggedIn()
        .then(function () {
          if (parsedUser.freeProductEligibility) {
            // $state.go('store.freeProducts');
            $state.go('store.products.latest');
          } else {
            $state.go('store.products.latest');
          }
          // fbUser.email = response.email;
          // fbUser.name = response.displayName;
          // fbUser.fbid = response.providerId;
          // img = response.photoURL;
          // Firebase.includeFCMToken(fbUser)
          //   .then(function (fbUser) {
          //     return Auth.fbLogin(fbUser);
          //   })
          //   .then(function (response) {
          //     $log.log(response);
          //     ctrl.savedUser.email = fbUser.email;
          //     ctrl.savedUser.name = fbUser.name;
          //     ctrl.savedUser.userId = fbUser.fbid;
          //     ctrl.savedUser.profileImage = response.data.profileImg ? response.data.profileImg : img;
          //     ctrl.savedUser.freeProductEligibility = response.data.freeProductEligibility;
          //     ctrl.savedUser.authtoken = response.data.authtoken;
          //     ctrl.savedUser.mobile = response.data.mobile;
          //     ctrl.savedUser.socialLogin = true;
          //     Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
          //     Config.ENV.USER.NAME = response.data.name;
          //     Config.ENV.USER.PROFILE_IMG = ctrl.savedUser.profileImage;
          //     $rootScope.$emit('setUserDetailForMenu');
          //     $log.log('FB picture ================');
          //     $log.log(img);
          //     $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
          //     if (ctrl.savedUser.freeProductEligibility) {
          //       $state.go('store.freeProducts');
          //     } else {
          //       $state.go('store.products.latest');
          //     }
          //   })
          //   .catch(function (error) {
          //     $log.log(error);
          //     $localStorage.$reset();
          //     $state.go('landing');
          //   });
        })
        .catch(function (error) {
          $log.log(error);
          ctrl.internalFacebookLogin();
        });
    } else {
      var user = {};
      user.email = parsedUser.email;
      user.password = parsedUser.password;
      ctrl.internalLogin(user);
    }
  };

  // Call autologin
  ctrl.autoLogin();
  window.Intercom('boot', {
    // eslint-disable-next-line camelcase
    app_id: 'zcqrnybo'
  });

  // Catching calls from outside this controller
  $rootScope.$on('internalLogin', function (event, user) {
    $log.log(event);
    $log.log('on internalLogin');
    ctrl.internalLogin(user);
  });
  $rootScope.$on('internalFacebookLogin', function (event) {
    $log.log(event);
    $log.log('on internalFacebookLogin');
    ctrl.internalFacebookLogin();
  });

  ctrl.notification = {};

  ctrl.facebookLogin = function () {
    ctrl.internalFacebookLogin();
  };

  ctrl.setNotification = function (notification) {
    ctrl.notification.type = notification.type;
    ctrl.notification.text = notification.text;
    $timeout(function () {
      ctrl.notification = {};
    }, 5000);
  };

  $rootScope.$on('setUnauthorizedNotification', function (event, notification) {
    $log.log(event);
    ctrl.setNotification(notification);
  });
});
