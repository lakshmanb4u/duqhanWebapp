'use strict';
angular.module('store').controller('GuestUserCtrl', function (
  $location,
  $state,
  $localStorage,
  $rootScope,
  $ionicAuth,
  $ionicFacebookAuth,
  $ionicUser,
  $stateParams,
  // $cordovaGeolocation,
  $timeout,
  $analytics,
  Config,
  Auth,
  Firebase,
  $http
) {
  var ctrl = this;
  console.log('Control :', ctrl);
  console.log("saved user....",$localStorage.savedUser);
  if ($localStorage.savedUser != null){
    $state.go('store');
  }
  console.log(angular.isDefined($stateParams.productId));
  if (angular.isDefined($stateParams.productId) && $stateParams.productId !== '') {
      console.log($stateParams.productId);
      $localStorage.pId = $stateParams.productId;
      ctrl.productId = $localStorage.pId;
  }
  document.getElementById("body").classList.remove('authenticate');
  document.getElementById("body").classList.add('landing');

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
  $rootScope.isInternalLogin = false;
  $rootScope.isInternalFacebookLogin = false;

  ctrl.internalLogin = function (user) {
    console.log('In login');
    $rootScope.isInternalLogin = true;
    user.latitude = Config.ENV.USER.LATITUDE;
    user.longitude = Config.ENV.USER.LONGITUDE;
    user.countryCode = ctrl.countryCode;
    user.userAgent = ionic.Platform.ua;
    Firebase.includeFCMToken(user)
      .then(function (user) {
        return Auth.login(user);
      })
      .then(function (response) {
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
        //destroyFunction();
        if (ctrl.savedUser.freeProductEligibility) {
          // $state.go('store.freeProducts');
          $state.go('store.overview', {productId: $localStorage.pId});
        } else {
          $state.go('store.overview', {productId: $localStorage.pId});;
        }

        //$location.path('/store/products/latest');
      })
      .catch(function (response) {
        $localStorage.$reset();
        if (response.data && response.data.statusCode === '403') {
          ctrl.responseCB = 'Invalid credential.';
        } else {
          ctrl.responseCB = 'Something went wrong. Please try again.';
        }
        //$state.go('landing');
        $rootScope.isInternalLogin = false;
        //destroyFunction();
        $rootScope.$emit('onLoginFail', ctrl.responseCB);
      });
  };

  ctrl.internalFacebookLogin = function () {
    var img = null;
    var fbUser = {};
    $rootScope.isInternalFacebookLogin = true;
    var deregisterKey = $rootScope.$on('event:social-sign-in-success', function(event, userDetails){
      console.log('UserDetails : ', userDetails);
      console.log('Event : ', event);
      fbUser.email = userDetails.email;
      fbUser.name = userDetails.name;
      fbUser.fbid = userDetails.uid;
      fbUser.latitude = Config.ENV.USER.LATITUDE;
      fbUser.longitude = Config.ENV.USER.LONGITUDE;
      fbUser.countryCode = ctrl.countryCode;
      fbUser.userAgent = ionic.Platform.ua;
      img = userDetails.imageUrl;
      Firebase.includeFCMToken(fbUser).then(function (){
        Auth.fbLogin(fbUser).then(function(response){
          console.log('Response of Fblogin :', response); 
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
          $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
          if (response.data.isFirstLogin) {
            $analytics.eventTrack('CompleteRegistration');
          }
          if (ctrl.savedUser.freeProductEligibility) {
            // $state.go('store.freeProducts');
            $state.go('store.overview', {productId: $localStorage.pId});
          } else {
            $state.go('store.overview', {productId: $localStorage.pId});
          }
          /* eslint-disable camelcase */
          window.Intercom('boot', {
            app_id: 'zcqrnybo',
            email: ctrl.savedUser.email,
            user_id: ctrl.savedUser.userId
          });
          /* eslint-enable camelcase */
          window.Intercom('update');
          deregisterKey();
        }).catch(function (error) {
            $localStorage.$reset();
            $rootScope.isInternalFacebookLogin = false;
            deregisterKey();
            $state.go('store.guest-landing',{productId: $localStorage.pId});
        });
  
      });
    });
  };

  ctrl.login = function () {
    console.log('IN LOGIN1');
    ctrl.responseCB = '';
    if (ctrl.loginForm.$valid) {
      $rootScope.$emit('guestInternalLogin', ctrl.user);
    } else {
      ctrl.responseCB = 'Invalid credential.';
    }
    if (ctrl.buttonView) {
      ctrl.buttonView = false;
      ctrl.loginButtonText = 'Login';
    } else {
      
    }
    };

  window.Intercom('boot', {
    // eslint-disable-next-line camelcase
    app_id: 'zcqrnybo'
  });

  // Catching calls from outside this controller
  var destroyFunction = $rootScope.$on('guestInternalLogin', function (event, user) {
    console.log("internal login called...........",$rootScope.isInternalLogin);
    if($rootScope.isInternalLogin == false) {
      ctrl.internalLogin(user);
    }
  });
  $rootScope.$on('guestInternalFacebookLogin', function (event) {
    console.log("internal fb login............",$rootScope.isInternalFacebookLogin);
    if($rootScope.isInternalFacebookLogin == false) {
      ctrl.internalFacebookLogin();
    }
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
    ctrl.setNotification(notification);
  });
  navigator.geolocation.getCurrentPosition(function(location) {
    Config.ENV.USER.LATITUDE = location.coords.latitude;
    Config.ENV.USER.LONGITUDE = location.coords.longitude;
  });
  $http.get('http://ip-api.com/json')
  .success(function(data) {
      console.log(data.countryCode)
      ctrl.countryCode = data.countryCode;
  });
});
